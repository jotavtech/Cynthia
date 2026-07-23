import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { getFeaturedProducts } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/settings";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const bannerUrl = settings?.heroBannerUrl;

  return {
    title: settings?.seoTitle ?? undefined,
    description: settings?.seoDescription ?? undefined,
    openGraph: bannerUrl ? { images: [{ url: bannerUrl }] } : undefined,
  };
}

export default async function Home() {
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(4),
  ]);

  const heroTitle = settings?.homeHeroTitle ?? "Beleza escolhida com cuidado";
  const heroDescription =
    settings?.homeHeroDescription ??
    "Uma curadoria de maquiagem para realcar sua rotina com qualidade e atendimento proximo.";

  return (
    <main className="bg-background">
      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm">
            <Sparkles className="size-4 text-rose-500" />
            Maquiagem com cuidado
          </div>
          <h1 className="text-4xl font-semibold leading-[1.05] text-stone-950 sm:text-5xl lg:text-6xl">
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-700">
            {heroDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/produtos" className={buttonVariants({ size: "lg" })}>
              Ver produtos
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contato"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Falar no WhatsApp
              <ShieldCheck className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border bg-stone-950 p-8 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-100">
            Beleza
          </p>
          <h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight">
            Uma vitrine elegante para a proxima escolha de maquiagem.
          </h2>
          <p className="mt-6 text-sm leading-6 text-rose-50/80">
            Produtos selecionados, estoque claro e finalizacao simples pelo
            WhatsApp.
          </p>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-rose-700">
                Destaques
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-stone-950">
                Produtos em destaque
              </h2>
            </div>
            <Link
              href="/produtos"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Ver todos
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
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
        </section>
      ) : null}
    </main>
  );
}
