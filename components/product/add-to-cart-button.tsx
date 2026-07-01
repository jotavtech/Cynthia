"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";

import { useCart, type CartItem } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  disabled,
  className,
}: {
  product: Omit<CartItem, "quantity">;
  disabled?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <Button
      type="button"
      disabled={disabled}
      className={cn("w-full", className)}
      onClick={() => {
        addItem(product);
        setAdded(true);
      }}
    >
      {added ? (
        <>
          <Check className="size-4" />
          Adicionado
        </>
      ) : (
        <>
          <ShoppingBag className="size-4" />
          {disabled ? "Indisponivel" : "Adicionar"}
        </>
      )}
    </Button>
  );
}
