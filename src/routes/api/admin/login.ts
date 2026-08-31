// POST /api/admin/login   { password } → cookie di sessione HttpOnly
// DELETE /api/admin/login → logout
// La password viaggia una volta sola e viene verificata nel Worker: non è
// presente da nessuna parte nel codice che arriva al browser.
import { createFileRoute } from "@tanstack/react-router";
import { createSession, loginCookie, logoutCookie } from "@/lib/admin-auth";

const json = (body: unknown, status: number, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extra },
  });

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let password = "";
        try {
          const body = (await request.json()) as { password?: unknown };
          if (typeof body.password === "string") password = body.password;
        } catch {
          return json({ error: "Richiesta non valida" }, 400);
        }
        if (!password) return json({ error: "Password richiesta" }, 400);

        let session: string | null;
        try {
          session = await createSession(password);
        } catch (err) {
          // Secret non configurati: meglio dirlo che lasciar passare tutti.
          console.error("Login admin non configurato:", err);
          return json({ error: "Accesso admin non configurato sul server" }, 503);
        }

        if (!session) return json({ error: "Password errata" }, 401);
        return json({ ok: true }, 200, { "Set-Cookie": loginCookie(session) });
      },

      DELETE: async () => json({ ok: true }, 200, { "Set-Cookie": logoutCookie() }),
    },
  },
});
