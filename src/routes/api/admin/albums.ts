// GET /api/admin/albums?category=fotografia&event=concerti
// Richiede una sessione admin valida (cookie firmato, vedi lib/admin-auth).
import { createFileRoute } from "@tanstack/react-router";
import { getAlbumsFromKV } from "@/lib/kv";
import { guard } from "@/lib/admin-auth";

export const Route = createFileRoute("/api/admin/albums")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = await guard(request);
        if (denied) return denied;

        const url = new URL(request.url);
        const categorySlug = url.searchParams.get("category") ?? "";
        const eventSlug = url.searchParams.get("event") ?? "";

        const albums = await getAlbumsFromKV(undefined, categorySlug, eventSlug);
        return new Response(JSON.stringify(albums), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
