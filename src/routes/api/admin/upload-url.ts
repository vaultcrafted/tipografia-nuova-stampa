// POST /api/admin/upload-url — URL firmato per caricare su R2.
//
// Due modi d'uso:
//  - admin (sessione valida): sceglie la chiave, per le foto del portfolio;
//  - pubblico (form preventivo): NON sceglie la chiave e non sceglie il tipo.
//    La chiave la genera il server dentro preventivi/, il tipo deve stare
//    nell'elenco consentito e la dimensione è dichiarata e limitata.
import { createFileRoute } from "@tanstack/react-router";
import {
  ALLEGATI_CONSENTITI,
  MAX_ALLEGATO_BYTES,
  generatePresignedUrl,
  r2Configured,
} from "@/lib/r2-upload";
import { isAdmin } from "@/lib/admin-auth";

const MEDIA_BASE = "https://media.tipografianuovastampa.com";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** Chiavi admin: niente traversal, niente caratteri strani, niente doppie barre. */
function chiaveAdminValida(key: string): boolean {
  return (
    key.length > 0 &&
    key.length <= 300 &&
    /^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(key) &&
    !key.includes("..") &&
    !key.includes("//")
  );
}

export const Route = createFileRoute("/api/admin/upload-url")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!r2Configured()) {
          return json({ error: "Storage non configurato sul server" }, 503);
        }

        let body: {
          key?: string;
          contentType?: string;
          size?: number;
          public?: boolean;
        };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return json({ error: "Richiesta non valida" }, 400);
        }

        const contentType = typeof body.contentType === "string" ? body.contentType : "";
        if (!contentType) return json({ error: "contentType richiesto" }, 400);

        const admin = await isAdmin(request);

        // ── Percorso pubblico: allegati del form preventivo ──────────────────
        if (!admin) {
          const ext = ALLEGATI_CONSENTITI[contentType];
          if (!ext) {
            return json(
              {
                error: "Tipo di file non consentito",
                consentiti: Object.keys(ALLEGATI_CONSENTITI),
              },
              415,
            );
          }

          const size = typeof body.size === "number" ? body.size : NaN;
          if (!Number.isFinite(size) || size <= 0) {
            return json({ error: "size richiesta" }, 400);
          }
          if (size > MAX_ALLEGATO_BYTES) {
            return json(
              { error: `File troppo grande. Massimo ${Math.floor(MAX_ALLEGATO_BYTES / 1024 / 1024)} MB.` },
              413,
            );
          }

          // La chiave la decide il server: il client non sceglie dove scrivere.
          const giorno = new Date().toISOString().slice(0, 10);
          const key = `preventivi/${giorno}/${crypto.randomUUID()}.${ext}`;
          return json({
            url: await generatePresignedUrl(key, contentType, 300),
            publicUrl: `${MEDIA_BASE}/${key}`,
          });
        }

        // ── Percorso admin: chiave scelta, ma validata ───────────────────────
        const key = typeof body.key === "string" ? body.key : "";
        if (!chiaveAdminValida(key)) return json({ error: "key non valida" }, 400);

        return json({
          url: await generatePresignedUrl(key, contentType, 3600),
          publicUrl: `${MEDIA_BASE}/${key}`,
        });
      },
    },
  },
});
