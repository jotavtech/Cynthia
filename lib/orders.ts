import { prisma } from "@/lib/prisma";

export async function getAdminOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      customerName: true,
      customerPhone: true,
      status: true,
      total: true,
      createdAt: true,
      _count: { select: { items: true } },
    },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

export async function countPendingOrders() {
  return prisma.order.count({ where: { status: "PENDING" } });
}
