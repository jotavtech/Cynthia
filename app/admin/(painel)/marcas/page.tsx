import { getAllBrands } from "@/lib/catalog";
import { saveBrandAction } from "@/lib/actions/taxonomy";
import { Badge } from "@/components/ui/badge";
import { TaxonomyForm } from "@/components/admin/taxonomy-form";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await getAllBrands();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-950">Marcas</h1>
        <p className="mt-1 text-sm text-stone-500">
          Gerencie as marcas disponiveis no catalogo.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-2 rounded-lg border bg-white p-2">
          {brands.length === 0 ? (
            <p className="p-6 text-center text-sm text-stone-500">
              Nenhuma marca cadastrada.
            </p>
          ) : (
            brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-between rounded-md px-4 py-3 hover:bg-stone-50"
              >
                <div>
                  <p className="font-medium text-stone-900">{brand.name}</p>
                  <p className="text-xs text-stone-500">
                    {brand._count.products} produto(s)
                  </p>
                </div>
                {brand.isActive ? (
                  <Badge>Ativa</Badge>
                ) : (
                  <Badge variant="secondary">Inativa</Badge>
                )}
              </div>
            ))
          )}
        </div>

        <TaxonomyForm action={saveBrandAction} entityLabel="marca" />
      </div>
    </div>
  );
}
