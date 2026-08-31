// ─── Recensioni Google ────────────────────────────────────────────────────────
// REGOLA: qui vanno SOLO recensioni reali, copiate alla lettera da quelle
// pubblicate sul profilo Google. Niente testi riscritti, accorciati o inventati:
// sono parole di clienti veri e devono restare le loro.
//
// L'unico intervento ammesso e' tagliare una recensione lunga, e in quel caso
// il taglio va segnato con [...] cosi' si vede che manca qualcosa.
//
// Per aggiornarle: profilo Google -> Recensioni, copia nome, stelle, data e
// testo, aggiungi qui in cima. Poi build e deploy.

export type Recensione = {
  /** Nome come compare pubblicamente su Google. */
  autore: string;
  /** Stelle assegnate, da 1 a 5. */
  stelle: 1 | 2 | 3 | 4 | 5;
  /** Come la mostra Google: "3 mesi fa", "un anno fa". */
  quando: string;
  /** Testo verbatim. */
  testo: string;
};

/**
 * Link al profilo Google, per "leggi tutte le recensioni".
 * Il CID e' ricavato dall'embed della mappa (0x331e6f5bd1a5530b), quindi punta
 * con certezza a questa attivita' e non a un omonimo.
 */
export const URL_RECENSIONI = "https://www.google.com/maps?cid=3683503985385624331";

export const recensioni: Recensione[] = [
  // In attesa dei testi reali dal profilo Google.
];

/** Media reale delle recensioni elencate qui — non un numero deciso a tavolino. */
export const mediaStelle = (): number | null => {
  if (recensioni.length === 0) return null;
  return recensioni.reduce((somma, r) => somma + r.stelle, 0) / recensioni.length;
};
