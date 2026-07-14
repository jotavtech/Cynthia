import Image from "next/image";
import Link from "next/link";

import { formatMoney } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  isNew?: boolean;
  imageUrl?: string;
  imageAlt?: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white">
      <Link
        href={`/produtos/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-stone-100"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? product.name}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-stone-400">
            Sem imagem
          </div>
        )}
        {product.isNew ? (
          <Badge className="absolute left-3 top-3">Novidade</Badge>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/produtos/${product.slug}`}>
          <h3 className="font-medium text-stone-900 hover:underline">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-stone-950">
            {formatMoney(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <span className="text-sm text-stone-400 line-through">
              {formatMoney(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex-1" />
        <AddToCartButton
          disabled={outOfStock}
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            stock: product.stock,
          }}
        />
      </div>
    </div>
  );
}
