import Link from "next/link";
import { Camera, Mail, MessageCircle } from "lucide-react";

import { getSiteSettings } from "@/lib/settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-[0.18em] text-stone-950">
            {settings?.storeName ?? "CYNTHIA MAKES"}
          </p>
          <p className="mt-2 max-w-md text-sm text-stone-500">
            Maquiagem com curadoria e atendimento proximo pelo WhatsApp.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-stone-600">
          {settings?.whatsapp ? (
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="size-4 text-rose-600" />
              WhatsApp: {settings.whatsapp}
            </span>
          ) : null}
          {settings?.instagram ? (
            <Link
              href={settings.instagram}
              className="inline-flex items-center gap-2 hover:text-stone-950"
            >
              <Camera className="size-4 text-rose-600" />
              Instagram
            </Link>
          ) : null}
          {settings?.email ? (
            <span className="inline-flex items-center gap-2">
              <Mail className="size-4 text-rose-600" />
              {settings.email}
            </span>
          ) : null}
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-stone-400">
        &copy; {year} Cynthia Makes. Todos os direitos reservados.
      </div>
    </footer>
  );
}
