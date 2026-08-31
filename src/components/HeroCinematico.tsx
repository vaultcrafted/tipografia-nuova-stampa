import { useEffect, useRef, useState } from "react";

/**
 * Hero a tutto schermo con il video che avanza mentre si scorre.
 *
 * COME FUNZIONA
 * La sezione e' alta ALTEZZA_VH viewport, ma dentro c'e' un blocco `sticky` alto
 * quanto lo schermo: finche' si scorre dentro la sezione il blocco resta fermo e
 * si muove solo il video. Lo scroll "consumato" e' quindi ALTEZZA_VH - 100 =
 * 70vh, meno di una schermata: poi il catalogo parte subito.
 *
 * PERCHE' NON SEMPRE
 * Spostare a mano `currentTime` e' fluido solo se il file ha un keyframe per
 * fotogramma (vedi scripts/hero-encode.sh) e se il browser fa seek veloce. Su
 * iOS il seek programmato e' impreciso e scatta, e con `prefers-reduced-motion`
 * sarebbe proprio sbagliato. In quei casi parte il loop normale e la sezione
 * torna alta una schermata: si perde l'effetto, non la pagina.
 *
 * I due file sono diversi apposta: hero.mp4 e' all-intra e pesa 2,1 MB perche'
 * deve essere seekabile; hero-loop.mp4 e' compresso normale e pesa 220 KB. Il
 * video non viene montato finche' non si sa quale dei due serve, cosi' nessuno
 * scarica il file che non usera'.
 */

/** Altezza totale della sezione. 170 = 70vh di scroll consumato dall'hero. */
const ALTEZZA_VH = 170;

/** Altezza dell'header sticky: il video parte da sotto, non gli finisce dietro. */
const HEADER_PX = 73;

/** Quanto il video insegue lo scroll: piu' basso = piu' morbido ma piu' in ritardo. */
const INSEGUIMENTO = 0.12;

export function HeroCinematico() {
  const sezioneRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  /** null = non ancora deciso, quindi niente video: si vede solo il poster. */
  const [scrub, setScrub] = useState<boolean | null>(null);
  const [avanzamento, setAvanzamento] = useState(0);

  useEffect(() => {
    setScrub(
      window.matchMedia("(min-width: 1024px)").matches &&
        window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  // Lega la posizione nel video allo scroll. Un solo rAF sempre in volo, con la
  // posizione inseguita da un lerp: assegnare `currentTime` secco a ogni evento
  // di scroll fa vedere gli scatti del seek.
  useEffect(() => {
    if (!scrub) return;
    const sezione = sezioneRef.current;
    const video = videoRef.current;
    if (!sezione || !video) return;

    let rafId = 0;
    let attuale = 0;
    let vivo = true;

    const misura = () => {
      const rect = sezione.getBoundingClientRect();
      const corsa = rect.height - window.innerHeight;
      if (corsa <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / corsa));
    };

    const tick = () => {
      if (!vivo) return;
      const obiettivo = misura();
      attuale += (obiettivo - attuale) * INSEGUIMENTO;
      setAvanzamento(obiettivo);

      const durata = video.duration;
      if (durata && Number.isFinite(durata)) {
        // Ci si ferma un filo prima della fine: l'ultimo fotogramma di certi
        // mp4 non e' raggiungibile in seek e il video sfarfalla sul nero.
        const t = attuale * (durata - 0.05);
        if (Math.abs(video.currentTime - t) > 0.01) video.currentTime = t;
      }
      rafId = requestAnimationFrame(tick);
    };

    video.pause();
    rafId = requestAnimationFrame(tick);
    return () => {
      vivo = false;
      cancelAnimationFrame(rafId);
    };
  }, [scrub]);

  // Il titolo resta pieno per meta' hero e sfuma solo nell'ultimo tratto: se
  // inizia a sparire subito, chi scorre piano lo vede gia' mezzo trasparente e
  // sembra un difetto invece di un'uscita voluta.
  const uscita = Math.min(1, Math.max(0, (avanzamento - 0.5) / 0.45));

  // Zoom lentissimo legato allo scroll. La carrellata del video da sola e'
  // troppo discreta per leggersi: questo la amplifica senza aggiungere peso.
  const zoom = 1 + avanzamento * 0.12;

  return (
    <section
      ref={sezioneRef}
      className="relative -mx-6 sm:-mx-10 lg:-mx-16"
      style={{ height: scrub ? `${ALTEZZA_VH}vh` : undefined }}
    >
      <div
        className="sticky overflow-hidden"
        style={{ top: HEADER_PX, height: `calc(100svh - ${HEADER_PX}px)` }}
      >
        {/* Il soffitto quasi nero e' gia' tagliato nel file (hero-encode.sh):
            farlo qui, zoomando, avrebbe voluto dire ingrandire un 720p e
            perdere nitidezza. `object-position` sotto il centro tiene comunque
            i rulli in campo sugli schermi stretti. */}
        <img
          src="/media/_hero/hero.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 60%" }}
        />

        {scrub !== null && (
          <video
            ref={videoRef}
            src={scrub ? "/media/_hero/hero.mp4" : "/media/_hero/hero-loop.mp4"}
            poster="/media/_hero/hero.webp"
            muted
            playsInline
            preload="auto"
            autoPlay={!scrub}
            loop={!scrub}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: "50% 60%",
              transform: `scale(${zoom})`,
              transformOrigin: "50% 70%",
            }}
          />
        )}

        {/* Velatura leggera e uniforme, piu' una sfumatura che scurisce solo il
            terzo basso, dove atterra il titolo. Prima erano molto piu' pesanti e
            spegnevano i rossi dei rulli, che sono il motivo per cui il video e'
            questo. */}
        <div className="absolute inset-0 bg-black/25" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 28%, rgba(0,0,0,0.1) 62%, transparent 100%)",
          }}
        />

        {/* pb-28 sul telefono: sotto c'e' il pulsante WhatsApp fisso, e senza
            questo spazio finisce sopra l'ultima riga di testo. */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-40 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
          <div
            style={{
              transform: `translateY(${uscita * -40}px)`,
              opacity: 1 - uscita * 0.85,
            }}
          >
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
              digitale, DTF, grande formato e finiture artigianali — tutto sotto
              lo stesso tetto.
            </p>
          </div>
        </div>

        {/* Invito a scorrere: sparisce appena si e' capito che c'e' da scorrere.
            Centrato e non a destra, dove c'e' il pulsante WhatsApp fisso. */}
        {scrub && (
          <div
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40"
            style={{ opacity: 1 - Math.min(1, avanzamento / 0.15) }}
          >
            Scorri
            <span className="relative block h-8 w-px bg-white/20">
              <span
                className="absolute inset-x-0 top-0 h-3 animate-pulse"
                style={{ background: "var(--brand-red)" }}
              />
            </span>
          </div>
        )}

        {/* Filo rosso a chiudere l'hero e legarlo al resto della pagina. */}
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: "var(--brand-red)", opacity: 0.6 }}
        />
      </div>
    </section>
  );
}
