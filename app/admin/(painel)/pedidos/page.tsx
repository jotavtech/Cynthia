import Link from "next/link";

import { getAdminOrders } from "@/lib/orders";
import { formatMoney } from "@/lib/money";
import {
  orderCode,
  orderStatusClasses,
  orderStatusLabels,
} from "@/lib/order-status";
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
  dateStyle: "short",
  timeStyle: "short",
});

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-950">Pedidos</h1>
        <p className="mt-1 text-sm text-stone-500">
          {orders.length} pedido(s) registrados.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-10 text-center text-stone-500">
          Nenhum pedido ainda.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {orderCode(order.id)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="block font-medium text-stone-900">
                      {order.customerName}
                    </span>
                    <span className="text-xs text-stone-500">
                      {order.customerPhone}
                    </span>
                  </TableCell>
                  <TableCell>{order._count.items}</TableCell>
                  <TableCell>{formatMoney(order.total.toString())}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${orderStatusClasses(order.status)}`}
                    >
                      {orderStatusLabels[order.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-stone-500">
                    {dateFormatter.format(order.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
