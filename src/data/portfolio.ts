// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO DATA — aggiungi qui i tuoi album
// ─────────────────────────────────────────────────────────────────────────────
//
// COME AGGIUNGERE UN ALBUM:
// 1. Carica le foto su Cloudflare Images (dashboard → Images → Upload)
// 2. Copia l'ID di ogni foto (es. "a1b2c3d4-e5f6-...")
// 3. Aggiungi un oggetto Album nell'array corretto qui sotto
//
// STRUTTURA URL:
//   /portfolio/fotografia/matrimoni          → lista album matrimoni
//   /portfolio/fotografia/matrimoni/mario-giulia-2024 → galleria foto
//   /portfolio/video/concerti                → lista album concerti
// ─────────────────────────────────────────────────────────────────────────────

export type Photo = {
  id: string;          // ID Cloudflare Images (es. "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
  alt: string;         // Descrizione accessibile
  featured?: boolean;  // Se true, usata come cover dell'album
};

export type Album = {
  slug: string;        // URL-friendly (es. "mario-giulia-2024")
  title: string;       // Nome visualizzato (es. "Mario & Giulia")
  date: string;        // Es. "Giugno 2024"
  location?: string;   // Es. "Casale Monferrato (AL)"
  photos: Photo[];
};

export type EventAlbums = {
  categorySlug: string;   // "fotografia" | "video"
  eventSlug: string;      // "matrimoni" | "concerti" | ecc.
  albums: Album[];
};

// ─── FOTOGRAFIA ──────────────────────────────────────────────────────────────

export const fotografiaAlbums: EventAlbums[] = [
  {
    categorySlug: "fotografia",
    eventSlug: "matrimoni",
    albums: [
      // Esempio — rimuovi o sostituisci con i tuoi veri album:
      // {
      //   slug: "mario-giulia-2024",
      //   title: "Mario & Giulia",
      //   date: "Giugno 2024",
      //   location: "Casale Monferrato (AL)",
      //   photos: [
      //     { id: "TUO-ID-CLOUDFLARE-1", alt: "Gli sposi all'altare", featured: true },
      //     { id: "TUO-ID-CLOUDFLARE-2", alt: "Il bacio" },
      //     { id: "TUO-ID-CLOUDFLARE-3", alt: "Il ricevimento" },
      //   ],
      // },
    ],
  },
  {
    categorySlug: "fotografia",
    eventSlug: "concerti",
    albums: [],
  },
  {
    categorySlug: "fotografia",
    eventSlug: "eventi",
    albums: [],
  },
  {
    categorySlug: "fotografia",
    eventSlug: "diciottesimi",
    albums: [],
  },
  {
    categorySlug: "fotografia",
    eventSlug: "battesimi",
    albums: [],
  },
  {
    categorySlug: "fotografia",
    eventSlug: "feste-private",
    albums: [],
  },
];

// ─── VIDEO ────────────────────────────────────────────────────────────────────

export const videoAlbums: EventAlbums[] = [
  {
    categorySlug: "video",
    eventSlug: "matrimoni",
    albums: [],
  },
  {
    categorySlug: "video",
    eventSlug: "concerti",
    albums: [],
  },
  {
    categorySlug: "video",
    eventSlug: "eventi",
    albums: [],
  },
  {
    categorySlug: "video",
    eventSlug: "diciottesimi",
    albums: [],
  },
  {
    categorySlug: "video",
    eventSlug: "battesimi",
    albums: [],
  },
  {
    categorySlug: "video",
    eventSlug: "feste-private",
    albums: [],
  },
];

// ─── HELPER ───────────────────────────────────────────────────────────────────

const allAlbums = [...fotografiaAlbums, ...videoAlbums];

export function getEventAlbums(categorySlug: string, eventSlug: string): EventAlbums | undefined {
  return allAlbums.find(
    (e) => e.categorySlug === categorySlug && e.eventSlug === eventSlug
  );
}

export function getAlbum(categorySlug: string, eventSlug: string, albumSlug: string): Album | undefined {
  return getEventAlbums(categorySlug, eventSlug)?.albums.find((a) => a.slug === albumSlug);
}
