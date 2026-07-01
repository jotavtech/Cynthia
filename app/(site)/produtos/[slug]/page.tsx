import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getProductBySlug } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produto nao encontrado" };
  }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : null;
  const image = product.images[0];
  const outOfStock = product.stock <= 0;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Link
        href="/produtos"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft className="size-4" />
        Voltar para produtos
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg border bg-stone-100">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-stone-400">
              Sem imagem
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            {product.brand?.name ? (
              <span className="text-sm font-medium uppercase tracking-[0.18em] text-rose-700">
                {product.brand.name}
              </span>
            ) : null}
            {product.isNew ? <Badge>Novidade</Badge> : null}
          </div>

          <h1 className="mt-3 text-3xl font-semibold text-stone-950">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-stone-950">
              {formatMoney(price)}
            </span>
            {compareAtPrice && compareAtPrice > price ? (
              <span className="text-lg text-stone-400 line-through">
                {formatMoney(compareAtPrice)}
              </span>
            ) : null}
          </div>

          <p className="mt-6 leading-7 text-stone-700">{product.description}</p>

          <p className="mt-4 text-sm text-stone-500">
            {outOfStock
              ? "Produto indisponivel no momento."
              : `${product.stock} em estoque`}
          </p>

          <div className="mt-8 max-w-xs">
            <AddToCartButton
              disabled={outOfStock}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price,
                imageUrl: image?.url,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
