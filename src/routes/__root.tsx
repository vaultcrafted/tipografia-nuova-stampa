import { useState } from "react";
import type { WorkerEnv } from "@/lib/kv";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";
import { BarraAzioni } from "@/components/BarraAzioni";
import { QuoteFormModal } from "@/components/QuoteFormModal";
import { PreventivoProvider } from "@/lib/preventivo";
import { categories, type Category } from "@/data/categories";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/55 mb-3">
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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient; env?: WorkerEnv }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Tipografia Nuova Stampa" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Tipografia Nuova Stampa" },
      // L'immagine che si vede quando si manda il link su WhatsApp o Facebook.
      // Era uno screenshot di anteprima di Lovable dentro un bucket R2: un
      // fotogramma del sito vecchio, senza nessun rapporto con la tipografia.
      // Ora e' il fotogramma della testata, 1280x720, che e' una foto di
      // stampa vera.
      { property: "og:image", content: "https://tipografianuovastampa.com/hero/v3/hero.webp" },
      { property: "og:image:width", content: "1280" },
      { property: "og:image:height", content: "720" },
      { property: "og:locale", content: "it_IT" },
      { name: "twitter:image", content: "https://tipografianuovastampa.com/hero/v3/hero.webp" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      // L'SVG e' quello buono (si adatta al tema della barra). Gli altri sono le
      // scialuppe: Google e diversi client non leggono l'SVG e cercano il .ico.
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "icon", href: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { rel: "stylesheet", href: appCss },
      // Jost e' una riedizione libera della Futura: per una tipografia e' una
      // citazione, non una moda. IBM Plex Mono serve solo alle etichette
      // tecniche. Due famiglie e sei pesi in tutto: ogni peso in piu' e' un
      // altro file da scaricare prima che il testo diventi leggibile.
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap",
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
          url: "https://tipografianuovastampa.com",
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
  // Il modulo preventivo vive qui, non nella home: cosi' e' raggiungibile da
  // qualunque pagina, compresa una scheda prodotto aperta da Google.
  const [preventivoAperto, setPreventivoAperto] = useState(false);
  const [preventivoCategoria, setPreventivoCategoria] = useState<Category | undefined>();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  /**
   * Se il modulo viene aperto senza dire da dove, e siamo su una scheda
   * prodotto, la categoria si ricava dall'indirizzo.
   *
   * Serviva perche' i due pulsanti piu' usati — quello rosso
   * nell'intestazione e quello della barra fissa del telefono — non sanno
   * nulla della pagina sotto: aprivano il modulo con la categoria vuota, e
   * chi stava guardando i volantini si trovava scritto "Biglietti da visita",
   * cioe' la prima voce dell'elenco. Sul telefono quella barra e' *il* modo di
   * chiedere un preventivo, quindi era il caso piu' frequente di tutti.
   */
  const categoriaDaIndirizzo = () => {
    const trovato = /^\/categoria\/([^/]+)\/?$/.exec(pathname);
    return trovato ? categories.find((c) => c.slug === trovato[1]) : undefined;
  };

  const apri = (categoria?: Category) => {
    setPreventivoCategoria(categoria ?? categoriaDaIndirizzo());
    setPreventivoAperto(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PreventivoProvider value={apri}>
        <AppHeader onMenuToggle={() => setMenuOpen((v) => !v)} />
        <div className="flex">
          <AppSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
          {/* pb-24 sul telefono: sotto c'e' la barra fissa con preventivo e
              WhatsApp, e senza questo spazio coprirebbe la fine del piede. */}
          <main className="min-w-0 flex-1 pb-24 md:pb-0">
            <Outlet />
            <AppFooter />
          </main>
        </div>
        <BarraAzioni onPreventivo={() => apri()} />
        <QuoteFormModal
          open={preventivoAperto}
          onClose={() => setPreventivoAperto(false)}
          category={preventivoCategoria}
        />
      </PreventivoProvider>
    </QueryClientProvider>
  );
}
