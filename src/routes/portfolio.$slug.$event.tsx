import { createFileRoute, notFound, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { portfolioCategories } from "@/data/categories";
import { cfImageUrl } from "@/lib/cloudflare-images";
import type { Album } from "@/data/portfolio";

export const Route = createFileRoute("/portfolio/$slug/$event")({
  loader: async ({ params, context }) => {
    const category = portfolioCategories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    const event = category.events.find((e) => e.slug === params.event);
    if (!event) throw notFound();

    let albums: Album[] = [];
    try {
      const res = await fetch(`/api/portfolio/albums?category=${params.slug}&event=${params.event}`);
      if (res.ok) albums = await res.json() as Album[];
    } catch {
      albums = [];
    }

    return { category, event, albums };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const url = `https://tipografianuovastampa.com/portfolio/${params.slug}/${params.event}`;
    return {
      meta: [
        { title: `${loaderData.event.name} — ${loaderData.category.name} — Tipografia Nuova Stampa` },
        { name: "description", content: loaderData.event.description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="px-8 py-24 text-center">
      <h1 className="font-display text-5xl text-white">Evento non trovato</h1>
      <Link to="/" className="mt-6 inline-block text-white/60 underline">Torna alla home</Link>
    </div>
  ),
  component: EventAlbumsWrapper,
});

function EventAlbumsWrapper() {
  const matchRoute = useMatchRoute();
  const isAlbum = matchRoute({ to: "/portfolio/$slug/$event/$album", fuzzy: true });
  if (isAlbum) return <Outlet />;
  return <EventAlbumsPage />;
}

function AlbumCard({ album, categorySlug, eventSlug }: { album: Album; categorySlug: string; eventSlug: string }) {
  const coverPhoto = album.photos.find((p) => p.featured) ?? album.photos[0];
  const coverUrl = coverPhoto ? cfImageUrl(coverPhoto.id, "thumbnail") : "";

  return (
    <Link
      to="/portfolio/$slug/$event/$album"
      params={{ slug: categorySlug, event: eventSlug, album: album.slug }}
      className="group relative overflow-hidden rounded-lg border border-white/10 hover:border-[var(--brand-red)] transition-all duration-300 hover:-translate-y-1 block"
      style={{ aspectRatio: "4/3" }}
    >
      {coverUrl ? (
        <img src={coverUrl} alt={coverPhoto?.alt ?? album.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.24 0.11 240) 0%, oklch(0.18 0.09 230) 100%)" }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute top-4 right-4 font-mono-ui text-[10px] uppercase tracking-widest text-white/60 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
        {album.photos.length} foto
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-2xl text-white leading-tight">{album.title}</h3>
        <div className="mt-1 flex items-center gap-3">
          <span className="font-mono-ui text-[11px] text-white/50">{album.date}</span>
          {album.location && <><span className="text-white/20">·</span><span className="font-mono-ui text-[11px] text-white/50">{album.location}</span></>}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "var(--brand-red)" }} />
    </Link>
  );
}

function EventAlbumsPage() {
  const { category, event, albums } = Route.useLoaderData();

  return (
    <div className="px-6 sm:px-10 lg:px-16 pb-32 lg:pb-16">
      <section className="pt-12 lg:pt-16 pb-12">
        <Link to="/portfolio/$slug" params={{ slug: category.slug }} className="inline-flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-3 w-3" /> {category.name}
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
              {category.name} · <span style={{ color: "var(--brand-red)" }}>{event.slug}</span>
            </div>
            <h1 className="font-display text-white text-[13vw] sm:text-[9vw] lg:text-[6.5vw] leading-[0.92] tracking-tight">{event.name}</h1>
          </div>
          <div className="lg:col-span-4 lg:pb-4">
            <div className="hidden lg:block h-px w-12 mb-4" style={{ background: "var(--brand-red)" }} />
            <p className="text-white/70 leading-relaxed">{event.description}</p>
          </div>
        </div>
      </section>

      <section className="mb-20">
        {albums.length > 0 ? (
          <>
            <div className="flex items-baseline justify-between mb-6">
              <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40">◆ {albums.length} album</div>
              <div className="font-mono-ui text-[10px] uppercase tracking-widest text-white/25">click per aprire</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {albums.map((album: import("@/data/portfolio").Album) => (
                <AlbumCard key={album.slug} album={album} categorySlug={category.slug} eventSlug={event.slug} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-full border border-white/10 grid place-items-center mb-6" style={{ background: "var(--brand-red)" + "15" }}>
              <Camera className="h-7 w-7 text-white/40" />
            </div>
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">Nessun album ancora</div>
            <h2 className="font-display text-3xl text-white/60 mb-2">Prossimamente</h2>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed">Gli album di {event.name.toLowerCase()} saranno pubblicati presto.</p>
            <a href="https://wa.me/393332876277" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.03]" style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}>
              Prenota su WhatsApp
            </a>
          </div>
        )}
      </section>

      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl p-3">
        <a href="https://wa.me/393332876277" target="_blank" rel="noopener noreferrer" className="block w-full rounded-md py-3.5 text-sm font-bold uppercase tracking-widest text-white text-center" style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}>
          Prenota su WhatsApp
        </a>
      </div>
    </div>
  );
}
