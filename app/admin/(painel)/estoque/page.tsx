import { getRecentTransactions, getStockOverview } from "@/lib/inventory";
import { StockAdjustForm } from "@/components/admin/stock-adjust-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const typeLabels: Record<string, string> = {
  PURCHASE: "Entrada",
  SALE: "Venda",
  ADJUSTMENT: "Ajuste",
  RETURN: "Devolucao",
  LOSS: "Perda",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function StockPage() {
  const [products, transactions] = await Promise.all([
    getStockOverview(),
    getRecentTransactions(20),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-950">Estoque</h1>
        <p className="mt-1 text-sm text-stone-500">
          Saldos atuais e movimentacoes recentes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-x-auto rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Estoque</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-stone-500">
                    Nenhum produto cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const low = product.stock <= product.lowStockThreshold;
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-stone-500">
                        {product.sku ?? "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            low ? "font-semibold text-amber-600" : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <StockAdjustForm
          products={products.map((product) => ({
            id: product.id,
            name: product.name,
            stock: product.stock,
          }))}
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-stone-950">
          Movimentacoes recentes
        </h2>
        <div className="overflow-x-auto rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-stone-500">
                    Nenhuma movimentacao registrada.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-stone-500">
                      {dateFormatter.format(tx.createdAt)}
                    </TableCell>
                    <TableCell>{tx.product.name}</TableCell>
                    <TableCell>{typeLabels[tx.type] ?? tx.type}</TableCell>
                    <TableCell
                      className={
                        tx.quantity < 0 ? "text-red-600" : "text-emerald-600"
                      }
                    >
                      {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                    </TableCell>
                    <TableCell>
                      {tx.previousStock} &rarr; {tx.newStock}
                    </TableCell>
                    <TableCell className="text-stone-500">{tx.reason}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
