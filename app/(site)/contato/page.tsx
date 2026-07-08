import Link from "next/link";
import { Clock, Camera, Mail, MessageCircle } from "lucide-react";

import { getSiteSettings } from "@/lib/settings";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contato",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsapp = settings?.whatsapp ?? process.env.STORE_WHATSAPP ?? "";
  const whatsappUrl = whatsapp
    ? buildWhatsappUrl(
        whatsapp,
        settings?.whatsappDefaultMessage ??
          "Ola! Vim pelo site da Cynthia Makes.",
      )
    : null;

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-rose-700">
        Contato
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-stone-950">
        Atendimento Cynthia Makes
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <MessageCircle className="size-5 text-rose-700" />
          <p className="mt-4 font-medium">WhatsApp</p>
          <p className="mt-2 text-sm text-stone-600">
            {whatsapp || "Nao configurado"}
          </p>
          {whatsappUrl ? (
            <Link
              href={whatsappUrl}
              className={buttonVariants({ size: "sm", className: "mt-4" })}
            >
              Iniciar conversa
            </Link>
          ) : null}
        </div>

        {settings?.instagram ? (
          <div className="rounded-lg border bg-white p-6">
            <Camera className="size-5 text-rose-700" />
            <p className="mt-4 font-medium">Instagram</p>
            <Link
              href={settings.instagram}
              className="mt-2 inline-block text-sm text-rose-700 hover:underline"
            >
              {settings.instagram}
            </Link>
          </div>
        ) : null}

        {settings?.email ? (
          <div className="rounded-lg border bg-white p-6">
            <Mail className="size-5 text-rose-700" />
            <p className="mt-4 font-medium">Email</p>
            <p className="mt-2 text-sm text-stone-600">{settings.email}</p>
          </div>
        ) : null}

        {settings?.businessHours ? (
          <div className="rounded-lg border bg-white p-6">
            <Clock className="size-5 text-rose-700" />
            <p className="mt-4 font-medium">Horario</p>
            <p className="mt-2 text-sm text-stone-600">
              {settings.businessHours}
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
