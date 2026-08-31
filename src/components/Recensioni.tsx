import { Star, ExternalLink, PenLine } from "lucide-react";
import {
  recensioni,
  VALUTAZIONE,
  URL_RECENSIONI,
  URL_SCRIVI_RECENSIONE,
} from "@/data/recensioni";

/**
 * Recensioni Google citate a mano (vedi src/data/recensioni.ts).
 *
 * Niente markup strutturato AggregateRating: Google non ammette i dati
 * strutturati di recensione "auto-referenziali", cioe' quelli in cui l'attivita'
 * pubblica sul proprio sito le valutazioni su se stessa. Metterli rischia
 * un'azione manuale invece delle stelline nei risultati.
 *
 * Le stelle compaiono una volta sola, sul totale verificato dal profilo.
 * Le singole recensioni non le hanno: il voto di ognuna non si legge
 * dall'elenco pubblico, e darlo per scontato sarebbe inventare un dato.
 */
function Stelle({ media }: { media: number }) {
  const piene = Math.round(media);
  return (
    <span
      className="inline-flex gap-0.5"
      aria-label={`${media.toFixed(1).replace(".", ",")} stelle su 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-4 w-4"
          aria-hidden="true"
          style={{
            fill: i <= piene ? "var(--brand-red)" : "transparent",
            color: i <= piene ? "var(--brand-red)" : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </span>
  );
}

export function Recensioni({ titolo = "Cosa dicono i clienti" }: { titolo?: string }) {
  // Finche' non ci sono recensioni vere non si mostra niente: meglio una
  // sezione assente che una sezione finta.
  if (recensioni.length === 0) return null;

  return (
    <section className="mt-16 lg:mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/55 mb-3">
            ◆ Recensioni Google
          </div>
          <h2 className="font-display text-3xl lg:text-4xl text-white leading-tight">{titolo}</h2>
          <div className="mt-3 flex items-center gap-3">
            <Stelle media={VALUTAZIONE.media} />
            <span className="font-mono-ui text-[11px] tabular-nums text-white/50">
              {VALUTAZIONE.media.toFixed(1).replace(".", ",")} · {VALUTAZIONE.quante} recensioni su
              Google
            </span>
          </div>
        </div>

        <a
          href={URL_RECENSIONI}
          target="_blank"
          rel="noopener noreferrer"
          className="occhiello -mx-2 inline-flex min-h-11 items-center gap-2 px-2 text-white/50 transition-colors hover:text-white"
        >
          Leggi tutte su Google
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recensioni.map((r) => (
          <figure
            key={`${r.autore}-${r.quando}`}
            className="flex flex-col gap-4 rounded-lg border border-white/10 bg-card/40 backdrop-blur-sm p-5 transition-colors hover:border-white/20"
          >
            <blockquote className="text-sm leading-relaxed text-white/75 flex-1">
              {r.testo}
            </blockquote>
            <figcaption className="flex items-baseline justify-between gap-3 border-t border-white/5 pt-3">
              <span className="text-sm text-white/90">{r.autore}</span>
              <span className="font-mono-ui text-[10px] uppercase tracking-widest text-white/55">
                {r.quando}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={URL_SCRIVI_RECENSIONE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-widest text-white/70 transition-colors hover:text-white hover:border-white/40"
        >
          <PenLine className="h-4 w-4" aria-hidden="true" />
          Lascia una recensione
        </a>
        <p className="font-mono-ui text-[12px] leading-relaxed tracking-wide text-white/55 normal-case sm:text-[11px]">
          Il pulsante apre la scheda Google: la recensione resta pubblica sul
          nostro profilo, come tutte le altre.
        </p>
      </div>
    </section>
  );
}
