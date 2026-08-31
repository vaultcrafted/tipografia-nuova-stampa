import { createContext, useContext } from "react";
import type { Category } from "@/data/categories";

/**
 * Un solo modulo preventivo per tutto il sito.
 *
 * Prima ogni pagina che aveva un pulsante "richiedi preventivo" montava la sua
 * copia del modale. Due copie nello stesso albero vogliono dire due form, due
 * stati, e il rischio concreto che si aprano insieme. Qui il modale sta nella
 * radice e le pagine chiedono soltanto di aprirlo.
 *
 * Chi apre il modulo da una scheda prodotto passa la categoria, e il modulo si
 * precompila: e' l'unico motivo per cui la funzione accetta un argomento.
 *
 * Il valore predefinito e' una funzione che non fa niente: se un componente
 * finisce fuori dal provider (per esempio in un test) non esplode, semplicemente
 * il pulsante non apre nulla.
 */
const Contesto = createContext<(categoria?: Category) => void>(() => {});

export const PreventivoProvider = Contesto.Provider;

/** Restituisce la funzione che apre il modulo preventivo. */
export function usePreventivo() {
  return useContext(Contesto);
}
