// ─── Cloudflare KV — helper per leggere/scrivere album ───────────────────────
// Il binding KV_PORTFOLIO viene iniettato dal Worker runtime
// Key structure:
//   albums:{categorySlug}:{eventSlug}  → JSON array di Album

import type { Album } from "@/data/portfolio";

// Tipo per l'env del Worker con i binding
export type WorkerEnv = {
  KV_PORTFOLIO: KVNamespace;
  [key: string]: unknown;
};

function kvKey(categorySlug: string, eventSlug: string): string {
  return `albums:${categorySlug}:${eventSlug}`;
}

export async function getAlbumsFromKV(
  kv: KVNamespace,
  categorySlug: string,
  eventSlug: string
): Promise<Album[]> {
  try {
    const data = await kv.get(kvKey(categorySlug, eventSlug));
    if (!data) return [];
    return JSON.parse(data) as Album[];
  } catch {
    return [];
  }
}

export async function saveAlbumsToKV(
  kv: KVNamespace,
  categorySlug: string,
  eventSlug: string,
  albums: Album[]
): Promise<void> {
  await kv.put(kvKey(categorySlug, eventSlug), JSON.stringify(albums));
}

export async function addAlbumToKV(
  kv: KVNamespace,
  categorySlug: string,
  eventSlug: string,
  album: Album
): Promise<void> {
  const existing = await getAlbumsFromKV(kv, categorySlug, eventSlug);
  // Sostituisce se esiste già lo stesso slug, altrimenti aggiunge
  const idx = existing.findIndex((a) => a.slug === album.slug);
  if (idx >= 0) existing[idx] = album;
  else existing.unshift(album); // Più recente prima
  await saveAlbumsToKV(kv, categorySlug, eventSlug, existing);
}

export async function deleteAlbumFromKV(
  kv: KVNamespace,
  categorySlug: string,
  eventSlug: string,
  albumSlug: string
): Promise<void> {
  const existing = await getAlbumsFromKV(kv, categorySlug, eventSlug);
  const filtered = existing.filter((a) => a.slug !== albumSlug);
  await saveAlbumsToKV(kv, categorySlug, eventSlug, filtered);
}
