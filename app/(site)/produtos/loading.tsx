import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <Skeleton className="h-10 w-64" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-lg border bg-white p-4">
            <Skeleton className="aspect-[4/5] w-full rounded-md" />
            <Skeleton className="mt-4 h-5 w-3/4" />
            <Skeleton className="mt-3 h-4 w-1/2" />
            <Skeleton className="mt-6 h-10 w-full" />
          </div>
        ))}
      </div>
    </main>
  );
}
