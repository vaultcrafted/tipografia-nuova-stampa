// ─── Cloudflare KV — accesso via REST API ────────────────────────────────────
import type { Album } from "@/data/portfolio";

const CF_ACCOUNT_ID   = "b4a2bcff1a5784e0ade3f840cd87c94f";
const KV_NAMESPACE_ID = "f5b5cf08cdea46cdaa32451f400760aa";

// Letto dalla variabile di build VITE_CF_KV_TOKEN (configurata in Cloudflare Workers → Crea → Variabili)
const CF_API_TOKEN = import.meta.env.VITE_CF_KV_TOKEN as string ?? "";

const KV_BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}`;

function getHeaders() {
  return {
    "Authorization": `Bearer ${CF_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export type WorkerEnv = {
  KV_PORTFOLIO: KVNamespace;
  CF_KV_TOKEN?: string;
  [key: string]: unknown;
};

function kvKey(categorySlug: string, eventSlug: string): string {
  return `albums:${categorySlug}:${eventSlug}`;
}

export async function getAlbumsFromKV(
  _kv: KVNamespace | undefined,
  categorySlug: string,
  eventSlug: string
): Promise<Album[]> {
  try {
    const key = encodeURIComponent(kvKey(categorySlug, eventSlug));
    const res = await fetch(`${KV_BASE}/values/${key}`, { headers: getHeaders() });
    if (!res.ok) return [];
    const text = await res.text();
    return JSON.parse(text) as Album[];
  } catch {
    return [];
  }
}

export async function saveAlbumsToKV(
  _kv: KVNamespace | undefined,
  categorySlug: string,
  eventSlug: string,
  albums: Album[]
): Promise<void> {
  const key = encodeURIComponent(kvKey(categorySlug, eventSlug));
  await fetch(`${KV_BASE}/values/${key}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(albums),
  });
}

export async function addAlbumToKV(
  _kv: KVNamespace | undefined,
  categorySlug: string,
  eventSlug: string,
  album: Album
): Promise<void> {
  const existing = await getAlbumsFromKV(undefined, categorySlug, eventSlug);
  const idx = existing.findIndex((a) => a.slug === album.slug);
  if (idx >= 0) existing[idx] = album;
  else existing.unshift(album);
  await saveAlbumsToKV(undefined, categorySlug, eventSlug, existing);
}

export async function deleteAlbumFromKV(
  _kv: KVNamespace | undefined,
  categorySlug: string,
  eventSlug: string,
  albumSlug: string
): Promise<void> {
  const existing = await getAlbumsFromKV(undefined, categorySlug, eventSlug);
  const filtered = existing.filter((a) => a.slug !== albumSlug);
  await saveAlbumsToKV(undefined, categorySlug, eventSlug, filtered);
}
