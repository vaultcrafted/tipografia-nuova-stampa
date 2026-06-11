// POST /api/admin/save-album — salva album su KV
import { createFileRoute } from "@tanstack/react-router";
import type { WorkerEnv } from "@/lib/kv";
import { addAlbumToKV, deleteAlbumFromKV } from "@/lib/kv";
import type { Album } from "@/data/portfolio";

const ADMIN_PASSWORD = "nuovastampa2024";

export const Route = createFileRoute("/api/admin/save-album")({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        const auth = request.headers.get("x-admin-password");
        if (auth !== ADMIN_PASSWORD) {
          return new Response(JSON.stringify({ error: "Non autorizzato" }), {
            status: 401, headers: { "Content-Type": "application/json" },
          });
        }

        const body = await request.json() as {
          categorySlug: string;
          eventSlug: string;
          album: Album;
        };

        await addAlbumToKV(undefined, body.categorySlug, body.eventSlug, body.album);

        return new Response(JSON.stringify({ ok: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },

      DELETE: async ({ request, context }) => {
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

        await deleteAlbumFromKV(undefined, body.categorySlug, body.eventSlug, body.albumSlug);

        return new Response(JSON.stringify({ ok: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
