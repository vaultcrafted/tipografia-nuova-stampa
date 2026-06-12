// POST /api/admin/save-album — salva album su KV
// DELETE /api/admin/save-album — elimina album da KV e foto da R2
import { createFileRoute } from "@tanstack/react-router";
import { addAlbumToKV, deleteAlbumFromKV, getAlbumsFromKV } from "@/lib/kv";

const ADMIN_PASSWORD = "nuovastampa2024";

const R2_ACCOUNT_ID    = "b4a2bcff1a5784e0ade3f840cd87c94f";
const R2_ACCESS_KEY_ID = "817163d3d36b771bb11b3d621ee24171";
const R2_SECRET_KEY    = "17b9189e836f9bbae72cc43459978235c62b4e4f2a2120e6a2678f0f815339ab";
const R2_BUCKET        = "portfolio";
const R2_ENDPOINT      = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

async function deleteFromR2(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  // R2 S3-compatible delete — usa AWS Signature v4
  // Per semplicità eliminiamo un file alla volta
  for (const key of keys) {
    try {
      const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
      const now = new Date();
      const date = now.toISOString().slice(0, 10).replace(/-/g, "");
      const datetime = now.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

      // Firma AWS v4 semplificata
      const encoder = new TextEncoder();
      const canonicalRequest = `DELETE\n/${R2_BUCKET}/${key}\n\nhost:${R2_ACCOUNT_ID}.r2.cloudflarestorage.com\nx-amz-date:${datetime}\n\nhost;x-amz-date\ne3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;
      const stringToSign = `AWS4-HMAC-SHA256\n${datetime}\n${date}/auto/s3/aws4_request\n${await sha256(canonicalRequest)}`;

      const signingKey = await getSigningKey(R2_SECRET_KEY, date);
      const signature = await hmacHex(signingKey, stringToSign);

      await fetch(url, {
        method: "DELETE",
        headers: {
          "Host": `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
          "x-amz-date": datetime,
          "Authorization": `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY_ID}/${date}/auto/s3/aws4_request, SignedHeaders=host;x-amz-date, Signature=${signature}`,
        },
      });
    } catch (err) {
      console.error(`Failed to delete R2 key ${key}:`, err);
    }
  }
}

async function sha256(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(key: ArrayBuffer | Uint8Array | CryptoKey, message: string): Promise<ArrayBuffer> {
  const cryptoKey = key instanceof CryptoKey
    ? key
    : await crypto.subtle.importKey("raw", key instanceof Uint8Array ? key.buffer as ArrayBuffer : key as ArrayBuffer, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
}

async function hmacHex(key: ArrayBuffer, message: string): Promise<string> {
  const result = await hmac(key, message);
  return Array.from(new Uint8Array(result)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function getSigningKey(secret: string, date: string): Promise<ArrayBuffer> {
  const kDate  = await hmac(new TextEncoder().encode("AWS4" + secret), date) as ArrayBuffer;
  const kRegion = await hmac(kDate, "auto") as ArrayBuffer;
  const kService = await hmac(kRegion, "s3") as ArrayBuffer;
  return hmac(kService, "aws4_request") as Promise<ArrayBuffer>;
}

export const Route = createFileRoute("/api/admin/save-album")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("x-admin-password");
        if (auth !== ADMIN_PASSWORD) {
          return new Response(JSON.stringify({ error: "Non autorizzato" }), {
            status: 401, headers: { "Content-Type": "application/json" },
          });
        }

        const body = await request.json() as {
          categorySlug: string;
          eventSlug: string;
          album: import("@/data/portfolio").Album;
        };

        await addAlbumToKV(undefined, body.categorySlug, body.eventSlug, body.album);

        return new Response(JSON.stringify({ ok: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },

      DELETE: async ({ request }) => {
        const auth = request.headers.get("x-admin-password");
        if (auth !== ADMIN_PASSWORD) {
          return new Response(JSON.stringify({ error: "Non autorizzato" }), {
            status: 401, headers: { "Content-Type": "application/json" },
          });
        }

        const body = await request.json() as {
          categorySlug: string;
          eventSlug: string;
          albumSlug: string;
        };

        // Trova le foto dell'album prima di eliminarlo
        const albums = await getAlbumsFromKV(undefined, body.categorySlug, body.eventSlug);
        const album = albums.find(a => a.slug === body.albumSlug);
        const photoKeys = album?.photos.map(p => p.id) ?? [];

        // Elimina dal KV
        await deleteAlbumFromKV(undefined, body.categorySlug, body.eventSlug, body.albumSlug);

        // Elimina le foto da R2
        await deleteFromR2(photoKeys);

        return new Response(JSON.stringify({ ok: true, deleted: photoKeys.length }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
