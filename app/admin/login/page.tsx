import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-950 px-5 py-12">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-md bg-stone-950 text-white">
            <LockKeyhole className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500">Admin</p>
            <h1 className="text-2xl font-semibold text-stone-950">
              Cynthia Makes
            </h1>
          </div>
        </div>
        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="************" />
          </div>
          <Button className="w-full" disabled>
            Acesso em preparacao
          </Button>
        </form>
        <Link
          href="/"
          className={buttonVariants({
            variant: "link",
            className: "mt-4 w-full",
          })}
        >
          Voltar para o site
        </Link>
      </section>
    </main>
  );
}
