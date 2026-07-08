"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Tags,
} from "lucide-react";

import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/estoque", label: "Estoque", icon: Boxes },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/marcas", label: "Marcas", icon: Store },
  { href: "/admin/configuracoes", label: "Configuracoes", icon: Settings },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-stone-100">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-stone-200 bg-white md:flex">
        <div className="border-b border-stone-200 px-5 py-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
            Admin
          </p>
          <p className="mt-1 text-lg font-semibold text-stone-950">
            Cynthia Makes
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-stone-950 text-white"
                    : "text-stone-600 hover:bg-stone-100",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-stone-200 px-3 py-4">
          <p className="truncate px-3 pb-2 text-xs text-stone-500">{email}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-3 md:hidden">
          <span className="font-semibold text-stone-950">Cynthia Makes</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 text-sm font-medium text-stone-600"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </form>
        </header>
        <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
