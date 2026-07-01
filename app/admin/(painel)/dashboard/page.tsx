import Link from "next/link";
import { AlertTriangle, Package, ShoppingCart, Tags } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [products, categories, brands, orders, pendingOrders, lowStock] =
    await Promise.all([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count({
        where: { deletedAt: null, isActive: true, stock: { lte: 5 } },
      }),
    ]);

  const stats = [
    { label: "Produtos", value: products, icon: Package },
    { label: "Categorias", value: categories, icon: Tags },
    { label: "Marcas", value: brands, icon: Tags },
    { label: "Pedidos", value: orders, icon: ShoppingCart },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-950">Dashboard</h1>
          <p className="mt-1 text-sm text-stone-500">
            Visao geral da loja Cynthia Makes.
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className={buttonVariants({ size: "sm" })}
        >
          Novo produto
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-stone-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-stone-950">
                    {stat.value}
                  </p>
                </div>
                <Icon className="size-6 text-stone-400" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {pendingOrders > 0 ? (
        <Card className="border-stone-200">
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <p className="text-sm font-medium text-stone-700">
              {pendingOrders} pedido(s) pendente(s) aguardando confirmacao.
            </p>
            <Link
              href="/admin/pedidos"
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Ver pedidos
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {lowStock > 0 ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 p-5 text-amber-800">
            <AlertTriangle className="size-5" />
            <p className="text-sm font-medium">
              {lowStock} produto(s) com estoque baixo (5 ou menos).
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
