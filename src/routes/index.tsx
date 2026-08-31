import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, portfolioCategories } from "@/data/categories";
import { HeroCinematico } from "@/components/HeroCinematico";
import { BloccoNovita } from "@/components/BloccoNovita";
import { CatalogoFamiglie } from "@/components/CatalogoFamiglie";
import { Recensioni } from "@/components/Recensioni";
import { famiglie } from "@/data/famiglie";
import { usePreventivo } from "@/lib/preventivo";
import { useRivela } from "@/lib/rivela";

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
  const chiusura = useRivela<HTMLElement>(0.15);

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
              className="group relative aspect-[16/10] overflow-hidden rounded-sm border border-white/10 transition-[translate,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-white/25"
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
                <div className="occhiello mt-3 flex items-center gap-2 text-white/55 transition-colors duration-500 group-hover:text-white/80">
                  {c.events.length} tipologie di eventi
                  <span
                    className="inline-block opacity-0 transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    →
                  </span>
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
          e' un salto nel buio.

          E' l'unico blocco della home che si monta sotto gli occhi invece di
          essere gia' finito quando ci arrivi. Non e' un vezzo: dopo tre
          schermate di catalogo l'occhio scorre in automatico, e qualcosa che
          si muove appena e' il modo piu' economico di dire "fermati qui, e'
          questo il punto". Tutto parte da un solo osservatore (`useRivela`)
          sulla sezione: i pezzi dentro entrano a scaglioni con il loro
          ritardo. */}
      <section
        ref={chiusura.ref}
        className={`mt-20 pt-14 pb-20 lg:mt-28 lg:pt-20 lg:pb-28 ${
          chiusura.visibile ? "rivela-attiva" : ""
        }`}
      >
        {/* Al posto del solito filetto grigio, i quattro inchiostri di
            processo che si stendono uno dopo l'altro: e' la barra di registro
            che si stampa a bordo foglio, ed e' la stessa mappa di colori con
            cui e' diviso il catalogo qui sopra. Chiude la pagina con la firma
            del mestiere invece che con una riga di contorno. */}
        <div className="mb-10 flex gap-1 lg:mb-14" aria-hidden="true">
          {famiglie.map((f, i) => (
            <span
              key={f.slug}
              className="filetto-processo h-[3px] flex-1"
              style={{ background: f.colore, transitionDelay: `${i * 110}ms` }}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
          <div>
            <div className="occhiello rivela mb-5 text-white/55" style={{ transitionDelay: "220ms" }}>
              Il prossimo passo
            </div>

            {/* Le due righe salgono da dietro una maschera, una dopo l'altra,
                come esce un foglio dalla macchina. E' il gesto piu' letterale
                che questa pagina potesse fare, ed e' l'unico posto in cui si
                usa. */}
            <h2 className="font-display text-5xl leading-[0.95] text-white lg:text-6xl">
              <span className="riga-maschera">
                <span style={{ transitionDelay: "300ms" }}>Dicci cosa ti serve.</span>
              </span>
              <span className="riga-maschera">
                <span style={{ transitionDelay: "420ms" }}>Al resto pensiamo noi.</span>
              </span>
            </h2>

            <p
              className="rivela mt-5 max-w-lg text-base leading-relaxed text-white/65"
              style={{ transitionDelay: "560ms" }}
            >
              Mandaci il file, o anche solo un&apos;idea e una quantità. Ti
              rispondiamo con prezzo, tempi e le opzioni di stampa che
              consigliamo — di solito in giornata.
            </p>

            <div
              className="rivela mt-8 flex flex-wrap gap-3"
              style={{ transitionDelay: "680ms" }}
            >
              {/* Niente ingrandimento all'hover: il pulsante resta fermo e ci
                  passa sopra una mano d'inchiostro piu' scuro, da sinistra
                  verso destra. Un bottone che cresce sotto il dito e' un
                  gesto da app; questo e' un gesto da stampa. */}
              <button
                type="button"
                onClick={() => apriPreventivo()}
                className="pulsante-inchiostro group flex items-center gap-3 rounded-sm px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white"
                style={{ background: "var(--brand-red)" }}
              >
                Richiedi un preventivo
                <span
                  className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5"
                  aria-hidden="true"
                >
                  →
                </span>
              </button>
              <a
                href="https://wa.me/393332876277"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-sm border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                Scrivici su WhatsApp
                <span
                  className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Le informazioni che servono a chi invece vuole passare di persona.
              Sono qui e non solo nel piede perche' meta' dei clienti di una
              tipografia di paese arriva in negozio, non via modulo. */}
          <div
            className="rivela border-t border-white/15 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
            style={{ transitionDelay: "800ms" }}
          >
            <div className="occhiello mb-5 text-white/55">Oppure passa in negozio</div>
            <a
              href="tel:+393332876277"
              className="flex min-h-11 items-center font-display text-3xl text-white transition-opacity hover:opacity-70"
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
