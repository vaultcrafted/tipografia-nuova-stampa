// Storage per il KV namespace — usa AsyncLocalStorage per passarlo
// dal Worker fetch handler ai loader functions di TanStack Start

import type { Album } from "@/data/portfolio";

// Storage globale semplice — funziona perché ogni richiesta Worker è sequenziale
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

async function kvFetch(path: string, options?: RequestInit): Promise<Response> {
  const token = _kvToken || "";
  return fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}${path}`,
    {
      ...options,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    }
  );
}

function kvKey(categorySlug: string, eventSlug: string): string {
  return `albums:${categorySlug}:${eventSlug}`;
}

export async function getAlbumsFromKV(
  _kv: KVNamespace | undefined,
  categorySlug: string,
  eventSlug: string
): Promise<Album[]> {
  try {
    // Prima prova con il binding diretto se disponibile
    if (_kvNamespace) {
      const data = await _kvNamespace.get(kvKey(categorySlug, eventSlug));
      if (data) return JSON.parse(data) as Album[];
      return [];
    }
    // Fallback all'API REST
    const key = encodeURIComponent(kvKey(categorySlug, eventSlug));
    const res = await kvFetch(`/values/${key}`);
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
  if (_kvNamespace) {
    await _kvNamespace.put(kvKey(categorySlug, eventSlug), JSON.stringify(albums));
    return;
  }
  const key = encodeURIComponent(kvKey(categorySlug, eventSlug));
  await kvFetch(`/values/${key}`, {
    method: "PUT",
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
