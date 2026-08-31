import { Link } from "@tanstack/react-router";
import { famiglie } from "@/data/famiglie";
import { categories } from "@/data/categories";

/**
 * Il piede del sito.
 *
 * PRIMA era scritto tutto in monospaziato maiuscolo, etichette e contenuti allo
 * stesso modo: sembrava l'uscita di un terminale, e l'indirizzo — che e' una
 * delle informazioni piu' usate di tutto il sito — era illeggibile quanto la
 * partita IVA.
 *
 * ORA il monospaziato marca solo le etichette, come nel resto del sistema, e i
 * contenuti sono in tondo alla loro dimensione naturale. In piu' il piede porta
 * le quattro famiglie: chi arriva in fondo a una scheda prodotto ha ancora una
 * strada davanti invece di un vicolo cieco.
 */

export function AppFooter() {
  const perSlug = new Map(categories.map((c) => [c.slug, c]));

  return (
    <footer className="mt-24 border-t border-white/15 px-6 pt-14 pb-12 sm:px-10 lg:px-16">
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-12">
        {famiglie.map((f) => (
          <div key={f.slug}>
            <div
              className="filetto-famiglia mb-3 max-w-[28px]"
              style={{ background: f.colore }}
              aria-hidden="true"
            />
            <div className="occhiello mb-4 text-white/55">{f.nome}</div>
            {/* Sul telefono ogni voce e' una riga da toccare, non una riga da
                leggere: `min-h-11` e niente `space-y`, che lasciava fra i
                collegamenti otto pixel morti in cui il dito non prendeva
                niente. Da lg in su torna l'elenco compatto. */}
            <ul className="lg:space-y-2">
              {f.categorie.map((slug) => {
                const c = perSlug.get(slug);
                if (!c) return null;
                return (
                  <li key={slug}>
                    <Link
                      to="/categoria/$slug"
                      params={{ slug }}
                      className="flex min-h-11 items-center text-[14px] leading-snug text-white/55 transition-colors hover:text-white lg:min-h-0 lg:text-[13px]"
                    >
                      {c.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-8 border-t border-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="occhiello mb-4 text-white/55">Dove siamo</div>
          <p className="text-sm leading-relaxed text-white/70">
            Via Martiri della Libertà, 65
            <br />
            13046 Livorno Ferraris (VC)
          </p>
        </div>

        <div>
          <div className="occhiello mb-4 text-white/55">Contatti</div>
          <a
            href="tel:+393332876277"
            className="flex min-h-11 items-center font-display text-xl text-white transition-opacity hover:opacity-70 lg:min-h-0"
          >
            +39 333 287 6277
          </a>
          <a
            href="mailto:t.nuovastampa@gmail.com"
            className="flex min-h-11 items-center break-all text-sm text-white/60 transition-colors hover:text-white lg:mt-1.5 lg:min-h-0"
          >
            t.nuovastampa@gmail.com
          </a>
        </div>

        <div>
          <div className="occhiello mb-4 text-white/55">Orari</div>
          <p className="text-sm leading-relaxed text-white/70">
            Lun – Ven · 8:30 – 18:00
            <br />
            Sabato su appuntamento
          </p>
        </div>

        <div>
          <div className="occhiello mb-4 text-white/55">Dati fiscali</div>
          <p className="text-sm leading-relaxed text-white/60">
            P.IVA 02789310022
            <br />
            REA VC-313502
          </p>
        </div>
      </div>

      <div className="mt-12 space-y-4 border-t border-white/10 pt-8">
        {/* Trasparenza sulle immagini. Questa riga va tenuta vera: quando
            arriveranno le fotografie dei lavori veri, la frase sulle copertine
            del portfolio va tolta insieme ai file segnaposto. */}
        <p className="max-w-3xl text-[12px] leading-relaxed text-white/55">
          Le immagini che illustrano le categorie di catalogo, e le due
          copertine delle sezioni Fotografia e Video, sono generate con
          intelligenza artificiale e hanno valore puramente indicativo:
          formati, colori e finiture dei prodotti reali possono differire. Le
          fotografie dentro gli album del portfolio sono invece lavori
          realmente eseguiti da noi.
        </p>
        <div className="occhiello text-white/55">
          © {new Date().getFullYear()} Tipografia Nuova Stampa
        </div>
      </div>
    </footer>
  );
}
