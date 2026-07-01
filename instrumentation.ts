/**
 * Executado pelo Next.js no boot do servidor (nao durante o build).
 * Valida as variaveis de ambiente para falhar cedo em producao.
 */
export async function register() {
  // Nao validar durante o build de producao: o build roda sem `.env`.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return;
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getServerEnv } = await import("@/lib/env");
    getServerEnv();
  }
}
