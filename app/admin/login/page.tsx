import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

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

        <LoginForm />

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
