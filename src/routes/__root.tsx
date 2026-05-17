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
      { name: "author", content: "Tipografia Nuova Stampa" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Tipografia Nuova Stampa" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b40e5053-909c-4e4a-8b4b-6bd8adedbba0/id-preview-696fcdaa--51e5ca87-fc1e-44e4-8975-033a965f0fb7.lovable.app-1779038440180.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b40e5053-909c-4e4a-8b4b-6bd8adedbba0/id-preview-696fcdaa--51e5ca87-fc1e-44e4-8975-033a965f0fb7.lovable.app-1779038440180.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Tipografia Nuova Stampa di Giunipero Stefano",
          description:
            "Tipografia professionale a Livorno Ferraris: biglietti da visita, brochure, grande formato, DTF, stampa su legno e altro.",
          url: "https://tipografia-nuova-stampa.lovable.app",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Via Martiri della Libertà 65",
            addressLocality: "Livorno Ferraris",
            postalCode: "13046",
            addressRegion: "VC",
            addressCountry: "IT",
          },
          vatID: "02789310022",
        }),
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
      href="https://wa.me/393332876277"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110"
        style={{ background: "#25D366" }}
        aria-label="Contattaci su WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.526 5.855L.057 23.143a.75.75 0 0 0 .918.899l5.444-1.428A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.726 9.726 0 0 1-4.953-1.355l-.355-.211-3.676.964.981-3.584-.231-.368A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
        </svg>
      </a>
    </QueryClientProvider>
  );
}
