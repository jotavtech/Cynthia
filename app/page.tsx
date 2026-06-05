import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const foundations = [
  {
    title: "Curadoria",
    description: "Produtos escolhidos para uma rotina de beleza pratica.",
  },
  {
    title: "Atendimento",
    description: "Compra orientada pelo WhatsApp com clareza no pedido.",
  },
  {
    title: "Confianca",
    description: "Catalogo organizado, estoque claro e administracao segura.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-[0.18em] text-stone-950"
        >
          CYNTHIA MAKES
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-700 md:flex">
          <Link href="/produtos">Produtos</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/contato">Contato</Link>
        </nav>
        <Link href="/contato" className={buttonVariants({ size: "sm" })}>
            <MessageCircle className="size-4" />
            WhatsApp
        </Link>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-92px)] w-full max-w-7xl items-center gap-10 px-5 pb-12 pt-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm">
            <Sparkles className="size-4 text-rose-500" />
            Maquiagem com cuidado
          </div>
          <h1 className="text-5xl font-semibold leading-[1.02] text-stone-950 sm:text-6xl lg:text-7xl">
            Cynthia Makes
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-700">
            Uma loja de maquiagem pensada para comprar com clareza, receber
            atendimento proximo e escolher produtos com mais confianca.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/produtos" className={buttonVariants({ size: "lg" })}>
                Ver produtos
                <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/admin/login"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
                Area administrativa
                <ShieldCheck className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-border bg-stone-950 p-6 text-white shadow-2xl">
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-rose-100">
                Beleza
              </p>
              <h2 className="mt-4 max-w-sm text-4xl font-semibold leading-tight">
                Uma vitrine elegante para a proxima escolha de maquiagem.
              </h2>
            </div>
            <div className="grid gap-3">
              {foundations.map((item) => (
                <Card key={item.title} className="border-white/10 bg-white/10 text-white">
                  <CardContent className="p-5">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-rose-50/80">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
