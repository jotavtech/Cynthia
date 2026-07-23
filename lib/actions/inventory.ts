"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { stockAdjustmentSchema } from "@/lib/validations/order";

export type StockFormState = {
  error?: string;
  success?: boolean;
};

/**
 * Registra uma movimentacao de estoque e ajusta o saldo do produto de forma
 * atomica. `quantity` positiva soma (entrada) e negativa subtrai (saida).
 */
export async function adjustStockAction(
  _prev: StockFormState,
  formData: FormData,
): Promise<StockFormState> {
  const session = await requireAdmin();

  const parsed = stockAdjustmentSchema.safeParse({
    productId: formData.get("productId"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
    reason: formData.get("reason"),
    notes: formData.get("notes") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos." };
  }

  const data = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: data.productId },
        select: { stock: true },
      });

      if (!product) {
        throw new Error("Produto nao encontrado.");
      }

      const newStock = Math.max(0, product.stock + data.quantity);

      await tx.inventoryTransaction.create({
        data: {
          productId: data.productId,
          type: data.type,
          quantity: data.quantity,
          previousStock: product.stock,
          newStock,
          reason: data.reason,
          notes: data.notes ?? null,
          createdById: session.userId,
        },
      });

      await tx.product.update({
        where: { id: data.productId },
        data: { stock: newStock },
      });
    });
  } catch (error) {
    return { error: (error as Error).message };
  }

  await recordAudit({
    userId: session.userId,
    entity: "Product",
    entityId: data.productId,
    action: "STOCK_CHANGE",
    description: `${data.type} ${data.quantity} (${data.reason})`,
  });

  revalidatePath("/admin/estoque");
  revalidatePath("/admin/produtos");
  // Estoque mudou: atualiza as paginas publicas (ISR) sob demanda.
  revalidatePath("/produtos");
  revalidatePath("/");
  return { success: true };
}
