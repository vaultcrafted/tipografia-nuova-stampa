import { createFileRoute, notFound, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { portfolioCategories } from "@/data/categories";
import { getEventAlbums } from "@/data/portfolio";
import type { EventType } from "@/data/categories";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const category = portfolioCategories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const url = `https://tipografianuovastampa.com/portfolio/${params.slug}`;
    return {
      meta: [
        { title: `${loaderData.category.name} — Tipografia Nuova Stampa` },
        { name: "description", content: loaderData.category.description },
        { property: "og:title", content: `${loaderData.category.name} — Tipografia Nuova Stampa` },
        { property: "og:description", content: loaderData.category.tagline },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="px-8 py-24 text-center">
      <h1 className="font-display text-5xl text-white">Portfolio non trovato</h1>
      <Link to="/" className="mt-6 inline-block text-white/60 underline">
        Torna alla home
      </Link>
    </div>
  ),
  component: PortfolioWrapper,
});

function PortfolioWrapper() {
  const matchRoute = useMatchRoute();
  // Se siamo su una sotto-rotta (evento o album), mostra quella
  const isEvent = matchRoute({ to: "/portfolio/$slug/$event", fuzzy: true });
  if (isEvent) return <Outlet />;
  return <PortfolioPage />;
}

function EventCard({
  event,
  index,
  categorySlug,
}: {
  event: EventType;
  index: number;
  categorySlug: string;
}) {
  const albums = getEventAlbums(categorySlug, event.slug)?.albums ?? [];
  const hasAlbums = albums.length > 0;

  const tileStyle = {
    background:
      "linear-gradient(135deg, oklch(0.24 0.11 240) 0%, oklch(0.18 0.09 230) 60%, oklch(0.20 0.07 220 / 0.7) 100%)",
  };

  return (
    <Link
      to="/portfolio/$slug/$event"
      params={{ slug: categorySlug, event: event.slug }}
      className="group relative w-full text-left overflow-hidden rounded-lg border border-white/10 hover:border-[var(--brand-red)] transition-all duration-300 hover:-translate-y-1 block"
      style={{ aspectRatio: "4/3" }}
    >
      <div className="absolute inset-0" style={tileStyle} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "radial-gradient(ellipse at center, rgba(180,30,30,0.15) 0%, transparent 70%)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}
      />

      <div className="absolute top-4 left-4 font-mono-ui text-[10px] tabular-nums text-white/30">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Contatore album */}
      <div className="absolute top-4 right-4 font-mono-ui text-[9px] uppercase tracking-[0.2em] text-white/30 group-hover:text-[var(--brand-red)] transition-colors">
        {hasAlbums ? `${albums.length} album` : "prossimamente"}
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-15 group-hover:opacity-8 transition-opacity">
        <div className="font-display text-6xl text-white/40">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-2xl lg:text-3xl text-white leading-tight">
          {event.name}
        </h3>
        <p className="mt-1.5 text-[12px] text-white/50 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 font-mono-ui text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
          <span>{hasAlbums ? "Sfoglia album" : "In arrivo"}</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: "var(--brand-red)" }}
      />
    </Link>
  );
}

function PortfolioPage() {
  const { category } = Route.useLoaderData();
  const isPhoto = category.slug === "fotografia";

  return (
    <div className="px-6 sm:px-10 lg:px-16 pb-32 lg:pb-16">
      {/* Header */}
      <section className="pt-12 lg:pt-16 pb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Catalogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
              portfolio ·{" "}
              <span style={{ color: "var(--brand-red)" }}>{category.label}</span>
            </div>
            <h1 className="font-display text-white text-[13vw] sm:text-[9vw] lg:text-[6.5vw] leading-[0.92] tracking-tight">
              {category.name}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pb-4">
            <div className="hidden lg:block h-px w-12 mb-4" style={{ background: "var(--brand-red)" }} />
            <p className="text-white/70 leading-relaxed">{category.description}</p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px border border-white/10 rounded-lg overflow-hidden">
          {[
            { label: "Tipologie di eventi", value: String(category.events.length) },
            { label: isPhoto ? "Approccio" : "Formato consegna", value: isPhoto ? "Reportage" : "HD / 4K" },
            { label: "Consegna", value: isPhoto ? "Entro 30 giorni" : "Entro 60 giorni" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card/40 backdrop-blur-sm px-6 py-5">
              <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
                {stat.label}
              </div>
              <div className="font-display text-3xl text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Events grid */}
      <section className="mb-20">
        <div className="flex items-baseline justify-between mb-6">
          <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40">
            ◆ Tipologie di eventi
          </div>
          <div className="font-mono-ui text-[10px] uppercase tracking-widest text-white/25">
            click per gli album
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.events.map((event: import("@/data/categories").EventType, i: number) => (
            <EventCard
              key={event.slug}
              event={event}
              index={i}
              categorySlug={category.slug}
            />
          ))}
        </div>
      </section>

      {/* Come funziona */}
      <section className="mb-20">
        <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">
          ◆ Come funziona
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(isPhoto
            ? [
                { step: "01", title: "Contattami", body: "Dimmi il tipo di evento, la data e il luogo. Ti rispondo entro 24 ore con disponibilità e preventivo." },
                { step: "02", title: "Il servizio", body: "Il giorno dell'evento sono presente con attrezzatura professionale. Lavoro in modo discreto per non disturbare la naturalezza dei momenti." },
                { step: "03", title: "Le consegne", body: "Entro 30 giorni ricevi la galleria privata online con tutte le foto selezionate e ritoccate in alta risoluzione." },
              ]
            : [
                { step: "01", title: "Contattami", body: "Dimmi il tipo di evento, la data e il luogo. Ti rispondo entro 24 ore con disponibilità, formato e preventivo." },
                { step: "02", title: "Le riprese", body: "Arrivo con anticipo per i preparativi tecnici. Microfoni, luci, camere — tutto ottimizzato per la location." },
                { step: "03", title: "Il montaggio", body: "Entro 60 giorni ricevi il video montato, con color grading professionale, musica e formato per social o archivio." },
              ]
          ).map((item) => (
            <div
              key={item.step}
              className="rounded-md border border-white/10 bg-card/40 backdrop-blur-sm p-6 hover:border-white/20 transition-colors"
            >
              <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: "var(--brand-red)" }}>
                {item.step}
              </div>
              <h3 className="font-display text-xl text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 lg:p-12 mb-16">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end justify-between">
          <div>
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
              Prenota il tuo servizio
            </div>
            <h2 className="font-display text-4xl lg:text-5xl text-white">
              Parliamo del tuo evento
            </h2>
            <p className="mt-2 text-white/60 max-w-lg">
              Contattami su WhatsApp o telefono per disponibilità e preventivo su misura.
            </p>
          </div>
          <a
            href="https://wa.me/393332876277"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center justify-center rounded-md px-7 py-4 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.03]"
            style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
          >
            Contattami su WhatsApp
          </a>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl p-3">
        <a
          href="https://wa.me/393332876277"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-md py-3.5 text-sm font-bold uppercase tracking-widest text-white text-center"
          style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
        >
          Contattami su WhatsApp
        </a>
      </div>
    </div>
  );
}
