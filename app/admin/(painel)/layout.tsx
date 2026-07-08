import { requireAdmin } from "@/lib/auth/dal";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
