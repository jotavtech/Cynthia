import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getOrderById } from "@/lib/orders";
import { formatMoney } from "@/lib/money";
import {
  orderCode,
  orderStatusClasses,
  orderStatusLabels,
} from "@/lib/order-status";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
});

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft className="size-4" />
        Voltar para pedidos
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-stone-950">
            Pedido {orderCode(order.id)}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {dateFormatter.format(order.createdAt)}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${orderStatusClasses(order.status)}`}
        >
          {orderStatusLabels[order.status]}
        </span>
      </div>

      <div className="grid gap-4 rounded-lg border bg-white p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-400">
            Cliente
          </p>
          <p className="mt-1 font-medium text-stone-900">
            {order.customerName}
          </p>
          <p className="text-sm text-stone-600">{order.customerPhone}</p>
          {order.customerEmail ? (
            <p className="text-sm text-stone-600">{order.customerEmail}</p>
          ) : null}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-400">
            Entrega
          </p>
          <p className="mt-1 text-sm text-stone-600">
            {order.customerAddress ?? "Nao informado"}
          </p>
          {order.notes ? (
            <p className="mt-2 text-sm text-stone-600">Obs: {order.notes}</p>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Qtd</TableHead>
              <TableHead>Preco</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.productNameSnapshot}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {formatMoney(item.productPriceSnapshot.toString())}
                </TableCell>
                <TableCell className="text-right">
                  {formatMoney(item.total.toString())}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end rounded-lg border bg-white px-6 py-4 text-lg">
        <span className="mr-4 text-stone-600">Total</span>
        <span className="font-semibold text-stone-950">
          {formatMoney(order.total.toString())}
        </span>
      </div>

      <OrderStatusForm orderId={order.id} currentStatus={order.status} />
    </div>
  );
}
