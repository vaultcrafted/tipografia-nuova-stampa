import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Category } from "@/data/categories";
import {
  SIZES_GALLERIA,
  misureCopertina,
  misureScatto,
  srcSetCopertina,
  srcSetScatto,
} from "@/lib/immagini";

/**
 * Griglia lavori: 4 scatti orizzontali (quadrati nella griglia) attorno
 * a uno scatto verticale che occupa la colonna centrale su due righe.
 * Ordine nel lightbox: 0,1 = colonna sinistra · 2 = verticale · 3,4 = colonna destra.
 */
export function CategoryGallery({ category }: { category: Category }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const shots = [
    { src: category.images[0], vertical: false },
    { src: category.images[1], vertical: false },
    { src: category.cover, vertical: true },
    { src: category.images[2], vertical: false },
    { src: category.images[3], vertical: false },
  ];

  // Il riquadro centrale e' la copertina verticale, gli altri quattro sono gli
  // scatti orizzontali: hanno derivate di misure diverse.
  const insieme = (vertical: boolean) => ({
    srcSet: vertical ? srcSetCopertina : srcSetScatto,
    misure: vertical ? misureCopertina : misureScatto,
  });
  const total = shots.length;

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? null : (i + 1) % total));
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i === null ? null : (i - 1 + total) % total));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIdx, total]);

  const tileStyle = {
    background: "linear-gradient(135deg, oklch(0.28 0.12 230) 0%, oklch(0.20 0.10 220) 60%, oklch(0.22 0.08 200 / 0.6) 100%)",
  };

  const Tile = ({ idx, badge, className }: { idx: number; badge: number; className: string }) => (
    <div
      className={`relative overflow-hidden rounded-md hairline cursor-pointer group ${className}`}
      onClick={() => setOpenIdx(idx)}
    >
      {/* fondo: resta visibile se l'immagine non è ancora stata caricata */}
      <div className="absolute inset-0" style={tileStyle} />
      <img
        src={shots[idx].src}
        srcSet={insieme(shots[idx].vertical).srcSet(shots[idx].src)}
        sizes={SIZES_GALLERIA}
        width={insieme(shots[idx].vertical).misure.larghezza}
        height={insieme(shots[idx].vertical).misure.altezza}
        alt={`${category.name} — scatto ${badge}`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-0" />
      <div className="absolute bottom-3 left-3 font-mono-ui text-[10px] uppercase tracking-widest text-white/70 mix-blend-difference">
        {String(badge).padStart(2, "0")} / {category.label}
      </div>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-4" style={{ gridTemplateRows: "1fr 1fr" }}>
        <Tile idx={0} badge={1} className="aspect-square" />
        <Tile idx={2} badge={3} className="row-span-2" />
        <Tile idx={3} badge={4} className="aspect-square" />
        <Tile idx={1} badge={2} className="aspect-square" />
        <Tile idx={4} badge={5} className="aspect-square" />
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
            aria-label="Precedente"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpenIdx((i) => (i === null ? null : (i + 1) % total)); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white"
            aria-label="Successivo"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative rounded-lg hairline-strong overflow-hidden max-h-[85vh] max-w-[92vw]"
          >
            <img
              src={shots[openIdx].src}
              alt={`${category.name} — scatto ${openIdx + 1}`}
              className="block max-h-[85vh] max-w-[92vw] object-contain"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
              <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/50">
                {category.label} · scatto {String(openIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </div>
              <div className="font-display text-2xl text-white/90">{category.name}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
