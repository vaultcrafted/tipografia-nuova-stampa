// ─── Accesso all'ambiente del Worker ─────────────────────────────────────────
// server.ts mette l'env del Worker su globalThis.__CF_ENV__ all'inizio di ogni
// richiesta. Qui lo leggiamo in modo tipizzato, senza mai scrivere segreti nel
// codice sorgente: tutto arriva dai secret del Worker.

export type AppEnv = {
  KV_PORTFOLIO?: KVNamespace;
  CF_KV_TOKEN?: string;
  /** Password di accesso a /admin. Secret del Worker. */
  ADMIN_PASSWORD?: string;
  /** Chiave con cui si firmano i cookie di sessione admin. Secret del Worker. */
  ADMIN_SESSION_SECRET?: string;
  /** Credenziali R2 per gli URL firmati di upload e per le cancellazioni. */
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  [key: string]: unknown;
};

export function workerEnv(): AppEnv {
  return ((globalThis as Record<string, unknown>).__CF_ENV__ as AppEnv) ?? {};
}

/**
 * Legge un secret obbligatorio. Se manca, lancia: le rotte che lo usano devono
 * fallire chiuse (errore) e non proseguire senza autenticazione o credenziali.
 */
export function requireSecret(name: keyof AppEnv): string {
  const value = workerEnv()[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Secret mancante nel Worker: ${String(name)}`);
  }
  return value;
}

/** Confronto a tempo costante, per non far trapelare la password un carattere alla volta. */
export function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  // La lunghezza non è segreta quanto il contenuto, ma confrontiamo comunque
  // su una lunghezza fissa per non uscire in anticipo.
  const len = Math.max(ab.length, bb.length);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < len; i++) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}
