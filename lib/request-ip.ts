import "server-only";

import { headers } from "next/headers";

/**
 * Extrai o IP do cliente a partir dos headers de proxy. Usado como chave de
 * rate limit. Atras de um proxy confiavel (Nginx na VPS), `x-forwarded-for`
 * traz o IP real como primeiro elemento da lista.
 */
export async function getClientIp(): Promise<string> {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}
