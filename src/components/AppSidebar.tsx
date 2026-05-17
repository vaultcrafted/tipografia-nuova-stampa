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
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-[73px] z-50 lg:z-auto h-screen lg:h-[calc(100vh-73px)] w-[280px] shrink-0 border-r border-white/10 bg-black/30 backdrop-blur-xl transition-transform ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40">
              Catalogo · 15
            </span>
            <button
              onClick={onClose}
              className="lg:hidden text-white/50 hover:text-white text-sm"
            >
              chiudi
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {categories.map((c, i) => {
              const to = `/categoria/${c.slug}`;
              const active = pathname === to;
              return (
                <Link
                  key={c.slug}
                  to="/categoria/$slug"
                  params={{ slug: c.slug }}
                  onClick={onClose}
                  className={`group relative flex items-baseline gap-3 py-2 pl-4 pr-2 transition-all ${
                    active
                      ? "text-white"
                      : "text-white/50 hover:text-white/90"
                  }`}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-sm"
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

          <div className="mt-auto pt-8 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-white/30 leading-relaxed">
            <p>Stampa digitale</p>
            <p>DTF · Laser UV</p>
          </div>
        </div>
      </aside>
    </>
  );
}
