// ─── R2: URL firmati per l'upload e cancellazione oggetti ────────────────────
// Le credenziali arrivano dai secret del Worker: non devono MAI stare nel
// codice sorgente (il repo è leggibile) né finire nel bundle del browser.

import { AwsClient } from "aws4fetch";
import { requireSecret, workerEnv } from "./worker-env";

const R2_ACCOUNT_ID = "b4a2bcff1a5784e0ade3f840cd87c94f";
const R2_BUCKET = "portfolio";
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

/** Tipi accettati per gli allegati caricati dal pubblico (form preventivo). */
export const ALLEGATI_CONSENTITI: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/tiff": "tif",
  "image/svg+xml": "svg",
  "application/postscript": "eps",
  "application/zip": "zip",
};

export const MAX_ALLEGATO_BYTES = 25 * 1024 * 1024; // 25 MB

function client(): AwsClient {
  return new AwsClient({
    accessKeyId: requireSecret("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireSecret("R2_SECRET_ACCESS_KEY"),
    region: "auto",
    service: "s3",
  });
}

export function r2Configured(): boolean {
  const env = workerEnv();
  return Boolean(env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY);
}

/**
 * URL firmato per un PUT diretto dal browser.
 * `expiresIn` breve: l'URL serve a caricare subito, non a essere conservato.
 */
export async function generatePresignedUrl(
  key: string,
  contentType: string,
  expiresIn = 300,
): Promise<string> {
  const url = new URL(`${R2_ENDPOINT}/${R2_BUCKET}/${key}`);
  url.searchParams.set("X-Amz-Expires", String(expiresIn));

  const signed = await client().sign(new Request(url.toString(), { method: "PUT" }), {
    aws: { signQuery: true },
    headers: { "Content-Type": contentType },
  });

  return signed.url;
}

/**
 * Cancella oggetti da R2. Restituisce le chiavi che NON è riuscita a cancellare,
 * così il chiamante può dirlo invece di fingere che sia andato tutto bene.
 * (La versione precedente firmava a mano, sbagliava la firma e ignorava l'esito:
 * le foto restavano su R2 dopo la cancellazione dell'album.)
 */
export async function deleteFromR2(keys: string[]): Promise<{ deleted: string[]; failed: string[] }> {
  const deleted: string[] = [];
  const failed: string[] = [];
  if (keys.length === 0) return { deleted, failed };

  const aws = client();
  for (const key of keys) {
    try {
      const res = await aws.fetch(`${R2_ENDPOINT}/${R2_BUCKET}/${key}`, { method: "DELETE" });
      // S3 risponde 204 sul successo, 404 se l'oggetto non c'era già più.
      if (res.ok || res.status === 404) deleted.push(key);
      else {
        failed.push(key);
        console.error(`R2 delete ${key}: HTTP ${res.status}`);
      }
    } catch (err) {
      failed.push(key);
      console.error(`R2 delete ${key}:`, err);
    }
  }
  return { deleted, failed };
}
