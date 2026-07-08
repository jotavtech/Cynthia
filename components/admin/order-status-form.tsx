"use client";

import { useActionState } from "react";

import {
  updateOrderStatusAction,
  type OrderStatusState,
} from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import {
  orderStatusLabels,
  orderStatusOrder,
} from "@/lib/order-status";
import type { OrderStatus } from "@/generated/prisma/enums";

const initialState: OrderStatusState = {};

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [state, formAction, pending] = useActionState(
    updateOrderStatusAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-end gap-3 rounded-lg border bg-white p-6"
    >
      <input type="hidden" name="orderId" value={orderId} />
      <div className="space-y-1.5">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-stone-700"
        >
          Atualizar status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {orderStatusOrder.map((status) => (
            <option key={status} value={status}>
              {orderStatusLabels[status]}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar status"}
      </Button>
      {state.error ? (
        <p className="w-full text-xs text-red-600">{state.error}</p>
      ) : state.success ? (
        <p className="w-full text-xs text-green-600">Status atualizado.</p>
      ) : (
        <p className="w-full text-xs text-stone-500">
          Confirmar um pedido pendente da baixa automatica no estoque. Cancelar
          um pedido ja confirmado repoe o estoque.
        </p>
      )}
    </form>
  );
}
