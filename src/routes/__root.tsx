import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
          Errore 404
        </div>
        <h1 className="font-display text-6xl text-white">Pagina non trovata</h1>
        <p className="mt-3 text-sm text-white/60">
          La pagina che cerchi non esiste o è stata spostata.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: "var(--brand-red)" }}
        >
          Torna alla home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-white">Qualcosa è andato storto</h1>
        <p className="mt-2 text-sm text-white/60">Riprova o torna alla home.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md px-5 py-2.5 text-sm font-semibold text-white"
            style={{ background: "var(--brand-red)" }}
          >
            Riprova
          </button>
          <a
            href="/"
            className="rounded-md border border-white/20 px-5 py-2.5 text-sm text-white"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tipografia Nuova Stampa — Stampa professionale a Livorno Ferraris" },
      {
        name: "description",
        content:
          "Tipografia professionale a Livorno Ferraris: biglietti da visita, brochure, grande formato, DTF, stampa su legno e molto altro. Richiedi un preventivo.",
      },
      { name: "author", content: "Tipografia Nuova Stampa" },
      { property: "og:title", content: "Tipografia Nuova Stampa" },
      {
        property: "og:description",
        content: "Stampa professionale per chi non scende a compromessi.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AppHeader onMenuToggle={() => setMenuOpen((v) => !v)} />
      <div className="flex">
        <AppSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="flex-1 min-w-0">
          <Outlet />
          <AppFooter />
        </main>
      </div>
    </QueryClientProvider>
  );
}
