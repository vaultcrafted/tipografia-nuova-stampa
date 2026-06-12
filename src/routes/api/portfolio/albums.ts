// GET /api/portfolio/albums?category=fotografia&event=concerti
// Endpoint pubblico — gira sempre server-side nel Worker, ha accesso al KV binding
import { createFileRoute } from "@tanstack/react-router";
import { getAlbumsFromKV } from "@/lib/kv";

export const Route = createFileRoute("/api/portfolio/albums")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const categorySlug = url.searchParams.get("category") ?? "";
        const eventSlug = url.searchParams.get("event") ?? "";

        const albums = await getAlbumsFromKV(undefined, categorySlug, eventSlug);

        return new Response(JSON.stringify(albums), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
