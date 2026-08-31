import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, portfolioCategories } from "@/data/categories";
import { HeroCinematico } from "@/components/HeroCinematico";
import { BloccoNovita } from "@/components/BloccoNovita";
import { CatalogoFamiglie } from "@/components/CatalogoFamiglie";
import { Recensioni } from "@/components/Recensioni";
import { usePreventivo } from "@/lib/preventivo";

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
  const apriPreventivo = usePreventivo();

  return (
    <div className="px-6 sm:px-10 lg:px-16">
      <HeroCinematico />

      {/* NOVITÀ — il blocco vive in un componente suo: ha uno stato (video che
          parte solo quando entra in vista) e non c'entra con il catalogo. */}
      <BloccoNovita onPreventivo={apriPreventivo} />

      <CatalogoFamiglie />

      {/* PORTFOLIO — due sole voci, quindi due riquadri grandi con la loro
          fotografia invece delle schede di testo che c'erano prima: erano gli
          unici due elementi della home senza un'immagine e si vedeva. */}
      <section className="mt-20 border-t border-white/15 pt-6 lg:mt-28">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-4xl text-white lg:text-5xl">Foto &amp; Video</h2>
          <span className="occhiello text-white/55">Portfolio</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {portfolioCategories.map((c) => (
            <Link
              key={c.slug}
              to="/portfolio/$slug"
              params={{ slug: c.slug }}
              className="group relative aspect-[16/10] overflow-hidden rounded-sm border border-white/10"
            >
              <img
                src={`/media/${c.slug}/v.webp`}
                alt={c.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11,11,12,0.94) 0%, rgba(11,11,12,0.55) 38%, transparent 72%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-3xl leading-tight text-white">{c.name}</h3>
                <p className="mt-1.5 max-w-[34ch] text-sm text-white/65">{c.tagline}</p>
                <div className="occhiello mt-3 text-white/55">
                  {c.events.length} tipologie di eventi
                </div>
              </div>
              <span
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ background: "var(--brand-red)" }}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* RECENSIONI — chiudono il racconto: prima si vede cosa stampiamo, poi
          chi lo dice. */}
      <div className="mt-20 border-t border-white/15 lg:mt-28">
        <Recensioni />
      </div>

      {/* CHIUSURA — l'ultima cosa della pagina e' la richiesta di preventivo, e
          dice cosa succede dopo aver premuto: senza, "richiedi un preventivo"
          e' un salto nel buio. */}
      <section className="mt-20 border-t border-white/15 pt-14 pb-20 lg:mt-28 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
          <div>
            <div className="occhiello mb-5 text-white/55">Il prossimo passo</div>
            <h2 className="font-display text-5xl leading-[0.95] text-white lg:text-6xl">
              Dicci cosa ti serve.
              <br />
              Al resto pensiamo noi.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65">
              Mandaci il file, o anche solo un&apos;idea e una quantità. Ti
              rispondiamo con prezzo, tempi e le opzioni di stampa che
              consigliamo — di solito in giornata.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => apriPreventivo()}
                className="rounded-sm px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.02]"
                style={{ background: "var(--brand-red)" }}
              >
                Richiedi un preventivo
              </button>
              <a
                href="https://wa.me/393332876277"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                Scrivici su WhatsApp
              </a>
            </div>
          </div>

          {/* Le informazioni che servono a chi invece vuole passare di persona.
              Sono qui e non solo nel piede perche' meta' dei clienti di una
              tipografia di paese arriva in negozio, non via modulo. */}
          <div className="border-t border-white/15 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="occhiello mb-5 text-white/55">Oppure passa in negozio</div>
            <a
              href="tel:+393332876277"
              className="font-display text-3xl text-white transition-opacity hover:opacity-70"
            >
              +39 333 287 6277
            </a>
            <div className="mt-6 space-y-1 text-sm leading-relaxed text-white/60">
              <p>Via Martiri della Libertà, 65</p>
              <p>13046 Livorno Ferraris (VC)</p>
            </div>
            <div className="occhiello mt-6 leading-[1.9] text-white/55">
              Lun – Ven 8:30 – 18:00
              <br />
              Sabato su appuntamento
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
