import type { OrderStatus } from "@/generated/prisma/enums";

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

export const orderStatusOrder: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function orderStatusClasses(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-stone-200 text-stone-700";
  }
}

export function orderCode(id: string): string {
  return id.slice(-6).toUpperCase();
}
