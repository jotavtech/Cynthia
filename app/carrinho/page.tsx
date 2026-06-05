import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-8">
      <section className="mx-auto max-w-3xl rounded-lg border bg-white p-8">
        <ShoppingBag className="size-8 text-rose-700" />
        <h1 className="mt-5 text-3xl font-semibold text-stone-950">
          Carrinho
        </h1>
        <p className="mt-4 text-stone-600">
          O carrinho persistente sera conectado ao catalogo real na fase de
          checkout pelo WhatsApp.
        </p>
        <Link href="/produtos" className={buttonVariants({ className: "mt-8" })}>
          Ir para produtos
        </Link>
      </section>
    </main>
  );
}
