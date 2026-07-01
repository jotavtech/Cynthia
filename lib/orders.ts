import { prisma } from "@/lib/prisma";

export async function getAdminOrders(page = 1, perPage = 15) {
  const currentPage = Math.max(1, page);
  const [items, total] = await Promise.all([
    prisma.order.findMany({
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
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count(),
  ]);

  return {
    items,
    total,
    page: currentPage,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
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
