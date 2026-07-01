import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { getAdminProducts } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-950">Produtos</h1>
          <p className="mt-1 text-sm text-stone-500">
            {products.length} produto(s) cadastrado(s).
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="size-4" />
          Novo produto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-10 text-center text-stone-500">
          Nenhum produto cadastrado ainda.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preco</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-stone-500">
                    {product.category?.name ?? "-"}
                  </TableCell>
                  <TableCell>{formatMoney(product.price.toString())}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock <= product.lowStockThreshold
                          ? "font-medium text-amber-600"
                          : ""
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.isActive ? (
                      <Badge>Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/produtos/${product.id}`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-stone-600 transition-colors hover:bg-stone-100"
                        aria-label={`Editar ${product.name}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <DeleteProductButton
                        id={product.id}
                        name={product.name}
                      />
                    </div>
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
