// Cloudflare Images — helper per costruire URL ottimizzati
// Account ID: b4a2bcff1a5784e0ade3f840cd87c94f
// Le foto vengono servite da: imagedelivery.net/<accountHash>/<imageId>/<variant>
// Il accountHash è diverso dall'Account ID — lo ricaviamo dall'API token

export const CF_ACCOUNT_ID = "b4a2bcff1a5784e0ade3f840cd87c94f";

// Questo hash viene popolato dopo la configurazione del token
// Trovalo in: Cloudflare Images → "View account hash"
export const CF_ACCOUNT_HASH = "";

/**
 * Costruisce un URL per Cloudflare Images con trasformazioni automatiche.
 * @param imageId  - ID immagine restituito da Cloudflare dopo l'upload
 * @param variant  - "thumbnail" | "gallery" | "lightbox" | "public"
 */
export function cfImageUrl(imageId: string, variant: "thumbnail" | "gallery" | "lightbox" | "public" = "gallery"): string {
  if (!CF_ACCOUNT_HASH) {
    // Placeholder finché non è configurato l'account hash
    return "";
  }
  return `https://imagedelivery.net/${CF_ACCOUNT_HASH}/${imageId}/${variant}`;
}

/**
 * Restituisce un URL placeholder per le card senza foto ancora caricate.
 */
export function placeholderUrl(): string {
  return "";
}
