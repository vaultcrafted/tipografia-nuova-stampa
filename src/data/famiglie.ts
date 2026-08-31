/**
 * Le quattro famiglie del catalogo.
 *
 * PERCHE' ESISTONO
 * Le 18 categorie di prodotto erano una griglia piatta di 18 riquadri uguali.
 * Chi arrivava cercando i biglietti da visita trovava i biglietti da visita e
 * se ne andava: non scopriva ne' l'incisione laser ne' la stampa su
 * abbigliamento. Raggruppare serve a questo, non a fare ordine per il gusto
 * dell'ordine.
 *
 * PERCHE' I COLORI DI PROCESSO
 * Ciano, magenta, giallo e nero sono i quattro inchiostri con cui si stampa a
 * colori. Usarli come codice delle famiglie e' il modo in cui il mestiere
 * stesso classifica: e' un sistema vero, non una tavolozza scelta a caso, e
 * chi entra in tipografia lo riconosce. Compaiono solo come filetti sottili ed
 * etichette — mai come sfondi, altrimenti diventa un arcobaleno.
 *
 * COME SI AGGIUNGE UNA CATEGORIA
 * Si mette lo slug nell'array della famiglia giusta. Se non sta in nessuna
 * famiglia, `famigliaDi()` restituisce undefined e la categoria compare
 * comunque nel catalogo completo: una dimenticanza non fa sparire un prodotto.
 */

export type Famiglia = {
  slug: string;
  nome: string;
  /** Cosa ci si porta a casa. Una riga, in seconda persona. */
  promessa: string;
  /** Colore di processo, come variabile CSS gia' definita in styles.css. */
  colore: string;
  /** Sigla di processo, stampata accanto al nome. */
  sigla: string;
  /** Slug delle categorie, nell'ordine in cui vanno mostrate. */
  categorie: string[];
};

export const famiglie: Famiglia[] = [
  {
    slug: "carta",
    nome: "Carta e stampati",
    promessa: "Quello che si consegna a mano e resta sul tavolo.",
    colore: "var(--ciano)",
    sigla: "C",
    categorie: [
      "biglietti-da-visita",
      "volantini",
      "pieghevoli-brochure",
      "locandine-poster",
      "buste-carta-intestata",
      "libretti-pinzati",
      "libri-spirale",
    ],
  },
  {
    slug: "grande-formato",
    nome: "Grande formato e adesivi",
    promessa: "Quello che si vede da lontano.",
    colore: "var(--magenta)",
    sigla: "M",
    categorie: ["striscioni-banner", "sticker-adesivi"],
  },
  {
    slug: "personalizzazione",
    nome: "Personalizzazione",
    promessa: "Il tuo marchio su qualcosa che la gente porta con sé.",
    colore: "var(--giallo)",
    sigla: "Y",
    categorie: [
      "abbigliamento-dtf",
      "gadget-merchandising",
      "stampa-su-cuscini",
      "stampa-puzzle",
      "carte-di-vault",
    ],
  },
  {
    slug: "incisione-finiture",
    nome: "Incisione e finiture",
    promessa: "Quando il materiale non è carta, o non basta stampare.",
    colore: "var(--nero-processo)",
    sigla: "K",
    categorie: [
      "incisione-laser",
      "stampa-su-legno",
      "timbri-preinchiostrati",
      "plastificazione",
    ],
  },
];

/** La famiglia di una categoria, o undefined se non e' stata assegnata. */
export function famigliaDi(slug: string): Famiglia | undefined {
  return famiglie.find((f) => f.categorie.includes(slug));
}
