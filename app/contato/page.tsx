import Link from "next/link";
import { Camera, Mail, MessageCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-8">
      <section className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-rose-700">
          Contato
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-stone-950">
          Atendimento Cynthia Makes
        </h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-white p-5">
            <MessageCircle className="size-5 text-rose-700" />
            <p className="mt-4 font-medium">WhatsApp</p>
            <p className="mt-2 text-sm text-stone-600">Configurado via env.</p>
          </div>
          <div className="rounded-lg border bg-white p-5">
            <Camera className="size-5 text-rose-700" />
            <p className="mt-4 font-medium">Instagram</p>
            <p className="mt-2 text-sm text-stone-600">Editavel no painel.</p>
          </div>
          <div className="rounded-lg border bg-white p-5">
            <Mail className="size-5 text-rose-700" />
            <p className="mt-4 font-medium">Email</p>
            <p className="mt-2 text-sm text-stone-600">Editavel no painel.</p>
          </div>
        </div>
        <Link href="/" className={buttonVariants({ className: "mt-8" })}>
          Voltar para home
        </Link>
      </section>
    </main>
  );
}
