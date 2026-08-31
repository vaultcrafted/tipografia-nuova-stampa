/**
 * Le versioni ridotte delle immagini di catalogo.
 *
 * IL PROBLEMA
 * Le foto sono tutte a 1600px, la piu' pesante 128 kB. Nella home entravano in
 * riquadri larghi 170px sul telefono: 830 kB scaricati per mostrarne una
 * frazione. Le misure ridotte le prepara `scripts/immagini-derivate.py` e stanno
 * accanto agli originali (`v.webp` → `v-320.webp`, `v-640.webp`).
 *
 * QUI si costruisce solo la stringa `srcset`, che dice al browser quali misure
 * esistono. Quale scegliere lo decide lui, sapendo larghezza dello schermo e
 * densita' dei pixel — cose che il server non sa e non deve indovinare.
 *
 * L'ORIGINALE RESTA L'ULTIMO GRADINO. Serve al lightbox e agli schermi molto
 * grandi: togliere del tutto la piena risoluzione farebbe risparmiare qualche
 * kB e peggiorare l'unico momento in cui l'immagine si guarda davvero.
 *
 * SE UNA DERIVATA MANCA il browser scarica il gradino piu' grande disponibile:
 * un file assente non rompe la pagina, la rende solo piu' pesante. Per questo
 * non c'e' nessun controllo di esistenza a runtime.
 */

/** Misure vere dei file originali. Non sono indovinate: le hanno tutti. */
const VERTICALE = { larghezza: 1195, altezza: 1600 };
const ORIZZONTALE = { larghezza: 1600, altezza: 1195 };

const derivata = (src: string, w: number) => `${src.replace(/\.webp$/, "")}-${w}.webp`;

/**
 * Copertine di prodotto (`/media/<slug>/v.webp`), le verticali 1195x1600.
 * Compaiono nelle schede del catalogo e nel riquadro centrale della galleria.
 */
export function srcSetCopertina(src: string): string {
  return [
    `${derivata(src, 320)} 320w`,
    `${derivata(src, 480)} 480w`,
    `${derivata(src, 640)} 640w`,
    `${src} ${VERTICALE.larghezza}w`,
  ].join(", ");
}

/**
 * La copertina in misura media, per i posti dove `srcset` non si puo' usare:
 * l'attributo `poster` di un video ne accetta uno solo. Prima li' finiva
 * l'originale da 108 kB, scaricato per essere mostrato in un riquadro 16:9 e
 * sostituito dopo un secondo dal primo fotogramma del video.
 */
export function posterRidotto(src: string): string {
  return derivata(src, 640);
}

/** Le proporzioni della copertina, da mettere su `width`/`height`. */
export const misureCopertina = VERTICALE;

/**
 * Scatti della galleria (`a.webp`…`d.webp`), le orizzontali 1600x1195.
 */
export function srcSetScatto(src: string): string {
  return [
    `${derivata(src, 400)} 400w`,
    `${derivata(src, 800)} 800w`,
    `${src} ${ORIZZONTALE.larghezza}w`,
  ].join(", ");
}

export const misureScatto = ORIZZONTALE;

/**
 * Copertine del portfolio (`/media/fotografia/v.webp`, `/media/video/v.webp`).
 * Sono orizzontali come gli scatti, quindi hanno le stesse derivate e possono
 * usare `srcSetScatto`; cambia solo la forma del file, 16:10 invece di 4:3,
 * perche' il riquadro in home e' 16:10.
 */
export const misurePortfolio = { larghezza: 1600, altezza: 1000 };

/**
 * `sizes` per i due riquadri del portfolio in home: una colonna sul telefono,
 * due da 640px in su. Da 1024px c'e' anche il menu laterale largo 310px, che
 * toglie spazio: a 1440 il riquadro e' 493px, cioe' circa il 34% della
 * finestra.
 */
export const SIZES_PORTFOLIO =
  "(min-width: 1024px) 34vw, (min-width: 640px) 47vw, 92vw";

/**
 * `sizes` per la scheda del catalogo in home e nelle voci "anche in…".
 *
 * Ricavato dalla griglia vera, non a occhio: due colonne sotto i 640px, tre
 * sopra, e da 1024px in su c'e' anche la colonna di famiglia larga 240px e i
 * margini di pagina a 64px per lato. Un `sizes` sbagliato e' peggio che non
 * metterlo: il browser sceglie basandosi su questo numero, non sul risultato.
 */
export const SIZES_SCHEDA =
  "(min-width: 1024px) 28vw, (min-width: 640px) 30vw, 45vw";

/** `sizes` per i riquadri della galleria prodotto: griglia a tre colonne. */
export const SIZES_GALLERIA = "(min-width: 1024px) 32vw, (min-width: 640px) 30vw, 30vw";
