import { Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";
import { famiglie } from "@/data/famiglie";

/**
 * Il catalogo in home, diviso per famiglie.
 *
 * PRIMA erano diciotto riquadri identici in una griglia unica, numerati 01-18.
 * Il problema non era estetico: chi arrivava cercando i biglietti da visita
 * scorreva fino ai biglietti da visita e usciva. Non c'era nessun momento in cui
 * la pagina dicesse "sappiamo fare anche tutta quest'altra roba".
 *
 * ORA ogni famiglia e' una fascia con il suo titolo, la sua promessa in una riga
 * e il suo filetto di colore. Chi scorre incontra quattro cambi di argomento
 * dichiarati, e ognuno e' un'occasione di scoprire qualcosa che non stava
 * cercando.
 *
 * La colonna di sinistra e' `sticky` sui monitor larghi: mentre si scorrono i
 * prodotti di una famiglia si continua a vedere di che famiglia si tratta.
 * Sotto i 1024px torna una normale intestazione, perche' un elemento appiccicato
 * su uno schermo alto 700px mangia mezza pagina.
 */

export function CatalogoFamiglie() {
  const perSlug = new Map(categories.map((c) => [c.slug, c]));

  return (
    <section className="scroll-mt-24" id="catalogo">
      <div className="mb-12 border-t border-white/15 pt-6 lg:mb-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-5xl text-white lg:text-6xl">
            Cosa stampiamo
          </h2>
          <span className="occhiello text-white/55">
            {categories.length} prodotti · {famiglie.length} famiglie
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-16 lg:gap-24">
        {famiglie.map((f) => (
          <div
            key={f.slug}
            className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:gap-12"
          >
            <div className="lg:sticky lg:top-[105px] lg:self-start">
              <div
                className="filetto-famiglia mb-4 max-w-[56px]"
                style={{ background: f.colore }}
                aria-hidden="true"
              />
              <div className="mb-3 flex items-baseline gap-2">
                <span
                  className="font-mono-ui text-[11px] font-medium"
                  style={{ color: f.colore }}
                >
                  {f.sigla}
                </span>
                <span className="occhiello text-white/55">
                  {f.categorie.length} prodotti
                </span>
              </div>
              <h3 className="font-display text-2xl leading-tight text-white lg:text-3xl">
                {f.nome}
              </h3>
              <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-white/55">
                {f.promessa}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
              {f.categorie.map((slug) => {
                const c = perSlug.get(slug);
                if (!c) return null;
                return (
                  <Link
                    key={slug}
                    to="/categoria/$slug"
                    params={{ slug }}
                    className="group flex flex-col"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 bg-card">
                      <img
                        src={c.cover}
                        alt={c.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      {/* Il filetto di famiglia compare all'hover in fondo
                          all'immagine: conferma dove sei senza colorare la
                          scheda. */}
                      <span
                        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                        style={{ background: f.colore }}
                        aria-hidden="true"
                      />
                    </div>
                    {/* Didascalia sotto l'immagine, non sopra: e' cosi' che si
                        impagina un catalogo, e il testo si legge sempre invece
                        di dipendere da quanto e' scura la foto. */}
                    <div className="mt-3">
                      <div className="font-display text-[17px] leading-tight text-white">
                        {c.name}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-white/55">
                        {c.tagline}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
