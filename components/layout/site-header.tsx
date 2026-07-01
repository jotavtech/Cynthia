"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";

const links = [
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-[0.18em] text-stone-950"
        >
          CYNTHIA MAKES
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-700 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-stone-950">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/carrinho"
          className="relative inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          aria-label={`Carrinho com ${totalItems} item(s)`}
        >
          <ShoppingBag className="size-4" />
          <span className="hidden sm:inline">Carrinho</span>
          {totalItems > 0 ? (
            <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-rose-600 text-xs font-semibold text-white">
              {totalItems}
            </span>
          ) : null}
        </Link>
      </div>
    </header>
  );
}
