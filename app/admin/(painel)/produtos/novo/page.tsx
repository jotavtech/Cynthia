import { getActiveBrands, getActiveCategories } from "@/lib/catalog";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    getActiveCategories(),
    getActiveBrands(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-950">Novo produto</h1>
        <p className="mt-1 text-sm text-stone-500">
          Cadastre um produto no catalogo.
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre uma categoria antes de criar produtos.
        </p>
      ) : (
        <ProductForm categories={categories} brands={brands} />
      )}
    </div>
  );
}
