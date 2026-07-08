import "server-only";

type Entry = { count: number; resetAt: number };

// Store em memoria de processo. Adequado para um deploy single-process (PM2 em
// VPS). Para multiplas instancias, trocar por Redis/banco.
const store = new Map<string, Entry>();

// Intervalo minimo entre varreduras de limpeza de chaves expiradas.
const SWEEP_INTERVAL_MS = 5 * 60_000;
let lastSweepAt = 0;

/**
 * Remove entradas ja expiradas. Sem isso o Map cresceria de forma ilimitada,
 * acumulando uma chave por IP visto (vazamento de memoria em processo longo).
 */
function sweepExpired(now: number): void {
  if (now - lastSweepAt < SWEEP_INTERVAL_MS) {
    return;
  }
  lastSweepAt = now;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  sweepExpired(now);
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: limit - entry.count,
    retryAfterMs: entry.resetAt - now,
  };
}

/** Limpa a contagem de uma chave (ex.: apos login bem-sucedido). */
export function resetRateLimit(key: string): void {
  store.delete(key);
}
