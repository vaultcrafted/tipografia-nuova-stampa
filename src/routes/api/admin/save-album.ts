// POST   /api/admin/save-album — salva album su KV
// DELETE /api/admin/save-album — elimina album da KV e le sue foto da R2
// Entrambe richiedono una sessione admin valida.
import { createFileRoute } from "@tanstack/react-router";
import { addAlbumToKV, deleteAlbumFromKV, getAlbumsFromKV } from "@/lib/kv";
import { deleteFromR2 } from "@/lib/r2-upload";
import { guard } from "@/lib/admin-auth";
import type { Album } from "@/data/portfolio";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const Route = createFileRoute("/api/admin/save-album")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = await guard(request);
        if (denied) return denied;

        let body: { categorySlug?: string; eventSlug?: string; album?: Album };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return json({ error: "Richiesta non valida" }, 400);
        }
        if (!body.categorySlug || !body.eventSlug || !body.album?.slug) {
          return json({ error: "categorySlug, eventSlug e album sono obbligatori" }, 400);
        }

        await addAlbumToKV(undefined, body.categorySlug, body.eventSlug, body.album);
        return json({ ok: true });
      },

      DELETE: async ({ request }) => {
        const denied = await guard(request);
        if (denied) return denied;

        let body: {
          categorySlug?: string;
          eventSlug?: string;
          albumSlug?: string;
          skipR2?: boolean;
        };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return json({ error: "Richiesta non valida" }, 400);
        }
        if (!body.categorySlug || !body.eventSlug || !body.albumSlug) {
          return json({ error: "categorySlug, eventSlug e albumSlug sono obbligatori" }, 400);
        }

        // Le foto vanno lette prima di togliere l'album dal KV.
        const albums = await getAlbumsFromKV(undefined, body.categorySlug, body.eventSlug);
        const album = albums.find((a) => a.slug === body.albumSlug);
        if (!album) return json({ error: "Album non trovato" }, 404);
        const photoKeys = album.photos.map((p) => p.id);

        // Se le foto vanno cancellate, si cancellano PRIMA: se R2 fallisce,
        // l'album resta nel KV e l'operazione è ripetibile invece di lasciare
        // file orfani su R2 senza più un album che li elenchi.
        let deletedCount = 0;
        if (!body.skipR2 && photoKeys.length > 0) {
          const { deleted, failed } = await deleteFromR2(photoKeys);
          if (failed.length > 0) {
            return json(
              {
                error: `Non sono riuscito a eliminare ${failed.length} file su R2. L'album non è stato toccato: riprova.`,
                failed,
              },
              502,
            );
          }
          deletedCount = deleted.length;
        }

        await deleteAlbumFromKV(undefined, body.categorySlug, body.eventSlug, body.albumSlug);
        return json({ ok: true, deleted: deletedCount });
      },
    },
  },
});
