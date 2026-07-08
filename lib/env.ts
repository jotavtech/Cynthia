import "server-only";

import { serverEnvSchema, type ServerEnv } from "@/lib/validations/env";

let cached: ServerEnv | null = null;

/**
 * Valida e retorna as variaveis de ambiente do servidor.
 *
 * A validacao acontece sob demanda (nao no import) para nao quebrar o build,
 * que roda sem `.env`. Em producao, `instrumentation.ts` chama esta funcao no
 * boot para falhar cedo caso algo esteja faltando.
 */
export function getServerEnv(): ServerEnv {
  if (cached) {
    return cached;
  }

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Variaveis de ambiente invalidas ou ausentes:\n${issues}\n` +
        "Preencha o arquivo .env com base em .env.example.",
    );
  }

  cached = parsed.data;
  return cached;
}
