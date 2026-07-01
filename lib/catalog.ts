import { prisma } from "@/lib/prisma";

const productListSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  compareAtPrice: true,
  stock: true,
  isActive: true,
  isFeatured: true,
  isNew: true,
  category: { select: { name: true, slug: true } },
  brand: { select: { name: true } },
  images: {
    select: { url: true, altText: true },
    orderBy: { position: "asc" as const },
    take: 1,
  },
} as const;

export type ProductListFilters = {
  categorySlug?: string;
  search?: string;
};

export async function getPublicProducts(filters: ProductListFilters = {}) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      ...(filters.categorySlug
        ? { category: { slug: filters.categorySlug } }
        : {}),
      ...(filters.search
        ? { name: { contains: filters.search, mode: "insensitive" } }
        : {}),
    },
    select: productListSelect,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getFeaturedProducts(limit = 3) {
  return prisma.product.findMany({
    where: { isActive: true, deletedAt: null, isFeatured: true },
    select: productListSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true, deletedAt: null },
    include: {
      category: { select: { name: true, slug: true } },
      brand: { select: { name: true } },
      images: { orderBy: { position: "asc" } },
    },
  });
}

export async function getAdminProducts(page = 1, perPage = 15) {
  const currentPage = Math.max(1, page);
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where: { deletedAt: null },
      select: {
        ...productListSelect,
        lowStockThreshold: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where: { deletedAt: null } }),
  ]);

  return {
    items,
    total,
    page: currentPage,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getProductForEdit(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

export async function getActiveBrands() {
  return prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getAllBrands() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}
