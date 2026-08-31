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
 * scripts/hero-encode.sh): il laboratorio, i biglietti da visita, l'abbigliamento
 * stampato. La coda si dissolve sulla testa, quindi il punto in cui il loop
 * riparte non esiste.
 *
 * Due file, uno per formato: su telefono si scarica una versione piu' piccola,
 * perche' l'hero parte da solo e sarebbe scortese far pagare 1,3 MB di traffico
 * a chi e' in giro. Il video non viene montato finche' non si sa quale serve,
 * cosi' nessuno scarica quello sbagliato.
 */

/** Altezza dell'header sticky: il video parte da sotto, non gli finisce dietro. */
const HEADER_PX = 73;

/**
 * Versione dei file dell'hero, che e' anche la cartella in cui stanno.
 *
 * ALZALA OGNI VOLTA che cambi il video, anche solo per rifare il montaggio.
 * I file hanno nome fisso (hero.mp4), e senza la cartella versionata chi era
 * gia' passato sul sito continuerebbe a vedere il video vecchio per un giorno
 * intero: e' successo il 31/08/2026, il cliente rispondeva "non e' cambiato
 * nulla" mentre il file nuovo era regolarmente online.
 *
 * In cambio, questi file sono dichiarati immutabili in public/_headers e non
 * vengono mai richiesti due volte.
 */
const VER = "v3";

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
      <img
        src={`/hero/${VER}/hero.webp`}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Con prefers-reduced-motion resta solo il poster: un video che parte da
          solo e' esattamente cio' che quell'impostazione chiede di non fare. */}
      {grande !== null && animazioni && (
        <video
          src={grande ? `/hero/${VER}/hero.mp4` : `/hero/${VER}/hero-small.mp4`}
          poster={`/hero/${VER}/hero.webp`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Il video e' chiaro e il titolo e' bianco: senza qualcosa sotto non si
          leggerebbe. Ma una velatura uniforme spegnerebbe proprio la luce per
          cui il video e' stato scelto, quindi si scurisce SOLO il basso, dove
          sta il testo, e si lascia intatta la parte alta.
          La sfumatura arriva al nero pieno in fondo anche per un secondo
          motivo: sotto l'hero la pagina e' scura, e cosi' l'una sfuma nell'altra
          invece di tagliare di netto. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgb(10,12,16) 0%, rgba(10,12,16,0.88) 16%, rgba(10,12,16,0.55) 34%, rgba(10,12,16,0.18) 54%, transparent 74%)",
        }}
      />

      {/* pb-40 sul telefono: sotto c'e' il pulsante WhatsApp fisso, e senza
          questo spazio finisce sopra l'ultima riga di testo. */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-40 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
        <div
          className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-white/60 mb-6"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}
        >
          ◢ Stampa tipografica · Livorno Ferraris (VC)
        </div>

        {/* Ombra morbida sul testo: la sfumatura basta quasi sempre, ma il video
            cambia inquadratura tre volte e in una di queste sotto al titolo puo'
            capitare una zona chiara. Questa e' l'assicurazione. */}
        <h1
          className="font-display text-white text-[17vw] sm:text-[13vw] lg:text-[9vw] leading-[0.86] tracking-tight"
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.5)" }}
        >
          Diamo forma
          <br />
          alle tue{" "}
          <span style={{ color: "var(--brand-red)" }} className="text-glow-red">
            idee
          </span>
        </h1>

        <p
          className="mt-7 max-w-md text-white/80 text-base leading-relaxed"
          style={{ textShadow: "0 1px 16px rgba(0,0,0,0.6)" }}
        >
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
