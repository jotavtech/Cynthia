import { prisma } from "@/lib/prisma";

export async function getStockOverview() {
  return prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: { stock: "asc" },
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
      lowStockThreshold: true,
    },
  });
}

export async function getRecentTransactions(limit = 20) {
  return prisma.inventoryTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      quantity: true,
      previousStock: true,
      newStock: true,
      reason: true,
      createdAt: true,
      product: { select: { name: true } },
      createdBy: { select: { email: true, name: true } },
    },
  });
}

export async function getProductTransactions(productId: string, limit = 10) {
  return prisma.inventoryTransaction.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      quantity: true,
      previousStock: true,
      newStock: true,
      reason: true,
      createdAt: true,
    },
  });
}
