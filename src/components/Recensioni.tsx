import { Star, ExternalLink } from "lucide-react";
import { recensioni, mediaStelle, URL_RECENSIONI } from "@/data/recensioni";

/**
 * Recensioni Google citate a mano (vedi src/data/recensioni.ts).
 *
 * Niente markup strutturato AggregateRating: Google non ammette i dati
 * strutturati di recensione "auto-referenziali", cioe' quelli in cui l'attivita'
 * pubblica sul proprio sito le valutazioni su se stessa. Metterli rischia
 * un'azione manuale invece delle stelline nei risultati.
 */
function Stelle({ quante, classe = "h-3.5 w-3.5" }: { quante: number; classe?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${quante} stelle su 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={classe}
          aria-hidden="true"
          style={{
            fill: i <= quante ? "var(--brand-red)" : "transparent",
            color: i <= quante ? "var(--brand-red)" : "rgba(255,255,255,0.25)",
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

  const media = mediaStelle();

  return (
    <section className="mt-16 lg:mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
            ◆ Recensioni Google
          </div>
          <h2 className="font-display text-3xl lg:text-4xl text-white leading-tight">{titolo}</h2>
          {media !== null && (
            <div className="mt-3 flex items-center gap-3">
              <Stelle quante={Math.round(media)} classe="h-4 w-4" />
              <span className="font-mono-ui text-[11px] tabular-nums text-white/50">
                {media.toFixed(1).replace(".", ",")} · {recensioni.length}{" "}
                {recensioni.length === 1 ? "recensione" : "recensioni"}
              </span>
            </div>
          )}
        </div>

        <a
          href={URL_RECENSIONI}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono-ui text-[11px] uppercase tracking-widest text-white/50 hover:text-white transition-colors"
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
            <Stelle quante={r.stelle} />
            <blockquote className="text-sm leading-relaxed text-white/75 flex-1">
              {r.testo}
            </blockquote>
            <figcaption className="flex items-baseline justify-between gap-3 border-t border-white/5 pt-3">
              <span className="text-sm text-white/90">{r.autore}</span>
              <span className="font-mono-ui text-[10px] uppercase tracking-widest text-white/30">
                {r.quando}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
