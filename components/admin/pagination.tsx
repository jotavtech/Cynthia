import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav
      className="flex items-center justify-between gap-4"
      aria-label="Paginacao"
    >
      <Link
        href={`${basePath}?page=${page - 1}`}
        aria-disabled={prevDisabled}
        tabIndex={prevDisabled ? -1 : undefined}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          prevDisabled && "pointer-events-none opacity-50",
        )}
      >
        Anterior
      </Link>

      <span className="text-sm text-stone-500">
        Pagina {page} de {totalPages}
      </span>

      <Link
        href={`${basePath}?page=${page + 1}`}
        aria-disabled={nextDisabled}
        tabIndex={nextDisabled ? -1 : undefined}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          nextDisabled && "pointer-events-none opacity-50",
        )}
      >
        Proxima
      </Link>
    </nav>
  );
}
