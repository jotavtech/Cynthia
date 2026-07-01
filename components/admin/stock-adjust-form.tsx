"use client";

import { useActionState } from "react";

import {
  adjustStockAction,
  type StockFormState,
} from "@/lib/actions/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Option = { id: string; name: string; stock: number };

const initialState: StockFormState = {};

const fieldClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring";

const typeOptions = [
  { value: "PURCHASE", label: "Entrada / Compra" },
  { value: "ADJUSTMENT", label: "Ajuste" },
  { value: "RETURN", label: "Devolucao" },
  { value: "LOSS", label: "Perda" },
];

export function StockAdjustForm({ products }: { products: Option[] }) {
  const [state, formAction, pending] = useActionState(
    adjustStockAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border bg-white p-6"
    >
      <h2 className="text-sm font-medium text-stone-700">
        Movimentar estoque
      </h2>

      <div className="space-y-2">
        <Label htmlFor="productId">Produto</Label>
        <select id="productId" name="productId" className={fieldClass} required>
          <option value="">Selecione</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (estoque: {product.stock})
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <select id="type" name="type" className={fieldClass} required>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantidade (+ entra / - sai)</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            placeholder="Ex: 10 ou -3"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Motivo</Label>
        <Input id="reason" name="reason" placeholder="Ex: Reposicao" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observacoes (opcional)</Label>
        <Input id="notes" name="notes" />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-emerald-600">Estoque atualizado.</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Registrar movimentacao"}
      </Button>
    </form>
  );
}
