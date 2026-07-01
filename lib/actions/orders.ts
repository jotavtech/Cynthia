"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { getSiteSettings } from "@/lib/settings";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { formatMoney } from "@/lib/money";
import { checkoutSchema, orderStatusSchema } from "@/lib/validations/order";

export type CheckoutResult =
  | { ok: true; orderId: string; whatsappUrl: string }
  | { ok: false; error: string };

type CheckoutPayload = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  notes?: string;
  items: { id: string; quantity: number }[];
};

function orderCode(id: string) {
  return id.slice(-6).toUpperCase();
}

export async function createOrderAction(
  payload: CheckoutPayload,
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    };
  }

  const data = parsed.data;

  // Nunca confiar em precos do cliente: buscar do banco.
  const products = await prisma.product.findMany({
    where: {
      id: { in: data.items.map((item) => item.id) },
      isActive: true,
      deletedAt: null,
    },
    select: { id: true, name: true, price: true },
  });

  const productById = new Map(products.map((product) => [product.id, product]));

  const lineItems = data.items
    .map((item) => {
      const product = productById.get(item.id);
      if (!product) return null;
      const unitPrice = Number(product.price);
      const total = unitPrice * item.quantity;
      return {
        productId: product.id,
        productNameSnapshot: product.name,
        productPriceSnapshot: unitPrice.toFixed(2),
        quantity: item.quantity,
        total: total.toFixed(2),
        unitPrice,
        lineTotal: total,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (lineItems.length === 0) {
    return { ok: false, error: "Nenhum produto valido no carrinho." };
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail ?? null,
      customerAddress: data.customerAddress ?? null,
      notes: data.notes ?? null,
      subtotal: subtotal.toFixed(2),
      total: subtotal.toFixed(2),
      items: {
        create: lineItems.map((item) => ({
          productId: item.productId,
          productNameSnapshot: item.productNameSnapshot,
          productPriceSnapshot: item.productPriceSnapshot,
          quantity: item.quantity,
          total: item.total,
        })),
      },
    },
    select: { id: true },
  });

  await recordAudit({
    entity: "Order",
    entityId: order.id,
    action: "CREATE",
    description: `Pedido ${orderCode(order.id)} criado por ${data.customerName}`,
  });

  const settings = await getSiteSettings();
  const whatsapp = settings?.whatsapp ?? process.env.STORE_WHATSAPP ?? "";

  const message = [
    `Ola! Fiz o pedido ${orderCode(order.id)} no site da Cynthia Makes.`,
    "",
    ...lineItems.map(
      (item) =>
        `${item.quantity}x ${item.productNameSnapshot} - ${formatMoney(item.lineTotal)}`,
    ),
    "",
    `Total: ${formatMoney(subtotal)}`,
    `Nome: ${data.customerName}`,
    `Telefone: ${data.customerPhone}`,
    ...(data.customerAddress ? [`Entrega: ${data.customerAddress}`] : []),
    ...(data.notes ? [`Observacoes: ${data.notes}`] : []),
  ].join("\n");

  revalidatePath("/admin/pedidos");

  return {
    ok: true,
    orderId: order.id,
    whatsappUrl: buildWhatsappUrl(whatsapp, message),
  };
}

export async function updateOrderStatusAction(
  formData: FormData,
): Promise<void> {
  const session = await requireAdmin();
  const orderId = formData.get("orderId")?.toString();
  const statusParsed = orderStatusSchema.safeParse(formData.get("status"));

  if (!orderId || !statusParsed.success) {
    return;
  }

  const newStatus = statusParsed.data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.status === newStatus) {
    return;
  }

  const previousStatus = order.status;

  await prisma.$transaction(async (tx) => {
    // Baixa de estoque ao confirmar um pedido pendente (uma unica vez).
    if (previousStatus === "PENDING" && newStatus === "CONFIRMED") {
      for (const item of order.items) {
        if (!item.productId) continue;

        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        });
        if (!product) continue;

        const newStock = Math.max(0, product.stock - item.quantity);

        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: "SALE",
            quantity: -item.quantity,
            previousStock: product.stock,
            newStock,
            reason: `Pedido ${orderCode(order.id)} confirmado`,
            createdById: session.userId,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: newStock },
        });
      }
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  });

  await recordAudit({
    userId: session.userId,
    entity: "Order",
    entityId: orderId,
    action: "ORDER_STATUS_CHANGE",
    description: `Status ${previousStatus} -> ${newStatus}`,
  });

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/produtos");
}
