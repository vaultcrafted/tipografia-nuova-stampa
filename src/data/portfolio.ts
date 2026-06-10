// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO DATA — aggiungi qui i tuoi album
// ─────────────────────────────────────────────────────────────────────────────
//
// COME AGGIUNGERE UN ALBUM:
//
// 1. Crea la struttura cartelle su R2:
//    R2 bucket "portfolio" → Aggiungi cartella → es. "fotografia/concerti/kaos-2022"
//
// 2. Carica le foto nella cartella (trascina dal computer)
//    Nomi consigliati: foto-01.jpg, foto-02.jpg, ecc.
//
// 3. Aggiungi l'album qui sotto con i percorsi relativi:
//    { id: "fotografia/concerti/kaos-2022/foto-01.jpg", alt: "..." }
//
// STRUTTURA CARTELLE R2 consigliata:
//   fotografia/
//     matrimoni/
//       mario-giulia-2024/
//         foto-01.jpg
//         foto-02.jpg
//     concerti/
//       kaos-onda-urto-2022/
//         foto-01.jpg
//   video/
//     matrimoni/
//       ...
// ─────────────────────────────────────────────────────────────────────────────

export type Photo = {
  id: string;          // Percorso nel bucket R2 (es. "fotografia/concerti/kaos-2022/foto-01.jpg")
  alt: string;         // Descrizione accessibile
  featured?: boolean;  // Se true, usata come cover dell'album
};

export type Album = {
  slug: string;        // URL-friendly (es. "kaos-onda-urto-2022")
  title: string;       // Nome visualizzato (es. "Kaos · Festa Radio Onda D'urto")
  date: string;        // Es. "Agosto 2022"
  location?: string;   // Es. "Livorno Ferraris (VC)"
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
    albums: [],
  },
  {
    categorySlug: "fotografia",
    eventSlug: "concerti",
    albums: [
      // Esempio pronto da attivare — rimuovi i // e carica le foto su R2:
      // {
      //   slug: "kaos-onda-urto-2022",
      //   title: "Kaos · Festa Radio Onda D'urto",
      //   date: "Agosto 2022",
      //   location: "Livorno Ferraris (VC)",
      //   photos: [
      //     { id: "fotografia/concerti/kaos-onda-urto-2022/foto-01.jpg", alt: "Kaos sul palco", featured: true },
      //     { id: "fotografia/concerti/kaos-onda-urto-2022/foto-02.jpg", alt: "Folla al concerto" },
      //     { id: "fotografia/concerti/kaos-onda-urto-2022/foto-03.jpg", alt: "DSA Commando" },
      //   ],
      // },
    ],
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
  { categorySlug: "video", eventSlug: "matrimoni",    albums: [] },
  { categorySlug: "video", eventSlug: "concerti",     albums: [] },
  { categorySlug: "video", eventSlug: "eventi",       albums: [] },
  { categorySlug: "video", eventSlug: "diciottesimi", albums: [] },
  { categorySlug: "video", eventSlug: "battesimi",    albums: [] },
  { categorySlug: "video", eventSlug: "feste-private",albums: [] },
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
