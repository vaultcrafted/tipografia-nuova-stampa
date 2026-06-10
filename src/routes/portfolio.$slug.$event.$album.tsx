import { useState, useEffect } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Grid, Maximize2 } from "lucide-react";
import { portfolioCategories } from "@/data/categories";
import { getAlbum } from "@/data/portfolio";
import { cfImageUrl } from "@/lib/cloudflare-images";
import type { Photo } from "@/data/portfolio";

export const Route = createFileRoute("/portfolio/$slug/$event/$album")({
  loader: ({ params }) => {
    const category = portfolioCategories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    const event = category.events.find((e) => e.slug === params.event);
    if (!event) throw notFound();
    const album = getAlbum(params.slug, params.event, params.album);
    if (!album) throw notFound();
    return { category, event, album };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const url = `https://tipografianuovastampa.com/portfolio/${params.slug}/${params.event}/${params.album}`;
    return {
      meta: [
        { title: `${loaderData.album.title} — ${loaderData.event.name} — Tipografia Nuova Stampa` },
        { name: "description", content: `${loaderData.event.name} · ${loaderData.album.date}${loaderData.album.location ? ` · ${loaderData.album.location}` : ""}` },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="px-8 py-24 text-center">
      <h1 className="font-display text-5xl text-white">Album non trovato</h1>
      <Link to="/" className="mt-6 inline-block text-white/60 underline">Torna alla home</Link>
    </div>
  ),
  component: AlbumPage,
});

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({
  photos,
  startIdx,
  onClose,
}: {
  photos: Photo[];
  startIdx: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIdx);
  const total = photos.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + total) % total);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, total]);

  const photo = photos[idx];
  const imageUrl = cfImageUrl(photo.id, "lightbox");

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40">
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
          aria-label="Chiudi"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 min-h-0">
        <button
          onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + total) % total); }}
          className="shrink-0 p-2 text-white/40 hover:text-white transition-colors"
          aria-label="Foto precedente"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div
          className="relative flex-1 max-w-5xl mx-2 rounded-xl overflow-hidden"
          style={{ maxHeight: "calc(100vh - 180px)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {imageUrl ? (
            <img
              key={photo.id}
              src={imageUrl}
              alt={photo.alt}
              className="w-full h-full object-contain"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            />
          ) : (
            <div
              className="w-full rounded-xl border border-white/10 grid place-items-center"
              style={{
                aspectRatio: "4/3",
                background: "linear-gradient(135deg, oklch(0.22 0.10 240) 0%, oklch(0.16 0.08 230) 100%)",
              }}
            >
              <div className="text-center">
                <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">
                  Foto in arrivo
                </div>
                <div className="font-display text-3xl text-white/20">{photo.alt}</div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % total); }}
          className="shrink-0 p-2 text-white/40 hover:text-white transition-colors"
          aria-label="Foto successiva"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div
        className="flex items-center justify-center gap-1.5 px-6 pb-5 overflow-x-auto shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.map((p, i) => {
          const thumbUrl = cfImageUrl(p.id, "thumbnail");
          return (
            <button
              key={p.id}
              onClick={() => setIdx(i)}
              className={`shrink-0 w-12 h-9 rounded border overflow-hidden transition-all ${
                idx === i ? "border-[var(--brand-red)] scale-110" : "border-white/10 opacity-40 hover:opacity-70"
              }`}
              aria-label={`Foto ${i + 1}`}
            >
              {thumbUrl ? (
                <img src={thumbUrl} alt={p.alt} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Photo grid tile ─────────────────────────────────────────────────────────
function PhotoTile({
  photo,
  index,
  onOpen,
}: {
  photo: Photo;
  index: number;
  onOpen: () => void;
}) {
  const galleryUrl = cfImageUrl(photo.id, "gallery");

  return (
    <button
      onClick={onOpen}
      className="group relative overflow-hidden rounded-md border border-white/10 hover:border-white/30 transition-all duration-300 aspect-square"
      aria-label={`Apri foto: ${photo.alt}`}
    >
      {galleryUrl ? (
        <img
          src={galleryUrl}
          alt={photo.alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            background: "linear-gradient(135deg, oklch(0.24 0.11 240) 0%, oklch(0.18 0.09 230) 100%)",
          }}
        >
          <span className="font-mono-ui text-[10px] text-white/20 uppercase tracking-widest">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 grid place-items-center">
        <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function AlbumPage() {
  const { category, event, album } = Route.useLoaderData();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <div className="px-6 sm:px-10 lg:px-16 pb-32 lg:pb-16">
      {/* Header */}
      <section className="pt-12 lg:pt-16 pb-12">
        <Link
          to="/portfolio/$slug/$event"
          params={{ slug: category.slug, event: event.slug }}
          className="inline-flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> {event.name}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
              {category.name} · {event.name} ·{" "}
              <span style={{ color: "var(--brand-red)" }}>{album.date}</span>
            </div>
            <h1 className="font-display text-white text-[10vw] sm:text-[7vw] lg:text-[5.5vw] leading-[0.92] tracking-tight">
              {album.title}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pb-4">
            <div className="hidden lg:block h-px w-12 mb-4" style={{ background: "var(--brand-red)" }} />
            <div className="space-y-1">
              {album.location && (
                <p className="text-white/60 text-sm">{album.location}</p>
              )}
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/30">
                {album.photos.length} fotografie
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo grid */}
      <section className="mb-20">
        <div className="flex items-baseline justify-between mb-6">
          <div className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40">
            <Grid className="h-3 w-3" />
            Galleria
          </div>
          <div className="font-mono-ui text-[10px] uppercase tracking-widest text-white/25">
            click per ingrandire
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {album.photos.map((photo: import("@/data/portfolio").Photo, i: number) => (
            <PhotoTile
              key={photo.id}
              photo={photo}
              index={i}
              onOpen={() => setLightboxIdx(i)}
            />
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          photos={album.photos}
          startIdx={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl p-3">
        <a
          href="https://wa.me/393332876277"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-md py-3.5 text-sm font-bold uppercase tracking-widest text-white text-center"
          style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
        >
          Prenota su WhatsApp
        </a>
      </div>
    </div>
  );
}
