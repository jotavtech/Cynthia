"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export type GalleryImage = {
  url: string;
  altText?: string | null;
};

export function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border bg-stone-100">
        <div className="grid h-full place-items-center text-sm text-stone-400">
          Sem imagem
        </div>
      </div>
    );
  }

  const active = images[Math.min(activeIndex, images.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border bg-stone-100">
        <Image
          src={active.url}
          alt={active.altText ?? productName}
          fill
          sizes="(max-width: 1024px) 100vw, 500px"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagem ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border bg-stone-100 transition",
                index === activeIndex
                  ? "border-stone-950 ring-1 ring-stone-950"
                  : "border-border hover:border-stone-400",
              )}
            >
              <Image
                src={image.url}
                alt={image.altText ?? `${productName} ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
