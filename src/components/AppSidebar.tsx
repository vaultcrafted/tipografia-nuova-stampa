import { Link, useRouterState } from "@tanstack/react-router";
import { categories, portfolioCategories } from "@/data/categories";
import { famiglie } from "@/data/famiglie";

/**
 * Menu laterale, presente su ogni pagina.
 *
 * PRIMA era un elenco piatto di venti voci numerate 01-20, tutte con lo stesso
 * peso. Chi cercava i biglietti da visita li trovava e usciva: non scopriva ne'
 * l'incisione laser ne' la stampa su abbigliamento. Un elenco lungo tutto uguale
 * non e' navigazione, e' un inventario.
 *
 * ORA le categorie sono raccolte nelle quattro famiglie (src/data/famiglie.ts),
 * ognuna con il suo colore di processo. Il colore non decora: e' la sola cosa
 * che, scorrendo l'occhio, dice "qui si cambia argomento". Dentro ogni famiglia
 * le voci restano semplici, perche' quelle vanno lette, non guardate.
 *
 * Numerazione tolta. I numeri 01-20 sembravano una classifica o una sequenza da
 * seguire, e non erano ne' l'una ne' l'altra.
 */

export function AppSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const perSlug = new Map(categories.map((c) => [c.slug, c]));

  const voce = (attiva: boolean) =>
    `group relative flex items-center gap-3 rounded-sm py-[7px] pl-3 pr-2 text-[13px] transition-colors ${
      attiva ? "bg-white/[0.07] text-white" : "text-white/55 hover:bg-white/[0.04] hover:text-white"
    }`;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[73px] z-50 lg:z-auto h-screen lg:h-[calc(100vh-73px)] w-[86vw] max-w-[310px] shrink-0 border-r border-white/10 bg-background/95 backdrop-blur-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-4 py-5">
          <div className="mb-7 flex items-center justify-between">
            <span className="occhiello text-white/55">Catalogo</span>
            <button
              onClick={onClose}
              className="occhiello rounded-sm border border-white/15 px-3 py-1.5 text-white/55 hover:text-white lg:hidden"
            >
              Chiudi
            </button>
          </div>

          <nav className="flex flex-col gap-7">
            {famiglie.map((f) => (
              <div key={f.slug}>
                {/* Testata di famiglia: filetto del colore di processo, sigla e
                    nome. Il filetto e' a piena saturazione perche' e' l'unico
                    posto in cui questi colori compaiono; le voci sotto restano
                    neutre. */}
                <div className="mb-2.5 pl-3">
                  <div
                    className="filetto-famiglia mb-2.5 max-w-[42px]"
                    style={{ background: f.colore }}
                    aria-hidden="true"
                  />
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-mono-ui text-[10px] font-medium"
                      style={{ color: f.colore }}
                    >
                      {f.sigla}
                    </span>
                    <span className="occhiello text-white/50">{f.nome}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  {f.categorie.map((slug) => {
                    const c = perSlug.get(slug);
                    if (!c) return null;
                    const attiva = pathname === `/categoria/${slug}`;
                    return (
                      <Link
                        key={slug}
                        to="/categoria/$slug"
                        params={{ slug }}
                        onClick={onClose}
                        className={voce(attiva)}
                      >
                        {attiva && (
                          <span
                            className="absolute left-0 top-1.5 bottom-1.5 w-[2px]"
                            style={{ background: f.colore }}
                            aria-hidden="true"
                          />
                        )}
                        {c.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <div className="mb-2.5 pl-3">
                <div
                  className="filetto-famiglia mb-2.5 max-w-[42px]"
                  style={{ background: "var(--brand-red)" }}
                  aria-hidden="true"
                />
                <span className="occhiello text-white/50">Portfolio</span>
              </div>
              <div className="flex flex-col">
                {portfolioCategories.map((c) => {
                  const attiva = pathname === `/portfolio/${c.slug}`;
                  return (
                    <Link
                      key={c.slug}
                      to="/portfolio/$slug"
                      params={{ slug: c.slug }}
                      onClick={onClose}
                      className={voce(attiva)}
                    >
                      {attiva && (
                        <span
                          className="absolute left-0 top-1.5 bottom-1.5 w-[2px]"
                          style={{ background: "var(--brand-red)" }}
                          aria-hidden="true"
                        />
                      )}
                      {c.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* In fondo al menu, non un elenco di parole chiave ma il modo di
              raggiungerci: chi scorre fin qui sta cercando come contattarci. */}
          <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
            <a
              href="tel:+393332876277"
              className="block font-display text-lg text-white transition-colors hover:text-white"
            >
              +39 333 287 6277
            </a>
            <p className="occhiello leading-[1.7] text-white/55">
              Lun – Ven 8:30 – 18:00
              <br />
              Livorno Ferraris (VC)
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
