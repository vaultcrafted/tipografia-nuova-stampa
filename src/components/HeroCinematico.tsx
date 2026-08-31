import { useEffect, useState } from "react";

/**
 * Testata della home: video a tutto schermo che scorre da solo, in loop.
 *
 * Prima questo hero legava l'avanzamento del video allo scroll. Era una bella
 * idea sulla carta e una brutta cosa da guardare: la clip aveva un movimento
 * lento, e chi non scorreva vedeva un'immagine ferma. Il video adesso va per
 * conto suo, sempre, dal primo istante.
 *
 * Il file e' un montaggio di tre inquadrature con dissolvenze incrociate (vedi
 * scripts/hero-encode.sh), che apre e chiude sul nero: cosi' il punto in cui il
 * loop riparte non si vede.
 *
 * Due file, uno per formato: su telefono si scarica una versione piu' piccola,
 * perche' l'hero parte da solo e sarebbe scortese far pagare 1,7 MB di traffico
 * a chi e' in giro. Il video non viene montato finche' non si sa quale serve,
 * cosi' nessuno scarica quello sbagliato.
 */

/** Altezza dell'header sticky: il video parte da sotto, non gli finisce dietro. */
const HEADER_PX = 73;

export function HeroCinematico() {
  /** null = non ancora deciso, quindi niente video: si vede solo il poster. */
  const [grande, setGrande] = useState<boolean | null>(null);
  const [animazioni, setAnimazioni] = useState(true);

  useEffect(() => {
    setGrande(window.matchMedia("(min-width: 768px)").matches);
    setAnimazioni(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <section
      className="relative -mx-6 sm:-mx-10 lg:-mx-16 overflow-hidden"
      style={{ height: `calc(100svh - ${HEADER_PX}px)`, minHeight: 520 }}
    >
      {/* Il soffitto quasi nero delle sorgenti e' gia' tagliato nel file.
          `object-position` sotto il centro tiene la macchina in campo anche sugli
          schermi stretti, dove il ritaglio e' molto piu' aggressivo. */}
      <img
        src="/media/_hero/hero.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 55%" }}
      />

      {/* Con prefers-reduced-motion resta solo il poster: un video che parte da
          solo e' esattamente cio' che quell'impostazione chiede di non fare. */}
      {grande !== null && animazioni && (
        <video
          src={grande ? "/media/_hero/hero.mp4" : "/media/_hero/hero-small.mp4"}
          poster="/media/_hero/hero.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 55%" }}
        />
      )}

      {/* Velatura leggera e uniforme, piu' una sfumatura che scurisce il terzo
          basso, dove atterra il titolo. Tenute leggere apposta: l'immagine e'
          gia' scura di suo, e caricarle spegne i rossi della macchina. */}
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 26%, rgba(0,0,0,0.1) 60%, transparent 100%)",
        }}
      />

      {/* pb-40 sul telefono: sotto c'e' il pulsante WhatsApp fisso, e senza
          questo spazio finisce sopra l'ultima riga di testo. */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-40 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
        <div className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-white/50 mb-6">
          ◢ Stampa tipografica · Livorno Ferraris (VC)
        </div>

        <h1 className="font-display text-white text-[17vw] sm:text-[13vw] lg:text-[9vw] leading-[0.86] tracking-tight">
          Diamo forma
          <br />
          alle tue{" "}
          <span style={{ color: "var(--brand-red)" }} className="text-glow-red">
            idee
          </span>
        </h1>

        <p className="mt-7 max-w-md text-white/70 text-base leading-relaxed">
          Stampa professionale per chi non scende a compromessi. Offset,
          digitale, DTF, grande formato e finiture artigianali — tutto sotto lo
          stesso tetto.
        </p>
      </div>

      {/* Filo rosso a chiudere l'hero e legarlo al resto della pagina. */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "var(--brand-red)", opacity: 0.6 }}
      />
    </section>
  );
}
