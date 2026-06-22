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
  pixiesetUrl?: string; // Link galleria completa su Pixieset
  coverVideo?: string;  // Percorso R2 del video di copertina (opzionale, sostituisce la foto hero)
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
      {
        slug: "kaos",
        title: "Kaos",
        date: "05/09/2022",
        photos: [
          { id: "fotografia/concerti/kaos/_MG_7354.jpg", alt: "Kaos — foto 1", featured: true },
          { id: "fotografia/concerti/kaos/_MG_7355.jpg", alt: "Kaos — foto 2" },
          { id: "fotografia/concerti/kaos/_MG_7356.jpg", alt: "Kaos — foto 3" },
          { id: "fotografia/concerti/kaos/_MG_7357.jpg", alt: "Kaos — foto 4" },
          { id: "fotografia/concerti/kaos/_MG_7359.jpg", alt: "Kaos — foto 5" },
          { id: "fotografia/concerti/kaos/_MG_7360.jpg", alt: "Kaos — foto 6" },
          { id: "fotografia/concerti/kaos/_MG_7364.jpg", alt: "Kaos — foto 7" },
          { id: "fotografia/concerti/kaos/_MG_7365.jpg", alt: "Kaos — foto 8" },
          { id: "fotografia/concerti/kaos/_MG_7366.jpg", alt: "Kaos — foto 9" },
          { id: "fotografia/concerti/kaos/_MG_7368.jpg", alt: "Kaos — foto 10" },
          { id: "fotografia/concerti/kaos/_MG_7369.jpg", alt: "Kaos — foto 11" },
          { id: "fotografia/concerti/kaos/_MG_7372.jpg", alt: "Kaos — foto 12" },
          { id: "fotografia/concerti/kaos/_MG_7373.jpg", alt: "Kaos — foto 13" },
          { id: "fotografia/concerti/kaos/_MG_7374.jpg", alt: "Kaos — foto 14" },
          { id: "fotografia/concerti/kaos/_MG_7376.jpg", alt: "Kaos — foto 15" },
          { id: "fotografia/concerti/kaos/_MG_7378.jpg", alt: "Kaos — foto 16" },
          { id: "fotografia/concerti/kaos/_MG_7384.jpg", alt: "Kaos — foto 17" },
          { id: "fotografia/concerti/kaos/_MG_7393.jpg", alt: "Kaos — foto 18" },
          { id: "fotografia/concerti/kaos/_MG_7394.jpg", alt: "Kaos — foto 19" },
          { id: "fotografia/concerti/kaos/_MG_7397.jpg", alt: "Kaos — foto 20" },
          { id: "fotografia/concerti/kaos/_MG_7405.jpg", alt: "Kaos — foto 21" },
          { id: "fotografia/concerti/kaos/_MG_7413.jpg", alt: "Kaos — foto 22" },
          { id: "fotografia/concerti/kaos/_MG_7419.jpg", alt: "Kaos — foto 23" },
          { id: "fotografia/concerti/kaos/_MG_7420.jpg", alt: "Kaos — foto 24" },
          { id: "fotografia/concerti/kaos/_MG_7422.jpg", alt: "Kaos — foto 25" },
          { id: "fotografia/concerti/kaos/_MG_7426.jpg", alt: "Kaos — foto 26" },
          { id: "fotografia/concerti/kaos/_MG_7427.jpg", alt: "Kaos — foto 27" },
          { id: "fotografia/concerti/kaos/_MG_7429.jpg", alt: "Kaos — foto 28" },
          { id: "fotografia/concerti/kaos/_MG_7431.jpg", alt: "Kaos — foto 29" },
          { id: "fotografia/concerti/kaos/_MG_7433.jpg", alt: "Kaos — foto 30" },
          { id: "fotografia/concerti/kaos/_MG_7434.jpg", alt: "Kaos — foto 31" },
          { id: "fotografia/concerti/kaos/_MG_7445.jpg", alt: "Kaos — foto 32" },
          { id: "fotografia/concerti/kaos/_MG_7447.jpg", alt: "Kaos — foto 33" },
          { id: "fotografia/concerti/kaos/_MG_7448.jpg", alt: "Kaos — foto 34" },
          { id: "fotografia/concerti/kaos/_MG_7449.jpg", alt: "Kaos — foto 35" },
          { id: "fotografia/concerti/kaos/_MG_7450.jpg", alt: "Kaos — foto 36" },
          { id: "fotografia/concerti/kaos/_MG_7451.jpg", alt: "Kaos — foto 37" },
          { id: "fotografia/concerti/kaos/_MG_7452.jpg", alt: "Kaos — foto 38" },
          { id: "fotografia/concerti/kaos/_MG_7456.jpg", alt: "Kaos — foto 39" },
          { id: "fotografia/concerti/kaos/_MG_7457.jpg", alt: "Kaos — foto 40" },
          { id: "fotografia/concerti/kaos/_MG_7459.jpg", alt: "Kaos — foto 41" },
          { id: "fotografia/concerti/kaos/_MG_7471.jpg", alt: "Kaos — foto 42" },
          { id: "fotografia/concerti/kaos/_MG_7473.jpg", alt: "Kaos — foto 43" },
          { id: "fotografia/concerti/kaos/_MG_7476.jpg", alt: "Kaos — foto 44" },
          { id: "fotografia/concerti/kaos/_MG_7479.jpg", alt: "Kaos — foto 45" },
          { id: "fotografia/concerti/kaos/_MG_7480.jpg", alt: "Kaos — foto 46" },
          { id: "fotografia/concerti/kaos/_MG_7483.jpg", alt: "Kaos — foto 47" },
          { id: "fotografia/concerti/kaos/_MG_7484.jpg", alt: "Kaos — foto 48" },
          { id: "fotografia/concerti/kaos/_MG_7489.jpg", alt: "Kaos — foto 49" },
          { id: "fotografia/concerti/kaos/_MG_7491.jpg", alt: "Kaos — foto 50" },
          { id: "fotografia/concerti/kaos/_MG_7492.jpg", alt: "Kaos — foto 51" },
          { id: "fotografia/concerti/kaos/_MG_7493.jpg", alt: "Kaos — foto 52" },
          { id: "fotografia/concerti/kaos/_MG_7498.jpg", alt: "Kaos — foto 53" },
          { id: "fotografia/concerti/kaos/_MG_7503.jpg", alt: "Kaos — foto 54" },
          { id: "fotografia/concerti/kaos/_MG_7516.jpg", alt: "Kaos — foto 55" },
          { id: "fotografia/concerti/kaos/_MG_7522.jpg", alt: "Kaos — foto 56" },
          { id: "fotografia/concerti/kaos/_MG_7523.jpg", alt: "Kaos — foto 57" },
          { id: "fotografia/concerti/kaos/_MG_7524.jpg", alt: "Kaos — foto 58" },
          { id: "fotografia/concerti/kaos/_MG_7528.jpg", alt: "Kaos — foto 59" },
          { id: "fotografia/concerti/kaos/_MG_7529.jpg", alt: "Kaos — foto 60" },
          { id: "fotografia/concerti/kaos/_MG_7530.jpg", alt: "Kaos — foto 61" },
          { id: "fotografia/concerti/kaos/_MG_7533.jpg", alt: "Kaos — foto 62" },
          { id: "fotografia/concerti/kaos/_MG_7538.jpg", alt: "Kaos — foto 63" },
          { id: "fotografia/concerti/kaos/_MG_7542.jpg", alt: "Kaos — foto 64" },
          { id: "fotografia/concerti/kaos/_MG_7549.jpg", alt: "Kaos — foto 65" },
          { id: "fotografia/concerti/kaos/_MG_7553.jpg", alt: "Kaos — foto 66" },
          { id: "fotografia/concerti/kaos/_MG_7558.jpg", alt: "Kaos — foto 67" },
          { id: "fotografia/concerti/kaos/_MG_7561.jpg", alt: "Kaos — foto 68" },
          { id: "fotografia/concerti/kaos/_MG_7572.jpg", alt: "Kaos — foto 69" },
          { id: "fotografia/concerti/kaos/_MG_7574.jpg", alt: "Kaos — foto 70" },
          { id: "fotografia/concerti/kaos/_MG_7583.jpg", alt: "Kaos — foto 71" },
          { id: "fotografia/concerti/kaos/_MG_7591.jpg", alt: "Kaos — foto 72" },
          { id: "fotografia/concerti/kaos/_MG_7592.jpg", alt: "Kaos — foto 73" },
          { id: "fotografia/concerti/kaos/_MG_7597.jpg", alt: "Kaos — foto 74" },
          { id: "fotografia/concerti/kaos/_MG_7602.jpg", alt: "Kaos — foto 75" },
          { id: "fotografia/concerti/kaos/_MG_7603.jpg", alt: "Kaos — foto 76" },
          { id: "fotografia/concerti/kaos/_MG_7606.jpg", alt: "Kaos — foto 77" },
          { id: "fotografia/concerti/kaos/_MG_7609.jpg", alt: "Kaos — foto 78" },
          { id: "fotografia/concerti/kaos/_MG_7611.jpg", alt: "Kaos — foto 79" },
          { id: "fotografia/concerti/kaos/_MG_7612.jpg", alt: "Kaos — foto 80" },
          { id: "fotografia/concerti/kaos/_MG_7614.jpg", alt: "Kaos — foto 81" },
          { id: "fotografia/concerti/kaos/_MG_7615.jpg", alt: "Kaos — foto 82" },
          { id: "fotografia/concerti/kaos/_MG_7618.jpg", alt: "Kaos — foto 83" },
          { id: "fotografia/concerti/kaos/_MG_7619.jpg", alt: "Kaos — foto 84" },
          { id: "fotografia/concerti/kaos/_MG_7622.jpg", alt: "Kaos — foto 85" },
          { id: "fotografia/concerti/kaos/_MG_7627.jpg", alt: "Kaos — foto 86" },
          { id: "fotografia/concerti/kaos/_MG_7628.jpg", alt: "Kaos — foto 87" },
          { id: "fotografia/concerti/kaos/_MG_7630.jpg", alt: "Kaos — foto 88" },
          { id: "fotografia/concerti/kaos/_MG_7633.jpg", alt: "Kaos — foto 89" },
          { id: "fotografia/concerti/kaos/_MG_7634.jpg", alt: "Kaos — foto 90" },
          { id: "fotografia/concerti/kaos/_MG_7636.jpg", alt: "Kaos — foto 91" },
          { id: "fotografia/concerti/kaos/_MG_7638.jpg", alt: "Kaos — foto 92" },
          { id: "fotografia/concerti/kaos/_MG_7640.jpg", alt: "Kaos — foto 93" },
          { id: "fotografia/concerti/kaos/_MG_7641.jpg", alt: "Kaos — foto 94" },
          { id: "fotografia/concerti/kaos/_MG_7642.jpg", alt: "Kaos — foto 95" },
          { id: "fotografia/concerti/kaos/_MG_7644.jpg", alt: "Kaos — foto 96" },
          { id: "fotografia/concerti/kaos/_MG_7647.jpg", alt: "Kaos — foto 97" },
          { id: "fotografia/concerti/kaos/_MG_7648.jpg", alt: "Kaos — foto 98" },
          { id: "fotografia/concerti/kaos/_MG_7655.jpg", alt: "Kaos — foto 99" },
          { id: "fotografia/concerti/kaos/_MG_7656.jpg", alt: "Kaos — foto 100" },
          { id: "fotografia/concerti/kaos/_MG_7658.jpg", alt: "Kaos — foto 101" },
          { id: "fotografia/concerti/kaos/_MG_7660.jpg", alt: "Kaos — foto 102" },
          { id: "fotografia/concerti/kaos/_MG_7664.jpg", alt: "Kaos — foto 103" },
          { id: "fotografia/concerti/kaos/_MG_7667.jpg", alt: "Kaos — foto 104" },
          { id: "fotografia/concerti/kaos/_MG_7668.jpg", alt: "Kaos — foto 105" },
          { id: "fotografia/concerti/kaos/_MG_7672.jpg", alt: "Kaos — foto 106" },
          { id: "fotografia/concerti/kaos/_MG_7676.jpg", alt: "Kaos — foto 107" },
          { id: "fotografia/concerti/kaos/_MG_7678.jpg", alt: "Kaos — foto 108" },
          { id: "fotografia/concerti/kaos/_MG_7682.jpg", alt: "Kaos — foto 109" },
          { id: "fotografia/concerti/kaos/_MG_7683.jpg", alt: "Kaos — foto 110" },
          { id: "fotografia/concerti/kaos/_MG_7686.jpg", alt: "Kaos — foto 111" },
          { id: "fotografia/concerti/kaos/_MG_7687.jpg", alt: "Kaos — foto 112" },
          { id: "fotografia/concerti/kaos/_MG_7688.jpg", alt: "Kaos — foto 113" },
          { id: "fotografia/concerti/kaos/_MG_7691.jpg", alt: "Kaos — foto 114" },
          { id: "fotografia/concerti/kaos/_MG_7700.jpg", alt: "Kaos — foto 115" },
          { id: "fotografia/concerti/kaos/_MG_7701.jpg", alt: "Kaos — foto 116" },
          { id: "fotografia/concerti/kaos/_MG_7702.jpg", alt: "Kaos — foto 117" },
          { id: "fotografia/concerti/kaos/_MG_7704.jpg", alt: "Kaos — foto 118" },
          { id: "fotografia/concerti/kaos/_MG_7707.jpg", alt: "Kaos — foto 119" },
          { id: "fotografia/concerti/kaos/_MG_7709.jpg", alt: "Kaos — foto 120" },
          { id: "fotografia/concerti/kaos/_MG_7713.jpg", alt: "Kaos — foto 121" },
          { id: "fotografia/concerti/kaos/_MG_7717.jpg", alt: "Kaos — foto 122" },
          { id: "fotografia/concerti/kaos/_MG_7726.jpg", alt: "Kaos — foto 123" },
          { id: "fotografia/concerti/kaos/_MG_7731.jpg", alt: "Kaos — foto 124" },
          { id: "fotografia/concerti/kaos/_MG_7733.jpg", alt: "Kaos — foto 125" },
          { id: "fotografia/concerti/kaos/_MG_7735.jpg", alt: "Kaos — foto 126" },
          { id: "fotografia/concerti/kaos/_MG_7739.jpg", alt: "Kaos — foto 127" },
          { id: "fotografia/concerti/kaos/_MG_7740.jpg", alt: "Kaos — foto 128" },
          { id: "fotografia/concerti/kaos/_MG_7741.jpg", alt: "Kaos — foto 129" },
          { id: "fotografia/concerti/kaos/_MG_7743.jpg", alt: "Kaos — foto 130" },
          { id: "fotografia/concerti/kaos/_MG_7744.jpg", alt: "Kaos — foto 131" },
          { id: "fotografia/concerti/kaos/_MG_7746.jpg", alt: "Kaos — foto 132" },
          { id: "fotografia/concerti/kaos/_MG_7753.jpg", alt: "Kaos — foto 133" },
          { id: "fotografia/concerti/kaos/_MG_7759.jpg", alt: "Kaos — foto 134" },
          { id: "fotografia/concerti/kaos/_MG_7761.jpg", alt: "Kaos — foto 135" },
          { id: "fotografia/concerti/kaos/_MG_7774.jpg", alt: "Kaos — foto 136" },
          { id: "fotografia/concerti/kaos/_MG_7789.jpg", alt: "Kaos — foto 137" },
          { id: "fotografia/concerti/kaos/_MG_7811.jpg", alt: "Kaos — foto 138" },
          { id: "fotografia/concerti/kaos/_MG_7816.jpg", alt: "Kaos — foto 139" },
          { id: "fotografia/concerti/kaos/_MG_7825.jpg", alt: "Kaos — foto 140" },
        ],
      },
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
