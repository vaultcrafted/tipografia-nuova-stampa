// GET /api/admin/albums?category=fotografia&event=concerti
import { createFileRoute } from "@tanstack/react-router";
import type { WorkerEnv } from "@/lib/kv";
import { getAlbumsFromKV } from "@/lib/kv";

const ADMIN_PASSWORD = "nuovastampa2024";

export const Route = createFileRoute("/api/admin/albums")({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        const auth = request.headers.get("x-admin-password");
        if (auth !== ADMIN_PASSWORD) {
          return new Response(JSON.stringify({ error: "Non autorizzato" }), {
            status: 401, headers: { "Content-Type": "application/json" },
          });
        }

        const env = (context as unknown as { env?: WorkerEnv }).env;
        if (!env?.KV_PORTFOLIO) {
          return new Response(JSON.stringify({ error: "KV non configurato" }), {
            status: 500, headers: { "Content-Type": "application/json" },
          });
        }

        const url = new URL(request.url);
        const categorySlug = url.searchParams.get("category") ?? "";
        const eventSlug = url.searchParams.get("event") ?? "";

        const albums = await getAlbumsFromKV(env.KV_PORTFOLIO, categorySlug, eventSlug);
        return new Response(JSON.stringify(albums), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
