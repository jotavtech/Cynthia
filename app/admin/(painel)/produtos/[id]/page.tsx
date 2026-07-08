import { notFound } from "next/navigation";

import {
  getActiveBrands,
  getActiveCategories,
  getProductForEdit,
} from "@/lib/catalog";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    getProductForEdit(id),
    getActiveCategories(),
    getActiveBrands(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-950">Editar produto</h1>
        <p className="mt-1 text-sm text-stone-500">{product.name}</p>
      </div>

      <ProductForm
        categories={categories}
        brands={brands}
        defaultValues={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          compareAtPrice: product.compareAtPrice?.toString() ?? null,
          sku: product.sku,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold,
          categoryId: product.categoryId,
          brandId: product.brandId,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
        }}
      />
    </div>
  );
}
