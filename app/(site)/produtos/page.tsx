import Link from "next/link";
import { Search } from "lucide-react";

import { getActiveCategories, getPublicProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Produtos",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const { categoria, q } = await searchParams;
  const [products, categories] = await Promise.all([
    getPublicProducts({ categorySlug: categoria, search: q }),
    getActiveCategories(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="border-b pb-8">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-rose-700">
          Catalogo
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-stone-950">
          Produtos Cynthia Makes
        </h1>

        <form className="mt-6 flex max-w-md items-center gap-2" action="/produtos">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Buscar produto..."
              className="h-10 w-full rounded-md border border-input bg-white pl-9 pr-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="h-10 rounded-md bg-stone-950 px-4 text-sm font-medium text-white"
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/produtos"
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm",
            !categoria
              ? "border-stone-950 bg-stone-950 text-white"
              : "border-border text-stone-600 hover:bg-stone-50",
          )}
        >
          Todos
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/produtos?categoria=${category.slug}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm",
              categoria === category.slug
                ? "border-stone-950 bg-stone-950 text-white"
                : "border-border text-stone-600 hover:bg-stone-50",
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed bg-white p-12 text-center text-stone-500">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: Number(product.price),
                compareAtPrice: product.compareAtPrice
                  ? Number(product.compareAtPrice)
                  : null,
                stock: product.stock,
                isNew: product.isNew,
                imageUrl: product.images[0]?.url,
                imageAlt: product.images[0]?.altText ?? undefined,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
