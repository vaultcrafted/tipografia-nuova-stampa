// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare R2 — URL helper per le foto del portfolio
// Bucket: portfolio
// Dominio pubblico: media.tipografianuovastampa.com
// ─────────────────────────────────────────────────────────────────────────────

export const MEDIA_BASE = "https://media.tipografianuovastampa.com";

export type ImageVariant = "thumbnail" | "gallery" | "lightbox" | "public";

/**
 * Costruisce URL per una foto nel bucket R2.
 * Le foto vengono servite direttamente senza trasformazioni.
 *
 * @param path    - Percorso nel bucket (es. "fotografia/concerti/kaos/001.jpg")
 * @param variant - ignorato per ora, tutte le varianti servono l'originale
 */
export function cfImageUrl(path: string, _variant: ImageVariant = "gallery"): string {
  if (!path) return "";
  return `${MEDIA_BASE}/${path}`;
}

/**
 * URL diretto (alias di cfImageUrl).
 */
export function cfRawUrl(path: string): string {
  if (!path) return "";
  return `${MEDIA_BASE}/${path}`;
}
