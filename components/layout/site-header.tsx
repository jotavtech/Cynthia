"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label="Abrir menu"
              className="grid size-9 place-items-center rounded-md border border-border text-stone-700 hover:bg-stone-50 md:hidden"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b">
                <SheetTitle className="tracking-[0.18em] text-stone-950">
                  CYNTHIA MAKES
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-stone-700 hover:bg-stone-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="text-lg font-semibold tracking-[0.18em] text-stone-950"
          >
            CYNTHIA MAKES
          </Link>
        </div>

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
