// ─── Recensioni Google ────────────────────────────────────────────────────────
// REGOLA: qui vanno SOLO recensioni reali, copiate alla lettera dal profilo
// Google. Niente testi riscritti, accorciati a piacere o inventati: sono parole
// di clienti veri e devono restare le loro.
//
// L'unico intervento ammesso e' segnare con [...] un punto in cui il testo e'
// troncato, cosi' si vede che manca qualcosa.
//
// Lette dalla pagina pubblica di Maps il 31 agosto 2026. Le due segnate con
// [...] erano gia' troncate da Google nell'elenco: per completarle serve
// aprirle una per una sul profilo.
//
// Per aggiornarle: profilo Google -> Recensioni, copia nome, data e testo,
// aggiungi qui in cima. Poi build e deploy.

export type Recensione = {
  /** Nome come compare pubblicamente su Google. */
  autore: string;
  /** Come la mostra Google: "2 mesi fa", "un anno fa". */
  quando: string;
  /** Testo verbatim. [...] segna un punto in cui e' troncato. */
  testo: string;
};

/**
 * Valutazione complessiva, letta dal profilo il 31 agosto 2026.
 * Numeri verificati, non stime: vanno aggiornati quando cambiano.
 *
 * Le stelle si mostrano solo qui, sul totale. Non sulle singole recensioni:
 * il voto di ognuna non e' verificabile dall'elenco pubblico, e mettere cinque
 * stelle "perche' tanto la media e' 5" sarebbe inventarsi un dato.
 */
export const VALUTAZIONE = { media: 5.0, quante: 89 };

/**
 * Link al profilo Google, per "leggi tutte le recensioni".
 * Il CID e' ricavato dall'embed della mappa (0x331e6f5bd1a5530b), quindi punta
 * con certezza a questa attivita' e non a un omonimo.
 */
export const URL_RECENSIONI = "https://www.google.com/maps?cid=3683503985385624331";

/**
 * Link per scrivere una recensione. Da sostituire con quello corto ufficiale
 * (profilo -> Leggi recensioni -> Ottieni piu' recensioni -> Copia), che apre
 * direttamente la casella di scrittura invece della scheda.
 */
export const URL_SCRIVI_RECENSIONE = URL_RECENSIONI;

export const recensioni: Recensione[] = [
  {
    autore: "Lisa Casini",
    quando: "2 mesi fa",
    testo:
      "Assolutamente consigliato. Personale ottimo, qualità del materiale e dei servizi altissima. " +
      "Stefano è sempre disponibile, gentile e educato. I tempi di produzione iper rapidi ed efficaci. " +
      "Se avessi nuovamente bisogno, Stefano sarà nuovamente la mia prima scelta!!",
  },
  {
    autore: "Manuel Romano",
    quando: "2 mesi fa",
    testo:
      "Mi sono trovato davvero benissimo con Tipografia Nuova Stampa. Sono stato seguito passo dopo " +
      "passo dalla progettazione fino alla consegna, con tanta disponibilità e attenzione a ogni " +
      "dettaglio. Il prodotto finale è venuto esattamente come [...]",
  },
  {
    autore: "Sara Tammaro",
    quando: "2 mesi fa",
    testo:
      "Qualche mese fa ho affidato a questa tipografia un lavoro di stampa molto importante per la " +
      "partecipazione ad un concorso e il risultato ha superato di gran lunga le mie aspettative. [...]",
  },
];
