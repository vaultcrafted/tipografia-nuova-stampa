import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { categories, getCategoryBySlug } from "@/data/categories";
import { CategoryGallery } from "@/components/CategoryGallery";
import { QuoteFormModal } from "@/components/QuoteFormModal";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    const category = getCategoryBySlug(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const url = `https://tipografia-nuova-stampa.lovable.app/categoria/${params.slug}`;
    return {
      meta: [
        { title: `${loaderData.category.name} — Tipografia Nuova Stampa` },
        { name: "description", content: loaderData.category.description },
        { property: "og:title", content: `${loaderData.category.name} — Tipografia Nuova Stampa` },
        { property: "og:description", content: loaderData.category.tagline },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: loaderData.category.name,
            description: loaderData.category.description,
            provider: {
              "@type": "LocalBusiness",
              name: "Tipografia Nuova Stampa",
            },
            areaServed: "IT",
            url,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="px-8 py-24 text-center">
      <h1 className="font-display text-5xl text-white">Categoria non trovata</h1>
      <Link to="/" className="mt-6 inline-block text-white/60 underline">
        Torna alla home
      </Link>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const [open, setOpen] = useState(false);

  const idx = categories.findIndex((c) => c.slug === category.slug);

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
              {String(idx + 1).padStart(2, "0")} / 15 ·{" "}
              <span style={{ color: "var(--brand-red)" }}>{category.label}</span>
            </div>
            <h1 className="font-display text-white text-[13vw] sm:text-[9vw] lg:text-[6.5vw] leading-[0.92] tracking-tight">
              {category.name}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pb-4">
            <div
              className="hidden lg:block h-px w-12 mb-4"
              style={{ background: "var(--brand-red)" }}
            />
            <p className="text-white/70 leading-relaxed">{category.description}</p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mb-20">
        <div className="flex items-baseline justify-between mb-6">
          <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40">
            ◆ Lavori
          </div>
          <div className="font-mono-ui text-[10px] uppercase tracking-widest text-white/25">
            click per ingrandire
          </div>
        </div>
        <CategoryGallery category={category} />
      </section>

      {/* Tech sheet */}
      <section className="mb-20">
        <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">
          ◆ Scheda tecnica
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {([
            { label: "Formati", items: category.formats },
            { label: "Grammature / supporti", items: category.grammature },
            { label: "Finiture", items: category.finiture },
            { label: "Tempi di produzione", items: [category.tempi] },
          ] as { label: string; items: string[] }[]).map((card) => (
            <div
              key={card.label}
              className="rounded-md border border-white/10 bg-card/40 backdrop-blur-sm p-5 hover:border-white/20 transition-colors"
            >
              <div
                className="font-mono-ui text-[10px] uppercase tracking-[0.2em] mb-4"
                style={{ color: "var(--brand-red)" }}
              >
                {card.label}
              </div>
              <ul className="space-y-2">
                {card.items.map((it) => (
                  <li
                    key={it}
                    className="text-sm text-white leading-relaxed border-b border-white/5 pb-2 last:border-0"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Video */}
      <section className="mb-20">
        <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">
          ◆ Video
        </div>
        {category.videoUrl ? (
          <div className="w-full aspect-video rounded-lg overflow-hidden border border-white/10">
            <video
              src={category.videoUrl}
              controls
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-lg border border-white/10 bg-card/40 backdrop-blur-sm grid place-items-center">
            <div className="text-center">
              <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">
                Video in arrivo
              </div>
              <div className="font-display text-2xl text-white/20">
                {category.name}
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* CTA */}
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
            className="hidden lg:inline-flex items-center justify-center rounded-md px-7 py-4 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.03]"
            style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
          >
            Richiedi preventivo
          </button>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl p-3">
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-md py-3.5 text-sm font-bold uppercase tracking-widest text-white"
          style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
        >
          Richiedi preventivo
        </button>
      </div>

      <QuoteFormModal open={open} onClose={() => setOpen(false)} category={category} />
    </div>
  );
}
