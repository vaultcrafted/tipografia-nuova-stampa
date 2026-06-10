// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare R2 + Image Resizing
// Bucket: portfolio
// Dominio pubblico: media.tipografianuovastampa.com
// ─────────────────────────────────────────────────────────────────────────────

export const MEDIA_BASE = "https://media.tipografianuovastampa.com";

// Preset di trasformazione automatica via Cloudflare Image Resizing
// (cdn-cgi/image/... è gratuito con Cloudflare Pages, 5.000 trasf/mese incluse)
const VARIANTS = {
  thumbnail: "width=400,height=300,fit=cover,quality=80,format=webp",
  gallery:   "width=800,height=600,fit=scale-down,quality=85,format=webp",
  lightbox:  "width=1600,height=1200,fit=scale-down,quality=90,format=webp",
  public:    "width=1600,fit=scale-down,quality=90,format=webp",
} as const;

export type ImageVariant = keyof typeof VARIANTS;

/**
 * Costruisce URL ottimizzato per una foto nel bucket R2.
 *
 * @param path    - Percorso nel bucket (es. "concerti/kaos-2022/foto-01.jpg")
 * @param variant - "thumbnail" | "gallery" | "lightbox" | "public"
 *
 * Esempio:
 *   cfImageUrl("concerti/kaos-2022/foto-01.jpg", "gallery")
 *   → https://media.tipografianuovastampa.com/cdn-cgi/image/width=800,.../concerti/kaos-2022/foto-01.jpg
 */
export function cfImageUrl(path: string, variant: ImageVariant = "gallery"): string {
  if (!path) return "";
  return `${MEDIA_BASE}/cdn-cgi/image/${VARIANTS[variant]}/${path}`;
}

/**
 * URL diretto senza trasformazioni (per download o debug).
 */
export function cfRawUrl(path: string): string {
  if (!path) return "";
  return `${MEDIA_BASE}/${path}`;
}
