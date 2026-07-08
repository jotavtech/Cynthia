import { getAllCategories } from "@/lib/catalog";
import { saveCategoryAction } from "@/lib/actions/taxonomy";
import { Badge } from "@/components/ui/badge";
import { TaxonomyForm } from "@/components/admin/taxonomy-form";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-950">Categorias</h1>
        <p className="mt-1 text-sm text-stone-500">
          Organize o catalogo por categorias.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-2 rounded-lg border bg-white p-2">
          {categories.length === 0 ? (
            <p className="p-6 text-center text-sm text-stone-500">
              Nenhuma categoria cadastrada.
            </p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-md px-4 py-3 hover:bg-stone-50"
              >
                <div>
                  <p className="font-medium text-stone-900">{category.name}</p>
                  <p className="text-xs text-stone-500">
                    {category._count.products} produto(s)
                  </p>
                </div>
                {category.isActive ? (
                  <Badge>Ativa</Badge>
                ) : (
                  <Badge variant="secondary">Inativa</Badge>
                )}
              </div>
            ))
          )}
        </div>

        <TaxonomyForm action={saveCategoryAction} entityLabel="categoria" />
      </div>
    </div>
  );
}
