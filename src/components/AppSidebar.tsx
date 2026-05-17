import { Link, useRouterState } from "@tanstack/react-router";
import { categories } from "@/data/categories";

export function AppSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[73px] z-50 lg:z-auto h-screen lg:h-[calc(100vh-73px)] w-[85vw] max-w-[300px] shrink-0 border-r border-white/10 bg-black/60 backdrop-blur-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto py-4 px-4">
          <div className="mb-6 flex items-center justify-center">
            <span className="font-display text-xl uppercase tracking-wide text-white/80">
  Catalogo <span className="text-sm text-white/30"></span>
</span>
            <button
              onClick={onClose}
              className="lg:hidden px-3 py-1.5 rounded-md border border-white/10 text-white/50 hover:text-white text-xs font-mono-ui uppercase tracking-widest"
            >
              chiudi
            </button>
          </div>

          <nav className="flex flex-col gap-0.5">
            {categories.map((c, i) => {
              const to = `/categoria/${c.slug}`;
              const active = pathname === to;
              return (
                <Link
                  key={c.slug}
                  to="/categoria/$slug"
                  params={{ slug: c.slug }}
                  onClick={onClose}
                  className={`group relative flex items-center gap-3 py-3 pl-4 pr-2 rounded-md transition-all duration-300 active:bg-white/5 hover:scale-[1.04] hover:blur-[0.3px] ${
  active ? "text-white bg-white/5" : "text-white/50 hover:text-white/90"
}`}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-[2px] rounded-sm"
                      style={{
                        background: "var(--brand-red)",
                        boxShadow: "0 0 8px var(--brand-red)",
                      }}
                    />
                  )}
                  <span className="font-mono-ui text-[10px] tabular-nums text-white/30 w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono-ui text-[13px] leading-snug">
                    {c.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-white/30 leading-relaxed">
            <p>Stampa digitale</p>
            <p>DTF · Laser UV</p>
          </div>
        </div>
      </aside>
    </>
  );
}
