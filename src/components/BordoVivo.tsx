import { useEffect, useRef } from "react";

/**
 * Una luce che segue il puntatore lungo il bordo del riquadro.
 *
 * COME SI USA
 * Si mette come primo figlio di un contenitore `relative` e con gli angoli
 * arrotondati. Non serve altro: si attacca da solo al genitore.
 *
 *     <div className="relative overflow-hidden rounded-2xl">
 *       <BordoVivo />
 *       ...
 *     </div>
 *
 * PERCHE' NON USA LO STATO DI REACT
 * Il puntatore manda decine di eventi al secondo. Farne uno `setState` vorrebbe
 * dire ridisegnare il componente decine di volte al secondo per cambiare due
 * numeri: qui invece le coordinate finiscono direttamente in due variabili CSS
 * (`--px`, `--py`) sui due livelli, e React non se ne accorge nemmeno. Il
 * disegno lo fa il compositore del browser, che e' il mestiere suo.
 *
 * UN SOLO DISEGNO PER FOTOGRAMMA
 * Gli eventi si limitano a segnare l'ultima posizione; a scriverla e' un
 * `requestAnimationFrame`, che il browser chiama una volta per fotogramma. Senza
 * questo, muovendo il mouse in fretta si farebbero tre o quattro scritture per
 * ogni cosa disegnata: lavoro buttato che si sente sui computer lenti.
 *
 * DOVE NON C'E'
 * - Telefoni e tablet: non esiste un puntatore da seguire, e un alone rosso
 *   addosso alla fotografia sarebbe solo sporco. Lo spegne il CSS con
 *   `(hover: none)`, cosi' la regola sta in un posto solo.
 * - Movimento ridotto: se il sistema chiede meno animazioni, questo e'
 *   esattamente il genere di cosa che chiede di togliere. Qui non si attacca
 *   nemmeno l'ascoltatore.
 */
export function BordoVivo() {
  const bordoRef = useRef<HTMLDivElement>(null);
  const aloneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bordo = bordoRef.current;
    const alone = aloneRef.current;
    const box = bordo?.parentElement;
    if (!bordo || !alone || !box) return;

    if (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia?.("(hover: none)").matches
    ) {
      return;
    }

    let rafId = 0;
    // Dove punta il mouse, e dove e' arrivata la luce. Sono due cose diverse:
    // e' la distanza fra loro a fare il "flusso".
    let mx = 0;
    let my = 0;
    let lx = 0;
    let ly = 0;
    let dentro = false;

    const scrivi = () => {
      const px = `${lx.toFixed(1)}px`;
      const py = `${ly.toFixed(1)}px`;
      bordo.style.setProperty("--px", px);
      bordo.style.setProperty("--py", py);
      alone.style.setProperty("--px", px);
      alone.style.setProperty("--py", py);
    };

    /**
     * IL RITARDO E' IL PUNTO. Se la luce sta incollata al puntatore sembra un
     * cursore colorato; se la insegue con un po' di ritardo — qui il 13% della
     * distanza che manca, a ogni fotogramma — si legge come qualcosa che
     * scorre lungo il bordo. E' una media esponenziale: veloce quando il mouse
     * scatta, lenta quando si avvicina, senza nessuna curva da tarare.
     *
     * Il ciclo si spegne da solo quando la luce e' arrivata (mezzo pixel) e il
     * mouse e' uscito: fuori dal riquadro non deve restare un
     * requestAnimationFrame acceso a non fare niente.
     */
    const passo = () => {
      lx += (mx - lx) * 0.13;
      ly += (my - ly) * 0.13;
      scrivi();
      const fermo = Math.abs(mx - lx) < 0.5 && Math.abs(my - ly) < 0.5;
      rafId = dentro || !fermo ? requestAnimationFrame(passo) : 0;
    };

    const muovi = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (!rafId) rafId = requestAnimationFrame(passo);
    };

    // Alla prima entrata la luce si posiziona di colpo sotto il mouse: senza,
    // comparirebbe dov'era rimasta l'ultima volta e attraverserebbe tutto il
    // riquadro per raggiungerlo, che si legge come un difetto.
    const entra = (e: PointerEvent) => {
      dentro = true;
      muovi(e);
      lx = mx;
      ly = my;
      scrivi();
      bordo.classList.add("bordo-vivo-acceso");
      alone.classList.add("bordo-vivo-acceso");
    };

    const esce = () => {
      dentro = false;
      bordo.classList.remove("bordo-vivo-acceso");
      alone.classList.remove("bordo-vivo-acceso");
    };

    box.addEventListener("pointerenter", entra);
    box.addEventListener("pointermove", muovi);
    box.addEventListener("pointerleave", esce);
    return () => {
      box.removeEventListener("pointerenter", entra);
      box.removeEventListener("pointermove", muovi);
      box.removeEventListener("pointerleave", esce);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={aloneRef} className="alone-vivo" aria-hidden="true" />
      <div ref={bordoRef} className="bordo-vivo" aria-hidden="true" />
    </>
  );
}
