import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-8">
      <section className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-rose-700">
          Sobre
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-stone-950">
          Cynthia Makes
        </h1>
        <p className="mt-6 text-lg leading-8 text-stone-700">
          Esta pagina sera conectada as configuracoes do site para manter a
          historia, atendimento e diferenciais da marca editaveis no painel.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-8" })}>
          Voltar para home
        </Link>
      </section>
    </main>
  );
}
