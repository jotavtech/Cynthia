import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { readSession } from "@/lib/auth/session";
import type { SessionPayload } from "@/lib/auth/jwt";
import { canAccessAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  return readSession();
});

/**
 * Garante que existe uma sessao admin valida. Redireciona para o login caso
 * contrario. Use como primeira linha em toda pagina/action administrativa.
 */
export const requireAdmin = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();

  if (!session || !canAccessAdmin(session.role as "ADMIN")) {
    redirect("/admin/login");
  }

  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return user;
});
