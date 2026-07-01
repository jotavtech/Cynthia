"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";
import { buildWhatsappCartMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { formatMoney } from "@/lib/money";
import { Button, buttonVariants } from "@/components/ui/button";

export function CartView({ whatsapp }: { whatsapp: string }) {
  const { items, totalPrice, updateQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border bg-white p-10 text-center">
        <ShoppingBag className="mx-auto size-8 text-rose-700" />
        <h1 className="mt-4 text-2xl font-semibold text-stone-950">
          Seu carrinho esta vazio
        </h1>
        <p className="mt-2 text-stone-600">
          Adicione produtos para finalizar o pedido pelo WhatsApp.
        </p>
        <Link href="/produtos" className={buttonVariants({ className: "mt-6" })}>
          Ir para produtos
        </Link>
      </div>
    );
  }

  function checkout() {
    const message = buildWhatsappCartMessage(
      items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    );
    const url = buildWhatsappUrl(whatsapp, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg border bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-stone-900">{item.name}</p>
              <p className="text-sm text-stone-500">
                {formatMoney(item.price)} cada
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Diminuir"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="grid size-8 place-items-center rounded-md border hover:bg-stone-50"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label="Aumentar"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="grid size-8 place-items-center rounded-md border hover:bg-stone-50"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <div className="w-24 text-right font-semibold text-stone-900">
              {formatMoney(item.price * item.quantity)}
            </div>

            <button
              type="button"
              aria-label={`Remover ${item.name}`}
              onClick={() => removeItem(item.id)}
              className="grid size-8 place-items-center rounded-md text-red-600 hover:bg-red-50"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={clear}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          Limpar carrinho
        </button>
      </div>

      <aside className="h-fit space-y-4 rounded-lg border bg-white p-6">
        <div className="flex items-center justify-between text-lg">
          <span className="text-stone-600">Total</span>
          <span className="font-semibold text-stone-950">
            {formatMoney(totalPrice)}
          </span>
        </div>
        <p className="text-sm text-stone-500">
          A finalizacao acontece pelo WhatsApp. Voce confirma os detalhes do
          pedido diretamente com a loja.
        </p>
        <Button type="button" className="w-full" onClick={checkout}>
          Finalizar no WhatsApp
        </Button>
      </aside>
    </div>
  );
}
