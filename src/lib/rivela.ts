import { useEffect, useRef, useState } from "react";

/**
 * "Comparsa allo scorrimento": un elemento si accorge di essere entrato in
 * vista e si mostra.
 *
 * PERCHE' UN HOOK E NON UNA LIBRERIA
 * Serve una cosa sola — un IntersectionObserver che si spegne al primo scatto —
 * e vale una dozzina di righe. Una libreria di animazioni qui sarebbe 30 kB
 * scaricati prima che si veda il testo.
 *
 * SI MOSTRA UNA VOLTA SOLA. L'osservatore si disconnette al primo ingresso:
 * un blocco che si rianima ogni volta che ci passi sopra scorrendo su e giu'
 * diventa fastidioso dopo il secondo giro.
 *
 * MOVIMENTO RIDOTTO: se il sistema lo chiede, l'elemento e' visibile subito e
 * l'osservatore non parte nemmeno.
 *
 * SENZA JAVASCRIPT il testo resta comunque leggibile: il salvagente e' in CSS
 * (vedi `.rivela` in styles.css), un'animazione ritardata che rimette tutto a
 * vista da sola. Questo hook e' l'anticipo, non la condizione.
 */
export function useRivela<T extends HTMLElement>(soglia = 0.2) {
  const ref = useRef<T | null>(null);
  const [visibile, setVisibile] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisibile(true);
      return;
    }

    // Se il blocco e' gia' in vista al caricamento (schermi alti, ritorno
    // indietro dal browser) l'osservatore scatta subito da solo.
    const ob = new IntersectionObserver(
      (voci) => {
        if (voci.some((v) => v.isIntersecting)) {
          setVisibile(true);
          ob.disconnect();
        }
      },
      { threshold: soglia, rootMargin: "0px 0px -8% 0px" },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [soglia]);

  return { ref, visibile };
}
