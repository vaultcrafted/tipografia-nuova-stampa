import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Category } from "@/data/categories";

type Tile = { id: number; aspect: string };

const TILES: Tile[] = [
  { id: 1, aspect: "aspect-[4/5]" },
  { id: 2, aspect: "aspect-square" },
  { id: 3, aspect: "aspect-[3/4]" },
  { id: 4, aspect: "aspect-square" },
  { id: 5, aspect: "aspect-[4/5]" },
  { id: 6, aspect: "aspect-[3/4]" },
  { id: 7, aspect: "aspect-square" },
  { id: 8, aspect: "aspect-[4/5]" },
  { id: 9, aspect: "aspect-[3/4]" },
];

export function CategoryGallery({ category }: { category: Category }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? null : (i + 1) % TILES.length));
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i === null ? null : (i - 1 + TILES.length) % TILES.length));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIdx]);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {TILES.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setOpenIdx(i)}
            className={`group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-md hairline ${t.aspect}`}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.22 0.04 250) 0%, oklch(0.16 0.03 240) 60%, oklch(0.20 0.06 30 / 0.4) 100%)",
              }}
            />
            <div className="absolute inset-0 grid place-items-center px-4 text-center">
              <span className="font-display text-xl uppercase tracking-wide text-white/70">
                {category.name}
              </span>
            </div>
            <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-0" />
            <div className="absolute bottom-3 left-3 font-mono-ui text-[10px] uppercase tracking-widest text-white/60">
              {String(t.id).padStart(2, "0")} / {category.label}
            </div>
          </button>
        ))}
      </div>

      {openIdx !== null && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md grid place-items-center p-4" onClick={() => setOpenIdx(null)}>
          <button
            onClick={() => setOpenIdx(null)}
           className="absolute top-5 right-5 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:text-white transition-all z-[120]"
            aria-label="Chiudi"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={() => setOpenIdx((i) => (i === null ? null : (i - 1 + TILES.length) % TILES.length))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white"
            aria-label="Precedente"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={() => setOpenIdx((i) => (i === null ? null : (i + 1) % TILES.length))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white"
            aria-label="Successivo"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

         <div
  onClick={(e) => e.stopPropagation()}
  className="relative w-full max-w-4xl aspect-[4/3] rounded-lg hairline-strong overflow-hidden"
  style={{
    background:
      "linear-gradient(135deg, oklch(0.22 0.04 250) 0%, oklch(0.16 0.03 240) 60%, oklch(0.20 0.06 30 / 0.4) 100%)",
  }}
>
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.04 250) 0%, oklch(0.16 0.03 240) 60%, oklch(0.20 0.06 30 / 0.4) 100%)",
            }}
          >
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
                  {category.label} · scatto {String((openIdx ?? 0) + 1).padStart(2, "0")}
                </div>
                <div className="font-display text-5xl text-white/80">{category.name}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
