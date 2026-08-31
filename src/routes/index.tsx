import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, portfolioCategories } from "@/data/categories";
import { HeroCinematico } from "@/components/HeroCinematico";
import { BloccoNovita } from "@/components/BloccoNovita";
import { Recensioni } from "@/components/Recensioni";
import { QuoteFormModal } from "@/components/QuoteFormModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tipografia Nuova Stampa — Stampa premium a Livorno Ferraris" },
      {
        name: "description",
        content:
          "Showreel della Tipografia Nuova Stampa: biglietti da visita, brochure, grande formato, DTF e stampa artigianale. Richiedi un preventivo.",
      },
      { property: "og:title", content: "Tipografia Nuova Stampa — Stampa premium" },
      {
        property: "og:description",
        content:
          "Stampa professionale per chi non scende a compromessi. Offset, digitale, DTF, grande formato e finiture artigianali.",
      },
      { property: "og:url", content: "https://tipografianuovastampa.it/" },
    ],
    links: [
      { rel: "canonical", href: "https://tipografianuovastampa.it/" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [open, setOpen] = useState(false);
  const totalCount = categories.length + portfolioCategories.length;

  return (
    <div className="px-6 sm:px-10 lg:px-16">
      <HeroCinematico />

      {/* NOVITÀ — il blocco vive in un componente suo: ha uno stato
          (video che parte solo quando entra in vista) e non c'entra con la
          griglia del catalogo. */}
      <BloccoNovita onPreventivo={() => setOpen(true)} />

      {/* CATEGORY GRID — stampa */}
      <section className="pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
              {totalCount} categorie
            </div>
            <h2 className="font-display text-4xl lg:text-5xl text-white">
              Cosa stampiamo
            </h2>
          </div>
          <div className="hidden sm:block font-mono-ui text-[10px] uppercase tracking-widest text-white/30">
            scroll / click
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to="/categoria/$slug"
              params={{ slug: c.slug }}
              className="group relative aspect-[5/6] overflow-hidden rounded-md border border-white/10 bg-card/40 backdrop-blur-sm transition-all hover:border-[var(--brand-red)] hover:-translate-y-1"
            >
              {/* Scatto verticale di categoria */}
              <img
                src={c.cover}
                alt={c.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              {/* Numero indice */}
              <span className="absolute top-4 left-4 font-mono-ui text-[10px] tabular-nums text-white/30 z-10 transition-opacity duration-300 group-hover:opacity-0">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Nome in basso a riposo */}
              <div className="absolute inset-x-0 bottom-0 p-5 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-2">
                <h3 className="font-display text-2xl text-white leading-tight">{c.name}</h3>
                <p className="mt-1.5 text-[11px] text-white/40 line-clamp-1">{c.tagline}</p>
              </div>

              {/* Overlay rosso all'hover */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "rgba(180,30,30,0.82)" }}
              >
                <h3 className="font-display text-3xl text-white text-center px-4 leading-tight">{c.name}</h3>
                <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/70">Scopri →</span>
              </div>
            </Link>
          ))}
                </div>
      </section>

      {/* PORTFOLIO GRID — foto & video */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
              portfolio
            </div>
            <h2 className="font-display text-4xl lg:text-5xl text-white">
              Foto &amp; Video
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {portfolioCategories.map((c, i) => (
            <Link
              key={c.slug}
              to="/portfolio/$slug"
              params={{ slug: c.slug }}
              className="group relative overflow-hidden rounded-md border border-white/10 bg-card/40 backdrop-blur-sm p-5 transition-all hover:border-[var(--brand-red)] hover:bg-card/70 hover:-translate-y-1 hover:glow-red"
              style={{ minHeight: "180px" }}
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-mono-ui text-[10px] tabular-nums text-white/40">
                    {String(categories.length + i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-white/40 group-hover:text-[var(--brand-red)] transition-colors">
                    {c.label}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-3xl text-white leading-tight">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-[12px] text-white/50 line-clamp-2">
                    {c.tagline}
                  </p>
                  <div className="mt-3 font-mono-ui text-[10px] text-white/30 uppercase tracking-widest">
                    {c.events.length} tipologie di eventi
                  </div>
                </div>
              </div>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: "var(--brand-red)" }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* RECENSIONI — chiudono la pagina: prima si vede cosa stampiamo, poi chi
          lo dice. Il filetto in alto le stacca dal portfolio, che e' una griglia
          fitta e altrimenti ci si attaccherebbe sopra. */}
      <div className="mt-20 lg:mt-28 border-t border-white/10 pb-24">
        <Recensioni />
      </div>

      {/* CTA PREVENTIVO */}
      <section className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 lg:p-12 mb-16">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end justify-between">
          <div>
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
              Pronto a partire?
            </div>
            <h2 className="font-display text-4xl lg:text-5xl text-white">
              Richiedi un preventivo
            </h2>
            <p className="mt-2 text-white/60 max-w-lg">
              Inviaci specifiche e file: ti rispondiamo entro 24 ore con tempi e
              opzioni di stampa.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-md px-7 py-4 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.03]"
            style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
          >
            Richiedi preventivo
          </button>
        </div>
      </section>

      <QuoteFormModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
