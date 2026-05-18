export type Category = {
  slug: string;
  name: string;
  label: string;
  tagline: string;
  description: string;
  formats: string[];
  grammature: string[];
  finiture: string[];
  tempi: string;
  videoUrl?: string;
};

export const categories: Category[] = [
  {
    slug: "biglietti-da-visita",
    name: "Biglietti da visita",
    label: "carta",
    tagline: "La prima stretta di mano, in tasca.",
    description:
      "Biglietti da visita stampati in offset e digitale ad alta fedeltà. Carte premium, finiture tattili e accoppiature personalizzate per rappresentare al meglio la tua identità professionale.",
    formats: ["8,5 × 5,5 cm (standard)", "9 × 6 cm", "6 × 6 cm", "Formato personalizzato"],
    grammature: ["300 g/m²"],
    finiture: [],
    tempi: "10–12 giorni lavorativi / 5–7 giorni lavorativi / 2–3 giorni lavorativi",
  },
  {
    slug: "volantini",
    name: "Volantini",
    label: "stampa",
    tagline: "Comunicare in modo diretto, senza disperdere il messaggio.",
    description:
      "Volantini promozionali stampati a colori su carta patinata o naturale. Tirature da poche centinaia a decine di migliaia, sempre con la stessa cura del dettaglio.",
    formats: ["A6 (105 × 148 mm)", "A5 (148 × 210 mm)", "A4 (210 × 297 mm)", "DL (99 × 210 mm)"],
    grammature: ["115 g/m²", "135 g/m²", "170 g/m²", "250 g/m²"],
    finiture: ["Patinata lucida", "Patinata opaca", "Carta uso mano", "Verniciatura protettiva"],
    tempi: "2–4 giorni lavorativi",
  },
  {
    slug: "pieghevoli-brochure",
    name: "Pieghevoli / Brochure",
    label: "stampa",
    tagline: "Architetture di carta che raccontano un brand.",
    description:
      "Pieghevoli a due, tre o più ante e brochure rilegate per aziende, hotel, ristoranti e studi professionali. Cordonatura precisa, piega impeccabile.",
    formats: ["A4 a 2 ante", "A4 a 3 ante", "A3 a 4 ante", "Quadrato 200 × 200 mm"],
    grammature: ["135 g/m²", "170 g/m²", "200 g/m²", "250 g/m²"],
    finiture: ["Piega a portafoglio", "Piega a fisarmonica", "Piega a croce", "Plastificazione soft-touch"],
    tempi: "4–6 giorni lavorativi",
  },
  {
    slug: "locandine-poster",
    name: "Locandine / Poster",
    label: "grande formato",
    tagline: "Presenza scenica per eventi, mostre, vetrine.",
    description:
      "Locandine e poster di grande formato per eventi, concerti, mostre, esposizioni commerciali. Colori saturi, neri profondi, finiture professionali.",
    formats: ["A3 (297 × 420 mm)", "70 × 100 cm", "100 × 140 cm", "Formati custom fino a 150 cm"],
    grammature: ["150 g/m²", "200 g/m²", "250 g/m²", "Carta blueback per affissione"],
    finiture: ["Patinata opaca", "Patinata lucida", "Carta riciclata", "Resistenza UV indoor / outdoor"],
    tempi: "3–5 giorni lavorativi",
  },
  {
    slug: "buste-carta-intestata",
    name: "Buste e carta intestata",
    label: "ufficio",
    tagline: "L'identità del tuo studio, anche in corrispondenza.",
    description:
      "Carta intestata, buste personalizzate e blocchi notes per studi professionali e aziende. Stampa offset di precisione su carte certificate.",
    formats: ["A4 carta intestata", "Busta DL 110 × 220 mm", "Busta americana", "Busta a sacco 23 × 33 cm"],
    grammature: ["90 g/m²", "100 g/m²", "120 g/m²"],
    finiture: ["Senza finestra", "Con finestra", "Strip adesivo", "Stampa interna anti-trasparenza"],
    tempi: "4–6 giorni lavorativi",
  },
  {
    slug: "striscioni-banner",
    name: "Striscioni / Banner",
    label: "grande formato",
    tagline: "Visibilità outdoor, ad alto impatto.",
    description:
      "Striscioni in PVC, banner roll-up, mesh per facciate e backdrop per eventi. Stampa eco-solvente ad alta risoluzione e finiture per ogni esigenza di affissione.",
    formats: ["100 × 200 cm", "200 × 300 cm", "Formati custom fino a 5 m", "Roll-up 85 × 200 cm"],
    grammature: ["PVC 440 g/m²", "PVC 510 g/m²", "Mesh microforato", "Tessuto poliestere"],
    finiture: ["Occhielli in metallo", "Bordatura rinforzata", "Tasche per asta", "Velcro perimetrale"],
    tempi: "4–7 giorni lavorativi",
  },
  {
    slug: "abbigliamento-dtf",
    name: "Abbigliamento stampato",
    label: "DTF",
    tagline: "Capi personalizzati con tecnologia Direct-to-Film.",
    description:
      "Stampa DTF su t-shirt, felpe, polo, cappellini e divise da lavoro. Resa fotografica, colori brillanti e resistenza ai lavaggi industriali.",
    formats: ["T-shirt taglie XS–5XL", "Felpe con e senza cappuccio", "Polo, camicie, divise", "Capi tecnici e sportivi"],
    grammature: ["Cotone 160 g/m²", "Cotone pettinato 190 g/m²", "Felpa 280 g/m²", "Tessuti tecnici"],
    finiture: ["DTF a colori illimitati", "Effetto morbido al tatto", "Resistenza fino a 60°C", "Posizionamento custom"],
    tempi: "5–8 giorni lavorativi",
  },
  {
    slug: "stampa-su-legno",
    name: "Stampa su legno",
    label: "UV",
    tagline: "Materia, calore e dettaglio, in un unico oggetto.",
    description:
      "Stampa UV diretta su tavole di legno naturale per insegne, quadri, targhe e packaging premium. Il colore si fonde con la venatura.",
    formats: ["Targhe 20 × 30 cm", "Quadri 40 × 60 cm", "Insegne fino a 120 × 240 cm", "Spessori da 5 a 30 mm"],
    grammature: ["Compensato betulla", "MDF impiallacciato", "Multistrato marino", "Legno massello"],
    finiture: ["Bordi tagliati a laser", "Verniciatura trasparente protettiva", "Fori per sospensione", "Smussi e angoli arrotondati"],
    tempi: "5–7 giorni lavorativi",
  },
  {
    slug: "libri-spirale",
    name: "Libri rilegati a spirale",
    label: "rilegatura",
    tagline: "Manuali, ricettari, agende — che si aprono e restano aperti.",
    description:
      "Rilegatura a spirale metallica o plastica per manuali tecnici, ricettari, quaderni e agende personalizzate. Apertura a 360° per consultazione comoda.",
    formats: ["A6, A5, A4", "Quadrato 200 × 200 mm", "Orizzontale 210 × 148 mm", "Formati custom"],
    grammature: ["Copertina 300 g/m²", "Interno 90–135 g/m²", "Separatori in cartoncino", "Pagine plastificate"],
    finiture: ["Spirale metallica nera / bianca", "Spirale plastica colorata", "Copertina rigida", "Fustellatura indice"],
    tempi: "6–9 giorni lavorativi",
  },
  {
    slug: "plastificazione",
    name: "Plastificazione",
    label: "finitura",
    tagline: "Protezione e finitura per ogni stampato.",
    description:
      "Servizio di plastificazione lucida, opaca o soft-touch per copertine, menu, schede tecniche e materiale espositivo. Trattamento professionale anche su lavori esterni.",
    formats: ["Da A6 ad A0", "Spessori film 80–250 micron", "Lavorazioni custom", "Bobine per grandi tirature"],
    grammature: ["Film lucido 80μ", "Film opaco 125μ", "Soft-touch 150μ", "Antigraffio 250μ"],
    finiture: ["Plastificazione singola", "Doppia (fronte/retro)", "A caldo o a freddo", "Effetto vellutato"],
    tempi: "1–3 giorni lavorativi",
  },
  {
    slug: "stampa-su-cuscini",
    name: "Stampa su cuscini",
    label: "home",
    tagline: "Foto, illustrazioni e brand su tessuto morbido.",
    description:
      "Cuscini personalizzati con stampa fotografica ad alta definizione. Ideali per regali, arredo, gadget aziendali e progetti home-decor.",
    formats: ["40 × 40 cm", "50 × 50 cm", "30 × 50 cm rettangolare", "Forme custom"],
    grammature: ["Federa in poliestere", "Federa in cotone canvas", "Imbottitura in fibra cava", "Rivestimento sfoderabile"],
    finiture: ["Stampa fronte / retro", "Cerniera nascosta", "Bordo in passamaneria", "Etichetta personalizzata"],
    tempi: "5–7 giorni lavorativi",
  },
  {
    slug: "stampa-puzzle",
    name: "Stampa puzzle",
    label: "gift",
    tagline: "Un'immagine che si compone, pezzo dopo pezzo.",
    description:
      "Puzzle personalizzati con la tua immagine, ideali per regali, bomboniere, gadget aziendali ed eventi. Cartone rigido, taglio preciso, scatola inclusa.",
    formats: ["A4 — 96 pezzi", "A3 — 252 pezzi", "40 × 50 cm — 500 pezzi", "Custom fino a 1000 pezzi"],
    grammature: ["Cartone rigido 2 mm", "Stampa fotografica laminata", "Retro nero opaco", "Pezzi ad incastro preciso"],
    finiture: ["Scatola personalizzata", "Sacchetto in tessuto", "Confezione regalo", "Etichetta numerata"],
    tempi: "5–8 giorni lavorativi",
  },
  {
    slug: "libretti-pinzati",
    name: "Libretti pinzati",
    label: "rilegatura",
    tagline: "Cataloghi, programmi, fanzine — leggeri e ordinati.",
    description:
      "Libretti con punto metallico a sella per cataloghi, programmi di eventi, fanzine e brochure di poche pagine. Stampa quadricromia su carte selezionate.",
    formats: ["A6, A5, A4", "Quadrato 200 × 200 mm", "Da 8 a 64 pagine", "Formati custom"],
    grammature: ["Copertina 250 g/m²", "Interno 115–170 g/m²", "Carta naturale o patinata", "Carte certificate FSC"],
    finiture: ["2 punti metallici", "Punto omega per archiviazione", "Cordonatura copertina", "Plastificazione copertina"],
    tempi: "4–6 giorni lavorativi",
  },
  {
    slug: "sticker-adesivi",
    name: "Sticker e adesivi",
    label: "fustellato",
    tagline: "Adesivi sagomati, vetrofanie, etichette.",
    description:
      "Stampa e fustellatura di adesivi in vinile, PVC e carta. Etichette per packaging, sticker brand, vetrofanie per negozi e adesivi per veicoli.",
    formats: ["Da 2 × 2 cm a 100 × 200 cm", "Singoli, in fogli o bobina", "Sagome custom", "Trasparenti o bianchi"],
    grammature: ["Vinile monomerico 80μ", "Vinile polimerico 100μ", "PVC trasparente", "Carta adesiva removibile"],
    finiture: ["Fustellatura sagomata", "Plastificazione antigraffio", "Resistenza UV outdoor", "Adesivo permanente o removibile"],
    tempi: "3–5 giorni lavorativi",
  },
  {
    slug: "gadget-merchandising",
    name: "Gadget / Merchandising",
    label: "promo",
    tagline: "Oggetti brandizzati che restano in mano e nella memoria.",
    description:
      "Tazze, borracce, penne, chiavette USB, totebag, taccuini e gadget personalizzati per eventi aziendali, fiere e merchandising. Stampa serigrafica, tampografica e digitale.",
    formats: ["Tazze, mug, thermos", "Penne, matite, evidenziatori", "Totebag, zaini, marsupi", "USB, powerbank, accessori tech"],
    grammature: ["Materiali certificati", "Opzioni eco-friendly", "Confezioni in cartone", "Personalizzazione singola unità"],
    finiture: ["Stampa serigrafica", "Tampografia", "Incisione laser", "Ricamo su tessuto"],
    tempi: "7–10 giorni lavorativi",
  },
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
