import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Category } from "@/data/categories";

export function CategoryGallery({ category }: { category: Category }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const total = 5;

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? null : (i + 1) % total));
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i === null ? null : (i - 1 + total) % total));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIdx]);

  const tileStyle = {
    background: "linear-gradient(135deg, oklch(0.28 0.12 230) 0%, oklch(0.20 0.10 220) 60%, oklch(0.22 0.08 200 / 0.6) 100%)",
  };

  const TileContent = ({ id }: { id: number }) => (
    <>
      <div className="absolute inset-0" style={tileStyle} />
      <div className="absolute inset-0 grid place-items-center px-4 text-center">
        <span className="font-display text-xl uppercase tracking-wide text-white/70">
          {category.name}
        </span>
      </div>
      <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-0" />
      <div className="absolute bottom-3 left-3 font-mono-ui text-[10px] uppercase tracking-widest text-white/60">
        {String(id).padStart(2, "0")} / {category.label}
      </div>
    </>
  );

  return (
    <>
      {/* Layout: [col sinistra: 2 quadrate] [col centro: 1 verticale] [col destra: 2 quadrate] */}
      <div className="grid grid-cols-3 gap-4" style={{ gridTemplateRows: "1fr 1fr" }}>

        {/* Colonna sinistra — foto 1 (sopra) */}
        <div
          className="relative overflow-hidden rounded-md hairline cursor-pointer group aspect-square"
          onClick={() => setOpenIdx(0)}
        >
          <TileContent id={1} />
        </div>

        {/* Colonna centro — foto verticale (span 2 righe) */}
        <div
          className="relative overflow-hidden rounded-md hairline cursor-pointer group row-span-2"
          onClick={() => setOpenIdx(2)}
        >
          <div className="absolute inset-0" style={tileStyle} />
          <div className="absolute inset-0 grid place-items-center px-4 text-center">
            <span className="font-display text-xl uppercase tracking-wide text-white/70">
              {category.name}
            </span>
          </div>
          <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-0" />
          <div className="absolute bottom-3 left-3 font-mono-ui text-[10px] uppercase tracking-widest text-white/60">
            03 / {category.label}
          </div>
        </div>

        {/* Colonna destra — foto 4 (sopra) */}
        <div
          className="relative overflow-hidden rounded-md hairline cursor-pointer group aspect-square"
          onClick={() => setOpenIdx(3)}
        >
          <TileContent id={4} />
        </div>

        {/* Colonna sinistra — foto 2 (sotto) */}
        <div
          className="relative overflow-hidden rounded-md hairline cursor-pointer group aspect-square"
          onClick={() => setOpenIdx(1)}
        >
          <TileContent id={2} />
        </div>

        {/* Colonna destra — foto 5 (sotto) */}
        <div
          className="relative overflow-hidden rounded-md hairline cursor-pointer group aspect-square"
          onClick={() => setOpenIdx(4)}
        >
          <TileContent id={5} />
        </div>
      </div>

      {openIdx !== null && (
        <div
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md grid place-items-center p-4"
          onClick={() => setOpenIdx(null)}
        >
          <button
            onClick={() => setOpenIdx(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all z-[120]"
            aria-label="Chiudi"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpenIdx((i) => (i === null ? null : (i - 1 + total) % total)); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpenIdx((i) => (i === null ? null : (i + 1) % total)); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl aspect-[4/3] rounded-lg hairline-strong overflow-hidden"
            style={tileStyle}
          >
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
                  {category.label} · scatto {String((openIdx ?? 0) + 1).padStart(2, "00")}
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
