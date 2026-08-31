import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getCategoryBySlug, categories } from "@/data/categories";
import { famigliaDi } from "@/data/famiglie";
import { CategoryGallery } from "@/components/CategoryGallery";
import { usePreventivo } from "@/lib/preventivo";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    const category = getCategoryBySlug(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const url = `https://tipografianuovastampa.com/categoria/${params.slug}`;
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
  const apriPreventivo = usePreventivo();
  const famiglia = famigliaDi(category.slug);
  const perSlug = new Map(categories.map((c) => [c.slug, c]));

  // Gli altri prodotti della stessa famiglia. Sono il motivo per cui la pagina
  // non e' un vicolo cieco: chi e' arrivato qui da Google cercando "biglietti da
  // visita" da qui scopre il resto della famiglia invece di tornare indietro.
  const vicini = (famiglia?.categorie ?? [])
    .filter((slug) => slug !== category.slug)
    .map((slug) => perSlug.get(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 4);

  // Nei dati alcune voci sono segnaposto ("-", stringhe vuote): senza filtro
  // la scheda tecnica mostrava una colonna "Finiture" con dentro un trattino,
  // che e' peggio di non mostrarla affatto — sembra un errore, non un dato.
  const utili = (voci?: string[]) =>
    (voci ?? []).map((v) => v.trim()).filter((v) => v.replace(/[-–—]/g, "").length > 0);

  const schede: { etichetta: string; voci: string[] }[] = [
    { etichetta: "Formati", voci: utili(category.formats) },
    { etichetta: "Supporti e grammature", voci: utili(category.grammature) },
    { etichetta: "Finiture", voci: utili(category.finiture) },
    { etichetta: "Tempi", voci: utili(category.tempi) },
  ].filter((s) => s.voci.length > 0);

  return (
    <div className="px-6 pb-24 sm:px-10 lg:px-16">
      {/* TESTATA. Il percorso in alto porta il colore della famiglia: e' il
          modo piu' economico per dire "sei dentro Carta e stampati" senza
          aggiungere una riga di spiegazione. Prima c'era "01 / 20", che
          sembrava una posizione in classifica e non serviva a nulla. */}
      <section className="border-b border-white/15 pb-12 pt-10 lg:pb-16 lg:pt-14">
        <nav className="occhiello mb-10 flex flex-wrap items-center gap-2 text-white/55">
          <Link
            to="/"
            className="-mx-2 inline-flex min-h-11 items-center px-2 transition-colors hover:text-white lg:mx-0 lg:min-h-0 lg:px-0"
          >
            Catalogo
          </Link>
          {famiglia && (
            <>
              <span aria-hidden="true">/</span>
              <span style={{ color: famiglia.colore }}>{famiglia.nome}</span>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <h1 className="font-display text-[11vw] leading-[0.95] tracking-[-0.03em] text-white sm:text-[7.5vw] lg:text-[5vw]">
              {category.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              {category.tagline}
            </p>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[15px] leading-relaxed text-white/60">
              {category.description}
            </p>
            <button
              type="button"
              onClick={() => apriPreventivo(category)}
              className="mt-7 hidden rounded-sm px-7 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] lg:inline-flex"
              style={{ background: "var(--brand-red)" }}
            >
              Preventivo per {category.name.toLowerCase()}
            </button>
          </div>
        </div>
      </section>

      {/* SCHEDA TECNICA. Impaginata come la scheda di un lavoro: etichetta in
          monospaziato, valori in tondo, un filetto per riga. Prima erano quattro
          riquadri con bordo e sfondo, e mancava del tutto la colonna delle
          finiture, che pure era gia' nei dati. */}
      <section className="border-b border-white/15 py-12 lg:py-16">
        <div className="occhiello mb-8 text-white/55">Scheda tecnica</div>
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {schede.map((s) => (
              <div key={s.etichetta}>
                <div
                  className="occhiello mb-4 border-t pt-3"
                  style={{
                    color: famiglia?.colore ?? "var(--brand-red)",
                    borderColor: famiglia?.colore ?? "var(--brand-red)",
                  }}
                >
                  {s.etichetta}
                </div>
                <ul className="space-y-2.5">
                  {s.voci.map((v) => (
                    <li key={v} className="text-[15px] leading-snug text-white/80">
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
          ))}
        </div>
      </section>

      <section className="border-b border-white/15 py-12 lg:py-16">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-3xl text-white lg:text-4xl">Lavori</h2>
          <span className="occhiello text-white/55">Tocca per ingrandire</span>
        </div>
        <CategoryGallery category={category} />
      </section>

      {category.videoUrl && (
        <section className="border-b border-white/15 py-12 lg:py-16">
          <h2 className="mb-8 font-display text-3xl text-white lg:text-4xl">In lavorazione</h2>
          <div className="aspect-video w-full overflow-hidden rounded-sm border border-white/10">
            <video
              src={category.videoUrl}
              poster={category.cover}
              controls
              preload="none"
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      )}

      {vicini.length > 0 && famiglia && (
        <section className="border-b border-white/15 py-12 lg:py-16">
          <div className="mb-8 flex flex-wrap items-baseline gap-3">
            <h2 className="font-display text-3xl text-white lg:text-4xl">
              Anche in {famiglia.nome.toLowerCase()}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            {vicini.map((c) => (
              <Link
                key={c.slug}
                to="/categoria/$slug"
                params={{ slug: c.slug }}
                className="group flex flex-col"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10">
                  <img
                    src={c.cover}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{ background: famiglia.colore }}
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 font-display text-[16px] leading-tight text-white">
                  {c.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CHIUSURA. Il pulsante mobile che stava qui e' sparito: adesso c'e' la
          barra fissa di tutto il sito, e due pulsanti identici sullo stesso
          schermo sono solo ingombro. */}
      <section className="py-14 lg:py-20">
        <div className="occhiello mb-5 text-white/55">Il prossimo passo</div>
        <h2 className="font-display text-4xl leading-[0.98] text-white lg:text-5xl">
          Quante te ne servono?
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">
          Mandaci il file, o anche solo un&apos;idea e una quantità. Ti rispondiamo
          con prezzo, tempi e le opzioni che consigliamo — di solito in giornata.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => apriPreventivo(category)}
            className="rounded-sm px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.02]"
            style={{ background: "var(--brand-red)" }}
          >
            Richiedi un preventivo
          </button>
          <a
            href="tel:+393332876277"
            className="rounded-sm border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white/80 transition-colors hover:border-white/50 hover:text-white"
          >
            Chiamaci
          </a>
        </div>
      </section>
    </div>
  );
}
