import { createFileRoute, Link } from "@tanstack/react-router";
import { ComeRaggiungerci } from "@/components/ComeRaggiungerci";
import { Recensioni } from "@/components/Recensioni";
import { usePreventivo } from "@/lib/preventivo";

export const Route = createFileRoute("/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo — Tipografia Nuova Stampa" },
      {
        name: "description",
        content:
          "Dal 1995 trasformiamo idee in stampa. Scopri chi siamo, cosa facciamo e il nostro approccio al lavoro.",
      },
    ],
    links: [{ rel: "canonical", href: "https://tipografianuovastampa.com/chi-siamo" }],
  }),
  component: ChiSiamoPage,
});

/**
 * Chi siamo.
 *
 * Il testo e' lo stesso che c'era, riordinato e sfoltito dalle ripetizioni: la
 * versione precedente diceva tre volte, con parole diverse, che si cura il
 * dettaglio. I fatti — 1995, gestione dal 2024, il titolare che segue ogni
 * lavoro — sono tutti qui, ma adesso stanno in cima e si leggono in due secondi,
 * invece di essere sepolti al terzo paragrafo.
 */
function ChiSiamoPage() {
  const apriPreventivo = usePreventivo();

  return (
    <div className="px-6 pb-24 sm:px-10 lg:px-16">
      <section className="border-b border-white/15 pb-14 pt-10 lg:pb-20 lg:pt-14">
        <nav className="occhiello mb-10 text-white/55">
          <Link
            to="/"
            className="-mx-2 inline-flex min-h-11 items-center px-2 transition-colors hover:text-white lg:mx-0 lg:min-h-0 lg:px-0"
          >
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-white/60">Chi siamo</span>
        </nav>

        <h1 className="max-w-4xl font-display text-[10vw] leading-[0.95] tracking-[-0.03em] text-white sm:text-[7vw] lg:text-[4.6vw]">
          Una tipografia con dentro
          <br className="hidden sm:block" /> una persona sola che risponde.
        </h1>

        {/* I fatti in alto, in colonne, come i dati di una scheda. Chi vuole
            sapere "da quanto ci sono e chi ci lavora" non deve leggere sei
            paragrafi per scoprirlo. */}
        <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/15 pt-8 lg:grid-cols-4">
          {[
            { t: "Fondata nel", v: "1995" },
            { t: "Nuova gestione dal", v: "2024" },
            { t: "Dove", v: "Livorno Ferraris" },
            { t: "Chi ti risponde", v: "Stefano" },
          ].map((f) => (
            <div key={f.t}>
              <dt className="occhiello mb-3 text-white/55">{f.t}</dt>
              <dd className="font-display text-2xl text-white lg:text-3xl">{f.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid grid-cols-1 gap-12 border-b border-white/15 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
        <div className="space-y-6 text-[17px] leading-relaxed text-white/75 lg:col-span-7">
          <p>
            La tipografia nasce nel <strong className="font-medium text-white">1995</strong>.
            Dal <strong className="font-medium text-white">2024</strong> è in gestione a
            Stefano Giunipero, che ne ha rivisto approccio, servizi e macchinari.
          </p>
          <p>
            Lavoriamo con aziende, locali, brand ed eventi, seguendo il cliente dalla
            grafica al prodotto finito. Dalla tiratura da dieci pezzi alla produzione
            personalizzata.
          </p>
          <p>
            Negli anni si sono aggiunti stampa digitale professionale, grande formato,
            packaging, gadget, incisione laser e stampa su abbigliamento. Non perché
            fosse di moda: perché stampare bene, oggi, spesso non basta — serve aiutare
            chi ci porta un file a farsi riconoscere.
          </p>
          <p>
            Nessuna lavorazione automatica e nessun call center: il titolare segue ogni
            progetto di persona, e quando chiami risponde lui.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="occhiello mb-6 text-white/55">Cosa facciamo</div>
          <ul className="space-y-0">
            {[
              "Stampa digitale professionale",
              "Grande formato e banner",
              "Packaging ed etichette personalizzate",
              "Brochure, volantini e materiale promozionale",
              "Gadget e merchandising",
              "Incisione e personalizzazione laser",
              "Stampa su abbigliamento (DTF)",
              "Supporto grafico e creativo",
            ].map((v) => (
              <li
                key={v}
                className="border-t border-white/10 py-3.5 text-[15px] text-white/80 last:border-b"
              >
                {v}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="border-b border-white/15">
        <Recensioni titolo="Cosa dicono i clienti" />
      </div>

      <ComeRaggiungerci />

      <section className="border-t border-white/15 pt-14 lg:pt-20">
        <h2 className="font-display text-4xl leading-[0.98] text-white lg:text-5xl">
          Hai un lavoro da farci vedere?
        </h2>
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
            href="tel:+393332876277"
            className="rounded-sm border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white/80 transition-colors hover:border-white/50 hover:text-white"
          >
            +39 333 287 6277
          </a>
        </div>
      </section>
    </div>
  );
}
