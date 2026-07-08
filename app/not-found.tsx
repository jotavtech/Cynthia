import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-rose-700">
          Erro 404
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-stone-950">
          Pagina nao encontrada
        </h1>
        <p className="mt-4 text-stone-600">
          O conteudo que voce procura nao existe ou foi movido.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-8" })}>
          Voltar para a home
        </Link>
      </div>
    </main>
  );
}
