import Link from "next/link";
import { Search } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-10 sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-rose-700">
              Catalogo
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-stone-950">
              Produtos Cynthia Makes
            </h1>
            <p className="mt-4 max-w-2xl text-stone-600">
              A estrutura do catalogo ja esta reservada para busca, filtros e
              produtos vindos do banco de dados.
            </p>
          </div>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Voltar para home
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[280px_1fr]">
          <aside className="rounded-lg border bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
              <Search className="size-4" />
              Filtros
            </div>
            <div className="mt-5 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </aside>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-lg border bg-white p-4">
                <Skeleton className="aspect-[4/5] w-full rounded-md" />
                <Skeleton className="mt-4 h-5 w-3/4" />
                <Skeleton className="mt-3 h-4 w-1/2" />
                <Skeleton className="mt-6 h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
