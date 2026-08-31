import { useState, useRef, useEffect } from "react";
import { MarchioNS } from "@/components/MarchioNS";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, X, Menu } from "lucide-react";
import { categories } from "@/data/categories";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePreventivo } from "@/lib/preventivo";

export function AppHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const apriPreventivo = usePreventivo();
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.label.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q),
      )
    : categories;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-5 lg:px-8 py-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 text-white/80 hover:text-white"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo sinistra — quadratino NS + nome */}
        <Link to="/" className="group/logo flex items-center gap-3 shrink-0">
          <MarchioNS className="h-9 w-9 shrink-0 text-white transition-colors duration-300 group-hover/logo:text-[var(--brand-red)]" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-xl tracking-wide text-white">
              Tipografia Nuova Stampa
            </span>
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-white/50">
              Stampa professionale per la tua azienda
            </span>
          </div>
        </Link>

        {/* Qui c'era un secondo logo, centrato, oltre a quello a sinistra: due
            marchi nella stessa barra si annullano a vicenda. Adesso lo spazio
            centrale e' vuoto e serve a spingere ricerca e azioni a destra. */}
        <div className="hidden flex-1 lg:block" />

        {/* Destra — Chi siamo, toggle tema, ricerca */}
        <div className="flex items-center gap-3 lg:shrink-0 w-full lg:w-auto">
          <Link
            to="/chi-siamo"
            className="occhiello hidden shrink-0 text-white/55 transition-colors hover:text-white sm:inline-flex"
          >
            Chi siamo
          </Link>
          <ThemeToggle />

          <div ref={wrapRef} className="relative w-full max-w-md">
            <div
              className={`flex items-center gap-2 rounded-md border bg-background/40 px-3 py-2 transition-all ${
                open
                  ? "border-[var(--brand-red)] glow-red"
                  : "border-white/20 hover:border-white/30"
              }`}
            >
              <Search className="h-4 w-4 text-white/50" />
              <input
                type="search"
                aria-label="Cerca un prodotto nel catalogo"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Cerca un prodotto..."
                className="flex-1 bg-transparent outline-none font-mono-ui text-sm text-white placeholder:text-white/55"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-white/50 hover:text-white"
                  aria-label="Pulisci"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {open && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                  onClick={() => setOpen(false)}
                />
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-white/15 bg-popover/95 backdrop-blur-xl shadow-2xl">
                  <div className="max-h-[60vh] overflow-y-auto">
                    {results.length === 0 ? (
                      <div className="px-4 py-6 font-mono-ui text-sm text-white/55">
                        Nessun prodotto trovato
                      </div>
                    ) : (
                      results.map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => {
                            navigate({
                              to: "/categoria/$slug",
                              params: { slug: c.slug },
                            });
                            setOpen(false);
                            setQuery("");
                          }}
                          className="flex w-full items-center justify-between gap-4 border-b border-white/5 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/5"
                        >
                          <span className="text-sm text-white">{c.name}</span>
                          <span className="font-mono-ui text-[10px] uppercase tracking-widest text-white/55">
                            {c.label}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Il preventivo e' l'azione che il sito deve far compiere: da qui non
              sparisce mai, perche' l'intestazione e' appiccicata in alto. Sul
              telefono non c'e' — la' c'e' gia' la barra fissa in basso, e due
              pulsanti uguali sullo stesso schermo sono solo ingombro. */}
          <button
            type="button"
            onClick={() => apriPreventivo()}
            className="hidden shrink-0 rounded-sm px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-transform hover:scale-[1.03] lg:inline-flex"
            style={{ background: "var(--brand-red)" }}
          >
            Preventivo
          </button>
        </div>
      </div>
    </header>
  );
}
