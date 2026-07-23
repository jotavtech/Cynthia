import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

// O rodape le as configuracoes da loja no banco. Usa ISR: as paginas filhas
// definem `revalidate`, e as server actions de configuracoes chamam
// revalidatePath("/", "layout") para atualizar o rodape sob demanda.
export const revalidate = 300;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
