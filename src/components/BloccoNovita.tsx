import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BordoVivo } from "@/components/BordoVivo";

/**
 * Il blocco "novità" della home, oggi la stampa DTF su abbigliamento.
 *
 * PRIMA ERA una scheda con il testo a sinistra e un riquadro 4:3 a destra dentro
 * cui stava il video. Non funzionava per due motivi:
 *   - il video di categoria e' scuro e per meta' inquadratura mostra il piano
 *     della pressa: dentro un riquadro piccolo restava mezzo rettangolo nero,
 *     cioe' spazio morto proprio dove doveva esserci l'effetto;
 *   - "◢ Novità · DTF" scritto in corpo 11 non dice a nessuno che e' una novita'.
 *
 * ORA il video e' lo sfondo di tutto il blocco e il testo ci sta sopra, come
 * nella testata. La novita' e' dichiarata da un'etichetta rossa con un punto che
 * pulsa, che si vede da lontano, e i tre punti di forza sono staccati dal
 * paragrafo cosi' si leggono anche solo scorrendo.
 */

/**
 * Versione dei file, che e' anche la cartella. Stessa regola dell'hero: i nomi
 * sono fissi, quindi un video nuovo va in una cartella nuova, altrimenti chi era
 * gia' passato sul sito continua a vedere il vecchio finche' non gli scade la
 * cache. In cambio /novita/* e' dichiarato immutabile in public/_headers.
 */
const VER = "v1";

const PUNTI = ["Colori brillanti", "Dettagli fotografici", "Resiste ai lavaggi"];

export function BloccoNovita({ onPreventivo }: { onPreventivo: () => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [animazioni, setAnimazioni] = useState(true);

  useEffect(() => {
    setAnimazioni(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Il video parte solo quando il blocco entra in vista e si ferma quando esce.
  // Sta sotto la piega: farlo girare da subito vorrebbe dire scaricarlo e
  // decodificarlo mentre l'utente sta ancora guardando la testata, che ha gia'
  // un video suo.
  useEffect(() => {
    const box = boxRef.current;
    const video = videoRef.current;
    if (!box || !video || !animazioni) return;

    const osservatore = new IntersectionObserver(
      ([voce]) => {
        if (voce.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    osservatore.observe(box);
    return () => osservatore.disconnect();
  }, [animazioni]);

  return (
    <section className="mt-20 lg:mt-28 mb-20 lg:mb-28">
      <div
        ref={boxRef}
        className="relative overflow-hidden rounded-2xl border border-white/15 min-h-[540px] lg:min-h-0 lg:aspect-[16/9]"
      >
        {/* Da tablet in su l'immagine viene ingrandita e spinta a destra: il
            soggetto (la stampa che appare) sta al centro dell'inquadratura, e
            senza questo finirebbe sotto al testo. Lo zoom non costa nitidezza,
            perche' anche ingrandito il video ha piu' pixel del riquadro. */}
        <img
          src={`/novita/${VER}/dtf.webp`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover lg:scale-[1.16] lg:translate-x-[8%]"
        />
        {animazioni && (
          <video
            ref={videoRef}
            src={`/novita/${VER}/dtf.mp4`}
            poster={`/novita/${VER}/dtf.webp`}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover lg:scale-[1.16] lg:translate-x-[8%]"
          />
        )}

        {/* Due velature diverse perche' il testo cambia posto: da tablet in su
            sta a sinistra, sul telefono in fondo. Scurire tutto uniformemente
            spegnerebbe i colori della stampa, che sono il soggetto. */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(to right, rgb(10,12,16) 0%, rgba(10,12,16,0.92) 30%, rgba(10,12,16,0.45) 56%, rgba(10,12,16,0.05) 80%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(to top, rgb(10,12,16) 0%, rgba(10,12,16,0.94) 34%, rgba(10,12,16,0.5) 58%, transparent 88%)",
          }}
        />

        {/* La luce che segue il mouse sta QUI e non piu' in alto: i livelli
            sono tutti posizionati e senza z-index, quindi l'ordine di disegno
            e' l'ordine del documento. Messa prima dell'immagine sarebbe finita
            sotto al video; messa dopo il testo gli sarebbe passata sopra. */}
        <BordoVivo />

        <div className="relative flex h-full flex-col justify-end lg:justify-center p-7 sm:p-10 lg:p-14 lg:max-w-[60%]">
          {/* L'etichetta e' la cosa che deve arrivare per prima: pastiglia
              rossa piena, non una scritta in mezzo al testo. Il punto che pulsa
              e' l'unica animazione decorativa della pagina, e serve a dire
              "questa e' roba nuova" senza scriverlo due volte. */}
          <div
            className="inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-2 font-mono-ui text-[10px] font-bold uppercase tracking-[0.25em] text-white"
            style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              {animazioni && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            Nuovo in tipografia
          </div>

          {/* Ombre sul testo: sul telefono il testo sta sopra al film
              trasparente, che e' la zona piu' chiara dell'inquadratura. Senza,
              l'occhiello spariva del tutto. */}
          <div
            className="mt-6 font-mono-ui text-[11px] uppercase tracking-[0.3em] text-white/70"
            style={{ textShadow: "0 1px 14px rgba(0,0,0,0.85)" }}
          >
            DTF · Direct-to-Film
          </div>

          <h2
            className="mt-3 font-display text-white text-[13vw] sm:text-6xl lg:text-7xl leading-[0.92] tracking-tight"
            style={{ textShadow: "0 2px 26px rgba(0,0,0,0.6)" }}
          >
            Stampa su
            <br />
            abbigliamento
          </h2>

          <p
            className="mt-5 max-w-lg text-white/80 text-base lg:text-lg leading-relaxed"
            style={{ textShadow: "0 1px 14px rgba(0,0,0,0.7)" }}
          >
            Portaci il tuo file e lo stampiamo su magliette, felpe, shopper e
            divise. Anche un pezzo solo.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {PUNTI.map((punto) => (
              <li
                key={punto}
                className="flex items-center gap-2.5 font-mono-ui text-[11px] uppercase tracking-[0.16em] text-white/70"
                style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }}
              >
                <span
                  className="h-1.5 w-1.5 rotate-45"
                  style={{ background: "var(--brand-red)" }}
                  aria-hidden="true"
                />
                {punto}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/categoria/$slug"
              params={{ slug: "abbigliamento-dtf" }}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-md px-7 py-4 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.03]"
              style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
            >
              Guarda i lavori
            </Link>
            <button
              type="button"
              onClick={onPreventivo}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-white/25 px-7 py-4 text-sm font-bold uppercase tracking-widest text-white/80 transition-colors hover:text-white hover:border-white/50"
            >
              Richiedi un preventivo
            </button>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{ background: "var(--brand-red)", opacity: 0.7 }}
        />
      </div>
    </section>
  );
}
