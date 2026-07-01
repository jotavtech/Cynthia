"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { z } from "zod";

import { createSession, deleteSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email("Informe um email valido."),
  password: z.string().min(1, "Informe a senha."),
});

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  // Rate limit por IP para mitigar brute force (5 tentativas por minuto).
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  const rateKey = `login:${ip}`;
  const limit = rateLimit(rateKey, 5, 60_000);

  if (!limit.allowed) {
    return {
      error: "Muitas tentativas. Aguarde um minuto e tente novamente.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Email ou senha invalidos." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  // Mesma mensagem generica para evitar enumeracao de usuarios.
  const invalid = { error: "Email ou senha invalidos." };

  if (!user || !user.isActive) {
    return invalid;
  }

  const passwordMatches = await compare(parsed.data.password, user.passwordHash);

  if (!passwordMatches) {
    return invalid;
  }

  resetRateLimit(rateKey);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createSession({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}
