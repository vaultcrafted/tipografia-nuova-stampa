import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, X, Menu } from "lucide-react";
import { categories } from "@/data/categories";

export function AppHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
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

        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-md hairline-strong grid place-items-center bg-background/60">
            <span className="font-display text-lg leading-none text-white">
              <span style={{ color: "var(--brand-red)" }}>N</span>S
            </span>
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-xl tracking-wide text-white">
              Tipografia Nuova Stampa
            </span>
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-white/50">
              Stampa professionale per la tua azienda
            </span>
          </div>
        </Link>

        <Link
          to="/chi-siamo"
          className="hidden sm:inline-flex shrink-0 ml-auto font-mono-ui text-[11px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
        >
          Chi siamo
        </Link>

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
              className="flex-1 bg-transparent outline-none font-mono-ui text-sm text-white placeholder:text-white/40"
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
                    <div className="px-4 py-6 font-mono-ui text-sm text-white/40">
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
                        <span className="font-mono-ui text-[10px] uppercase tracking-widest text-white/40">
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
      </div>
    </header>
  );
}
