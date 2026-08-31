import { useEffect, useRef, useState } from "react";

/**
 * Testata della home: video a tutto schermo, in loop, che lo scroll accelera.
 *
 * COME FUNZIONA
 * La sezione e' alta ALTEZZA_VH viewport, ma dentro c'e' un blocco `sticky` alto
 * quanto lo schermo: finche' si scorre dentro la sezione l'hero resta fermo e si
 * muove solo il video. Lo scroll trattenuto e' ALTEZZA_VH - 100 = 55vh, cioe'
 * mezza schermata: poi il catalogo parte subito.
 *
 * Mentre si scorre il video CORRE — fino a VELOCITA_MAX volte la sua velocita' —
 * e appena ci si ferma rallenta da solo fino a tornare normale.
 *
 * PERCHE' COSI' E NON SPOSTANDO IL FOTOGRAMMA
 * Una versione precedente legava la posizione esatta nel video allo scroll
 * (`currentTime = avanzamento * durata`). Aveva due difetti gravi:
 *
 *   1. fermo lo scroll, fermo il video. Chi arriva sulla home e guarda senza
 *      scorrere — il primo istante, quello che conta — vedeva un'immagine ferma.
 *      E' esattamente la critica che si e' presa.
 *   2. per spostare il fotogramma senza scatti serve un file con un keyframe per
 *      ogni fotogramma: qui vorrebbe dire quasi 5 MB invece di 1,3, e su iOS il
 *      seek programmato scatta lo stesso.
 *
 * Agire sulla VELOCITA' invece che sulla posizione risolve entrambi: il video
 * non si ferma mai, non c'e' nessun seek da fare (quindi nessuno scatto, su
 * nessun dispositivo) e il file resta quello leggero.
 *
 * Il video e' un montaggio di tre inquadrature con dissolvenze incrociate (vedi
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

/** Altezza totale della sezione. 155 = 55vh di scroll trattenuto dall'hero. */
const ALTEZZA_VH = 155;

/**
 * Quanto puo' correre il video al massimo. Oltre 4x le dissolvenze del montaggio
 * passano cosi' in fretta da sembrare stacchi sbagliati, e certi browser
 * cominciano a saltare fotogrammi.
 */
const VELOCITA_MAX = 4;

/** Quanti "x" di velocita' vale un pixel di scroll. Tarato a occhio. */
const SPINTA = 0.35;

/** Quanto in fretta si torna a velocita' normale: piu' basso = piu' morbido. */
const RIENTRO = 0.06;

export function HeroCinematico() {
  const sezioneRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  /** null = non ancora deciso, quindi niente video: si vede solo il poster. */
  const [grande, setGrande] = useState<boolean | null>(null);
  const [animazioni, setAnimazioni] = useState(true);
  const [avanzamento, setAvanzamento] = useState(0);

  useEffect(() => {
    setGrande(window.matchMedia("(min-width: 768px)").matches);
    setAnimazioni(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Lo scroll spinge la velocita' del video, che rientra da sola quando ci si
  // ferma. Un solo rAF sempre in volo; il listener di scroll fa solo una
  // sottrazione ed e' `passive`, cosi' non rallenta lo scorrimento.
  useEffect(() => {
    const video = videoRef.current;
    const sezione = sezioneRef.current;
    if (!video || !sezione || !animazioni) return;

    let rafId = 0;
    let vivo = true;
    let ultimoY = window.scrollY;
    let velocita = 1;
    let inVista = true;

    // Fuori dallo schermo il video va in pausa: continuare a decodificare un
    // video che nessuno sta guardando e' batteria buttata.
    const osservatore = new IntersectionObserver(
      ([voce]) => {
        inVista = voce.isIntersecting;
        if (inVista) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0 },
    );
    osservatore.observe(sezione);

    const onScroll = () => {
      const y = window.scrollY;
      const salto = Math.abs(y - ultimoY);
      ultimoY = y;
      velocita = Math.min(VELOCITA_MAX, Math.max(velocita, 1 + salto * SPINTA));

      const rect = sezione.getBoundingClientRect();
      const corsa = rect.height - window.innerHeight;
      setAvanzamento(corsa > 0 ? Math.min(1, Math.max(0, -rect.top / corsa)) : 0);
    };

    const tick = () => {
      if (!vivo) return;
      velocita += (1 - velocita) * RIENTRO;
      if (inVista && Math.abs(video.playbackRate - velocita) > 0.02) {
        // Un playbackRate fuori scala fa lanciare un'eccezione a certi browser
        // invece di venire semplicemente ignorato.
        try {
          video.playbackRate = Math.min(VELOCITA_MAX, Math.max(1, velocita));
        } catch {
          /* il video prosegue alla velocita' che aveva: nessun danno */
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      vivo = false;
      osservatore.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [animazioni, grande]);

  // Il titolo resta pieno per meta' del tratto trattenuto e sfuma solo alla
  // fine: se iniziasse subito, chi scorre piano lo vedrebbe gia' mezzo
  // trasparente e sembrerebbe un difetto invece di un'uscita voluta.
  const uscita = Math.min(1, Math.max(0, (avanzamento - 0.5) / 0.45));

  return (
    <section
      ref={sezioneRef}
      className="relative -mx-6 sm:-mx-10 lg:-mx-16"
      style={{ height: animazioni ? `${ALTEZZA_VH}vh` : undefined }}
    >
      <div
        className="sticky overflow-hidden"
        style={{ top: HEADER_PX, height: `calc(100svh - ${HEADER_PX}px)`, minHeight: 520 }}
      >
        <img
          src={`/hero/${VER}/hero.webp`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Con prefers-reduced-motion resta solo il poster: un video che parte
            da solo e' esattamente cio' che quell'impostazione chiede di non
            fare, e la sezione torna alta una schermata. */}
        {grande !== null && animazioni && (
          <video
            ref={videoRef}
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
            motivo: sotto l'hero la pagina e' scura, e cosi' l'una sfuma
            nell'altra invece di tagliare di netto.
            Misurata sul sito vero: dietro al paragrafo la luminanza e' 19 su
            255, a qualunque punto del video e dello scroll. */}
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
            style={{
              transform: `translateY(${uscita * -36}px)`,
              // Fino a zero, non a 0.1: un titolo al 10% resta un fantasma
              // sullo schermo e sembra un errore di rendering.
              opacity: 1 - uscita,
            }}
          >
            <div
              className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-white/60 mb-6"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}
            >
              ◢ Stampa tipografica · Livorno Ferraris (VC)
            </div>

            {/* Ombra morbida sul testo: la sfumatura basta quasi sempre, ma il
                video cambia inquadratura tre volte e in una di queste sotto al
                titolo puo' capitare una zona chiara. E' l'assicurazione. */}
            {/* La scala e' molto piu' bassa di prima perche' il carattere e'
                cambiato: la condensata precedente stava in 9vw, la Jost e'
                geometrica e larga e alla stessa misura sbordava dallo schermo.
                Cambiare carattere vuol dire rifare la scala, non solo la
                famiglia. */}
            <h1
              className="font-display text-white text-[12.5vw] sm:text-[9vw] lg:text-[6.2vw] leading-[0.92] tracking-[-0.03em]"
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
              digitale, DTF, grande formato e finiture artigianali — tutto sotto
              lo stesso tetto.
            </p>
          </div>
        </div>

        {/* Filo rosso a chiudere l'hero e legarlo al resto della pagina. */}
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: "var(--brand-red)", opacity: 0.6 }}
        />
      </div>
    </section>
  );
}
