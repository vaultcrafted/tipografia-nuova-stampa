// ─── Sessione admin ──────────────────────────────────────────────────────────
// La password NON esiste lato client: il browser manda la password una sola
// volta a /api/admin/login, il Worker la verifica e risponde con un cookie di
// sessione firmato (HttpOnly, quindi il JavaScript della pagina non lo vede).
// Ogni rotta admin verifica quel cookie, non la password.

import { requireSecret, safeEqual } from "./worker-env";

const COOKIE_NAME = "tns_admin";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 ore

function bytesToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return bytesToHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
}

/** Verifica la password e restituisce il valore del cookie di sessione. */
export async function createSession(password: string): Promise<string | null> {
  const expected = requireSecret("ADMIN_PASSWORD");
  if (!safeEqual(password, expected)) return null;

  const secret = requireSecret("ADMIN_SESSION_SECRET");
  const expiresAt = String(Date.now() + SESSION_TTL_MS);
  return `${expiresAt}.${await sign(expiresAt, secret)}`;
}

export function sessionCookie(value: string, maxAgeSeconds: number): string {
  return [
    `${COOKIE_NAME}=${value}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    `Max-Age=${maxAgeSeconds}`,
  ].join("; ");
}

export const loginCookie = (value: string) => sessionCookie(value, SESSION_TTL_MS / 1000);
export const logoutCookie = () => sessionCookie("", 0);

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

/** true solo se la richiesta porta un cookie di sessione valido e non scaduto. */
export async function isAdmin(request: Request): Promise<boolean> {
  try {
    const raw = readCookie(request, COOKIE_NAME);
    if (!raw) return false;

    const dot = raw.lastIndexOf(".");
    if (dot <= 0) return false;
    const expiresAt = raw.slice(0, dot);
    const mac = raw.slice(dot + 1);

    const expiry = Number(expiresAt);
    if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

    const secret = requireSecret("ADMIN_SESSION_SECRET");
    return safeEqual(mac, await sign(expiresAt, secret));
  } catch {
    // Secret mancante o cookie malformato: si fallisce chiusi.
    return false;
  }
}

export const unauthorized = () =>
  new Response(JSON.stringify({ error: "Non autorizzato" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });

/** Restituisce null se la richiesta è autorizzata, altrimenti la risposta 401 da rimandare. */
export async function guard(request: Request): Promise<Response | null> {
  return (await isAdmin(request)) ? null : unauthorized();
}
