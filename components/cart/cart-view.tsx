"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";
import { createOrderAction } from "@/lib/actions/orders";
import { formatMoney } from "@/lib/money";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CartView() {
  const { items, totalPrice, updateQuantity, removeItem, clear } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

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
    setError(null);
    startTransition(async () => {
      const result = await createOrderAction({
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        notes,
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      clear();
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
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

            <div className="flex flex-col items-center gap-1">
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
                  disabled={
                    typeof item.stock === "number" &&
                    item.quantity >= item.stock
                  }
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="grid size-8 place-items-center rounded-md border hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              {typeof item.stock === "number" &&
              item.quantity >= item.stock ? (
                <span className="text-[11px] text-stone-400">
                  Maximo em estoque
                </span>
              ) : null}
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

        <div className="space-y-3 border-t pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="customer-name">Nome</Label>
            <Input
              id="customer-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customer-phone">Telefone (WhatsApp)</Label>
            <Input
              id="customer-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(11) 99999-9999"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customer-address">Endereco de entrega (opcional)</Label>
            <Input
              id="customer-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customer-notes">Observacoes (opcional)</Label>
            <Textarea
              id="customer-notes"
              rows={2}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>

        {error ? (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <Button
          type="button"
          className="w-full"
          onClick={checkout}
          disabled={isPending}
        >
          {isPending ? "Gerando pedido..." : "Finalizar no WhatsApp"}
        </Button>
        <p className="text-xs text-stone-500">
          O pedido e registrado e a conversa abre no WhatsApp para confirmacao.
        </p>
      </aside>
    </div>
  );
}
