import { Link } from "@tanstack/react-router";
import { categories, type Category } from "@/data/categories";
import { famiglie } from "@/data/famiglie";
import {
  SIZES_SCHEDA,
  misureCopertina,
  srcSetCopertina,
} from "@/lib/immagini";

/**
 * La riga di specifiche che compare all'hover: il primo formato, e quanti
 * altri ce ne sono. Non e' un dato messo li' per riempire il pannello — e'
 * l'informazione che la gente cerca davvero prima di aprire una scheda
 * ("ce l'avete nella misura che mi serve?"), e vederla senza cliccare
 * risparmia un viaggio avanti e indietro.
 *
 * Le parentesi vanno via ("A5 (148 × 210 mm)" → "A5") perche' nello spazio di
 * una riga sola conta il nome, non la misura in millimetri.
 * Alcune categorie hanno l'elenco vuoto o un trattino: in quel caso il
 * pannello mostra solo l'invito ad aprire, senza una riga bugiarda.
 */
function specifica(c: Category): string | null {
  const voci = (c.formats ?? [])
    .map((v) => v.trim())
    .filter((v) => v.replace(/[-–—]/g, "").length > 0);
  if (voci.length === 0) return null;
  const primo = voci[0].replace(/\s*\(.*?\)\s*/g, "").trim();
  return voci.length > 1 ? `${primo} · +${voci.length - 1} formati` : primo;
}

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
            <div className="lg:sticky lg:top-[calc(var(--altezza-header)+32px)] lg:self-start">
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
                const spec = specifica(c);
                return (
                  <Link
                    key={slug}
                    to="/categoria/$slug"
                    params={{ slug }}
                    className="group flex flex-col"
                  >
                    {/* La scheda si solleva di 4px e il bordo si schiarisce:
                        e' il segnale che dice "questo si clicca" prima ancora
                        che si legga cosa c'e' dentro.

                        ATTENZIONE, TRAPPOLA DI TAILWIND 4: `-translate-y-1`
                        non scrive piu' `transform`, scrive la proprieta'
                        `translate`. Un `transition-[transform,...]` qui non
                        animerebbe niente — lo scatto sarebbe istantaneo. Da
                        qui `transition-[translate,...]`. */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 bg-card transition-[translate,border-color,box-shadow] duration-500 ease-out group-hover:-translate-y-1 group-hover:border-white/25 group-hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)]">
                      <img
                        src={c.cover}
                        srcSet={srcSetCopertina(c.cover)}
                        sizes={SIZES_SCHEDA}
                        width={misureCopertina.larghezza}
                        height={misureCopertina.altezza}
                        alt={c.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                      />

                      {/* Il velo scuro esiste solo mentre il mouse e' li'.
                          Serve a far leggere le due righe di sotto: senza,
                          finirebbero sopra una foto chiara e sparirebbero.
                          I colori sono scritti a mano e non con `text-white`
                          perche' questo testo sta su una campitura scura in
                          entrambi i temi, e le regole del tema chiaro lo
                          renderebbero nero su nero. */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(9,9,10,0.94) 0%, rgba(9,9,10,0.62) 34%, rgba(9,9,10,0.12) 66%, transparent 88%)",
                        }}
                        aria-hidden="true"
                      />

                      {/* NIENTE SIGLA DI FAMIGLIA QUI SOPRA. C'era, ed e'
                          stata tolta: il suo colore per la famiglia "K" e'
                          l'inchiostro smorzato, che cambia col tema, e in
                          cima all'immagine il velo scuro non arriva. Nel tema
                          chiaro sarebbe finita grigio scuro su una fotografia.
                          La famiglia si legge gia' nella colonna di sinistra e
                          nel filetto in fondo alla scheda: ripeterla qui
                          costava un bug e non aggiungeva niente. */}

                      {/* Il pannello sale da sotto il bordo, non compare in
                          dissolvenza: il movimento verso l'alto e' lo stesso
                          della scheda che si solleva, cosi' i due gesti si
                          leggono come uno solo. */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-500 ease-out group-hover:translate-y-0">
                        {spec && (
                          <div
                            className="font-mono-ui text-[10px] leading-snug"
                            style={{ color: "rgba(255,255,255,0.78)" }}
                          >
                            {spec}
                          </div>
                        )}
                        <div
                          className="occhiello mt-2 flex items-center gap-1.5"
                          style={{ color: "#fff" }}
                        >
                          Apri la scheda
                          <span
                            className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </div>
                      </div>

                      {/* Il filetto di famiglia si tira in fondo
                          all'immagine: conferma dove sei senza colorare la
                          scheda. */}
                      <span
                        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                        style={{ background: f.colore }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Didascalia sotto l'immagine, non sopra: e' cosi' che si
                        impagina un catalogo, e il testo si legge sempre invece
                        di dipendere da quanto e' scura la foto. */}
                    <div className="mt-3">
                      <div className="font-display text-[17px] leading-tight text-white transition-transform duration-500 ease-out group-hover:translate-x-1">
                        {c.name}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-white/55 transition-colors duration-500 group-hover:text-white/75">
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
