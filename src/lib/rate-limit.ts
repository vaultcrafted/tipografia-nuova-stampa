// ─── Rate limiting ───────────────────────────────────────────────────────────
// Serve a rendere non praticabili due abusi:
//  - provare la password admin a tentativi finché non esce;
//  - riempire il bucket R2 chiamando in continuazione l'upload pubblico.
//
// Usa il rate limiter nativo dei Worker (binding `ratelimit`, GA da set. 2025).
// NON usare il KV per questo: le letture KV sono cachate al edge fino a 60
// secondi, quindi il contatore non sale e il limite non scatta mai — provato,
// 12 tentativi di login di fila passavano tutti.
//
// Il binding accetta solo finestre da 10 o 60 secondi: il limite è quindi
// "al minuto". Contro un attacco a dizionario è quello che conta.

import { workerEnv } from "./worker-env";

type RateLimiter = { limit(opts: { key: string }): Promise<{ success: boolean }> };

export function clientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "sconosciuto"
  );
}

/**
 * true = la richiesta può proseguire.
 * Se il binding non c'è (build vecchia, sviluppo locale) si lascia passare: il
 * rate limiting non deve diventare un modo per mettere giù il sito.
 */
export async function consentito(binding: string, request: Request): Promise<boolean> {
  const limiter = workerEnv()[binding] as RateLimiter | undefined;
  if (!limiter?.limit) return true;
  try {
    const { success } = await limiter.limit({ key: clientIp(request) });
    return success;
  } catch (err) {
    console.error(`rate limit ${binding} non applicato:`, err);
    return true;
  }
}

export function tooManyRequests(messaggio: string, retryAfterSeconds = 60): Response {
  return new Response(JSON.stringify({ error: messaggio, retryAfter: retryAfterSeconds }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfterSeconds),
    },
  });
}
