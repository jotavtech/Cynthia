"use server";

import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { z } from "zod";

import { createSession, deleteSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

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
