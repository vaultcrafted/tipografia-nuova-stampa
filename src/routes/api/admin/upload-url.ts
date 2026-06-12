// POST /api/admin/upload-url — genera presigned URL per upload su R2
// Usato sia dall'admin (con password) che dal form preventivo (senza password, cartella preventivi/)
import { createFileRoute } from "@tanstack/react-router";
import { generatePresignedUrl } from "@/lib/r2-upload";

const ADMIN_PASSWORD = "nuovastampa2024";

export const Route = createFileRoute("/api/admin/upload-url")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json() as {
          key: string;
          contentType: string;
          public?: boolean; // true = nessuna password richiesta, solo cartella preventivi/
        };

        if (!body.key || !body.contentType) {
          return new Response(JSON.stringify({ error: "key e contentType richiesti" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Richieste pubbliche solo per la cartella preventivi/
        const isPublicRequest = body.public === true;
        const isPreventivi = body.key.startsWith("preventivi/");

        if (!isPublicRequest || !isPreventivi) {
          const auth = request.headers.get("x-admin-password");
          if (auth !== ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: "Non autorizzato" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }
        }

        const presignedUrl = await generatePresignedUrl(body.key, body.contentType);
        const publicUrl = `https://media.tipografianuovastampa.com/${body.key}`;

        return new Response(JSON.stringify({ url: presignedUrl, publicUrl }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
