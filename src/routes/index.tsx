import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, portfolioCategories } from "@/data/categories";
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
      {/* HERO */}
      <section className="min-h-[78vh] flex flex-col justify-center py-16 lg:py-24">
        <div className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-white/40 mb-8">
          ◢ Stampa tipografica · Livorno Ferraris (VC)
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <h1 className="lg:col-span-9 font-display text-white text-[18vw] sm:text-[12vw] lg:text-[9.5vw] leading-[0.88] tracking-tight">
            Diamo forma
            <br />
            <span className="inline-block">
              alle tue{" "}
              <span style={{ color: "var(--brand-red)" }} className="text-glow-red">
                idee
              </span>
            </span>
          </h1>

          <div className="lg:col-span-3 lg:pb-6">
            <div
              className="hidden lg:block h-px w-12 mb-4"
              style={{ background: "var(--brand-red)" }}
            />
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Stampa professionale per chi non scende a compromessi.
              Offset, digitale, DTF, grande formato e finiture artigianali —
              tutto sotto lo stesso tetto.
            </p>
          </div>
        </div>
      </section>

      {/* NOVITÀ · DTF */}
      <section className="mb-20 lg:mb-28">
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent p-8 lg:p-12">
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{ background: "var(--brand-red)" }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div
                className="font-mono-ui text-[11px] uppercase tracking-[0.3em] mb-5"
                style={{ color: "var(--brand-red)" }}
              >
                ◢ Novità · DTF
              </div>
              <h2 className="font-display text-white text-5xl lg:text-6xl leading-[0.95] tracking-tight">
                Stampa su
                <br />
                abbigliamento
              </h2>
              <p className="mt-5 text-white/70 text-base lg:text-lg leading-relaxed max-w-lg">
                La tecnologia Direct-to-Film per capi personalizzati con colori
                brillanti, dettagli fotografici e resistenza ai lavaggi.
              </p>
              <Link
                to="/categoria/$slug"
                params={{ slug: "abbigliamento-dtf" }}
                className="mt-8 inline-flex items-center justify-center rounded-md px-7 py-4 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.03]"
                style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
              >
                Scopri di più
              </Link>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-black/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
                    Placeholder
                  </div>
                  <div className="font-display text-3xl text-white/30">
                    Foto / Video DTF
                  </div>
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: "var(--brand-red)" }}
              />
            </div>
          </div>
        </div>
      </section>

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
              className="group relative aspect-[5/6] overflow-hidden rounded-md border border-white/10 bg-card/40 backdrop-blur-sm p-5 transition-all hover:border-[var(--brand-red)] hover:bg-card/70 hover:-translate-y-1 hover:glow-red"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-mono-ui text-[10px] tabular-nums text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-white/40 group-hover:text-[var(--brand-red)] transition-colors">
                    {c.label}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white leading-tight">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-[12px] text-white/50 line-clamp-2">
                    {c.tagline}
                  </p>
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

      {/* PORTFOLIO GRID — foto & video */}
      <section className="pb-24">
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
