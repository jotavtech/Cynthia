"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { getSiteSettings } from "@/lib/settings";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import {
  centsToDecimalString,
  formatMoney,
  fromCents,
  toCents,
} from "@/lib/money";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { checkoutSchema, orderStatusSchema } from "@/lib/validations/order";
import type { OrderStatus } from "@/generated/prisma/enums";

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

/**
 * Indica se um status implica que o estoque ja foi consumido. A baixa acontece
 * ao sair de um status "nao consumido" (PENDING/CANCELLED) para um "consumido";
 * a reposicao acontece no caminho inverso (ex.: cancelar um pedido confirmado).
 */
function statusConsumesStock(status: OrderStatus): boolean {
  return status !== "PENDING" && status !== "CANCELLED";
}

export type OrderStatusState = {
  error?: string;
  success?: boolean;
};

export async function createOrderAction(
  payload: CheckoutPayload,
): Promise<CheckoutResult> {
  // Endpoint publico: limita a criacao de pedidos por IP para evitar spam de
  // pedidos falsos e sobrecarga no banco (10 pedidos por 10 minutos).
  const ip = await getClientIp();
  const limit = rateLimit(`checkout:${ip}`, 10, 10 * 60_000);
  if (!limit.allowed) {
    return {
      ok: false,
      error: "Muitos pedidos em sequencia. Aguarde alguns minutos.",
    };
  }

  const parsed = checkoutSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    };
  }

  const data = parsed.data;

  // Nunca confiar em precos do cliente: buscar do banco. Tambem trazemos o
  // estoque para validar disponibilidade antes de criar o pedido.
  const products = await prisma.product.findMany({
    where: {
      id: { in: data.items.map((item) => item.id) },
      isActive: true,
      deletedAt: null,
    },
    select: { id: true, name: true, price: true, stock: true },
  });

  const productById = new Map(products.map((product) => [product.id, product]));

  // Toda a aritmetica monetaria e feita em centavos inteiros (ver lib/money).
  const lineItems = data.items
    .map((item) => {
      const product = productById.get(item.id);
      if (!product) return null;
      const unitPriceCents = toCents(product.price.toString());
      const lineTotalCents = unitPriceCents * item.quantity;
      return {
        productId: product.id,
        productNameSnapshot: product.name,
        productPriceSnapshot: centsToDecimalString(unitPriceCents),
        quantity: item.quantity,
        stock: product.stock,
        total: centsToDecimalString(lineTotalCents),
        lineTotalCents,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (lineItems.length === 0) {
    return { ok: false, error: "Nenhum produto valido no carrinho." };
  }

  // Valida estoque: nao deixa fechar pedido acima do disponivel.
  const outOfStock = lineItems.filter((item) => item.quantity > item.stock);
  if (outOfStock.length > 0) {
    const names = outOfStock
      .map((item) =>
        item.stock > 0
          ? `${item.productNameSnapshot} (restam ${item.stock})`
          : `${item.productNameSnapshot} (esgotado)`,
      )
      .join(", ");
    return {
      ok: false,
      error: `Estoque insuficiente para: ${names}.`,
    };
  }

  const subtotalCents = lineItems.reduce(
    (sum, item) => sum + item.lineTotalCents,
    0,
  );

  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail ?? null,
      customerAddress: data.customerAddress ?? null,
      notes: data.notes ?? null,
      subtotal: centsToDecimalString(subtotalCents),
      total: centsToDecimalString(subtotalCents),
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
        `${item.quantity}x ${item.productNameSnapshot} - ${formatMoney(fromCents(item.lineTotalCents))}`,
    ),
    "",
    `Total: ${formatMoney(fromCents(subtotalCents))}`,
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
  _prevState: OrderStatusState,
  formData: FormData,
): Promise<OrderStatusState> {
  const session = await requireAdmin();
  const orderId = formData.get("orderId")?.toString();
  const statusParsed = orderStatusSchema.safeParse(formData.get("status"));

  if (!orderId || !statusParsed.success) {
    return { error: "Dados invalidos." };
  }

  const newStatus = statusParsed.data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return { error: "Pedido nao encontrado." };
  }

  if (order.status === newStatus) {
    return { error: "O pedido ja esta nesse status." };
  }

  const previousStatus = order.status;
  const wasConsumed = statusConsumesStock(previousStatus);
  const willConsume = statusConsumesStock(newStatus);

  const processed = await prisma.$transaction(async (tx) => {
    // Gate atomico: so um chamador vence a transicao. Impede que confirmacoes
    // simultaneas do mesmo pedido mexam no estoque duas vezes.
    const gate = await tx.order.updateMany({
      where: { id: orderId, status: previousStatus },
      data: { status: newStatus },
    });

    if (gate.count === 0) {
      return false;
    }

    // Baixa (SALE) ao passar a consumir estoque; reposicao (RETURN) ao deixar
    // de consumir (ex.: cancelar um pedido ja confirmado).
    if (wasConsumed !== willConsume) {
      const delta = willConsume ? -1 : 1; // -1 = saida, +1 = entrada
      for (const item of order.items) {
        if (!item.productId) continue;

        // Ajuste atomico do saldo; retorna o novo estoque ja consistente.
        const updated = await tx.product.update({
          where: { id: item.productId },
          data:
            delta < 0
              ? { stock: { decrement: item.quantity } }
              : { stock: { increment: item.quantity } },
          select: { stock: true },
        });

        const newStock = updated.stock;
        const previousStock = newStock - delta * item.quantity;

        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: willConsume ? "SALE" : "RETURN",
            quantity: delta * item.quantity,
            previousStock,
            newStock,
            reason: willConsume
              ? `Pedido ${orderCode(order.id)} confirmado`
              : `Pedido ${orderCode(order.id)} cancelado (estoque reposto)`,
            createdById: session.userId,
          },
        });
      }
    }

    return true;
  });

  if (!processed) {
    return { error: "O status do pedido foi alterado por outra acao." };
  }

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
  revalidatePath("/admin/estoque");
  // Estoque mudou: atualiza as paginas publicas (ISR) sob demanda.
  if (wasConsumed !== willConsume) {
    revalidatePath("/produtos");
    revalidatePath("/");
  }

  return { success: true };
}
