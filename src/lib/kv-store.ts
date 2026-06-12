// ─── Cloudflare KV Store ──────────────────────────────────────────────────────
// SSR: usa il binding KV_PORTFOLIO del Worker direttamente
// Client-side: usa l'API endpoint /api/portfolio/albums

import type { Album } from "@/data/portfolio";

// Binding iniettato da server.ts all'inizio di ogni richiesta Worker
let _kvNamespace: KVNamespace | undefined;
let _kvToken: string | undefined;

export function setKVStore(kv?: KVNamespace, token?: string) {
  _kvNamespace = kv;
  _kvToken = token;
}

export type WorkerEnv = {
  KV_PORTFOLIO?: KVNamespace;
  CF_KV_TOKEN?: string;
  [key: string]: unknown;
};

const CF_ACCOUNT_ID   = "b4a2bcff1a5784e0ade3f840cd87c94f";
const KV_NAMESPACE_ID = "f5b5cf08cdea46cdaa32451f400760aa";

function kvKey(categorySlug: string, eventSlug: string): string {
  return `albums:${categorySlug}:${eventSlug}`;
}

async function readViaRestApi(categorySlug: string, eventSlug: string): Promise<Album[]> {
  const token = _kvToken ?? "";
  const key = encodeURIComponent(kvKey(categorySlug, eventSlug));
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/values/${key}`,
    { headers: { "Authorization": `Bearer ${token}` } }
  );
  if (!res.ok) return [];
  return JSON.parse(await res.text()) as Album[];
}

async function writeViaRestApi(categorySlug: string, eventSlug: string, albums: Album[]): Promise<void> {
  const token = _kvToken ?? "";
  const key = encodeURIComponent(kvKey(categorySlug, eventSlug));
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/values/${key}`,
    {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(albums),
    }
  );
}

export async function getAlbumsFromKV(
  _kv: KVNamespace | undefined,
  categorySlug: string,
  eventSlug: string
): Promise<Album[]> {
  try {
    // SSR con binding diretto
    if (_kvNamespace) {
      const data = await _kvNamespace.get(kvKey(categorySlug, eventSlug));
      if (!data) return [];
      return JSON.parse(data) as Album[];
    }
    // SSR senza binding (primo deploy) o client-side: usa REST API
    return await readViaRestApi(categorySlug, eventSlug);
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
  if (_kvNamespace) {
    await _kvNamespace.put(kvKey(categorySlug, eventSlug), JSON.stringify(albums));
    return;
  }
  await writeViaRestApi(categorySlug, eventSlug, albums);
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
