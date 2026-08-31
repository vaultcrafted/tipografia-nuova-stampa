import { useState, useRef, useEffect } from "react";
import { MarchioNS } from "@/components/MarchioNS";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, X, Menu } from "lucide-react";
import { categories } from "@/data/categories";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePreventivo } from "@/lib/preventivo";

/**
 * L'intestazione, appiccicata in alto su ogni pagina.
 *
 * IL PROBLEMA CHE AVEVA SUL TELEFONO
 * Il campo di ricerca stava nella riga in alto con `w-full`, insieme a menu,
 * marchio e tema. Su uno schermo da 360px (iPhone SE, molti Android) la riga
 * era larga 387px: **tutto il sito scorreva di lato**. Non e' un difetto
 * estetico, e' il genere di cosa per cui la gente chiude la pagina.
 *
 * COME E' RISOLTO
 * Sul telefono la ricerca e' un pulsante con la lente. Toccandolo si apre una
 * seconda riga sotto l'intestazione, larga tutto lo schermo, con il campo gia'
 * attivo. Da 1024px in su il campo torna dov'era, in linea. Non e' un
 * ripiego: cercare e' un'azione voluta, e su un telefono un campo di testo
 * sempre aperto ruba spazio a ogni schermata per servire un tocco su cento.
 *
 * AREE DA TOCCARE
 * Tutti i comandi sono 44x44 almeno — la misura sotto la quale un pollice
 * sbaglia bersaglio. Prima erano 36x36.
 */

/** Il pannello dei risultati, uguale per la ricerca in linea e per quella del telefono. */
function Risultati({
  risultati,
  onScegli,
}: {
  risultati: typeof categories;
  onScegli: (slug: string) => void;
}) {
  return (
    <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-white/15 bg-popover/95 shadow-2xl backdrop-blur-xl">
      <div className="max-h-[55vh] overflow-y-auto overscroll-contain">
        {risultati.length === 0 ? (
          <div className="px-4 py-6 font-mono-ui text-sm text-white/55">
            Nessun prodotto trovato
          </div>
        ) : (
          risultati.map((c) => (
            <button
              key={c.slug}
              onClick={() => onScegli(c.slug)}
              className="flex w-full items-center justify-between gap-4 border-b border-white/5 px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-white/5"
            >
              <span className="text-sm text-white">{c.name}</span>
              <span className="font-mono-ui text-[10px] uppercase tracking-widest text-white/55">
                {c.label}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export function AppHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  // Riga di ricerca del telefono: chiusa di default.
  const [ricercaMobile, setRicercaMobile] = useState(false);
  const apriPreventivo = usePreventivo();
  const headerRef = useRef<HTMLElement>(null);
  const rigaRef = useRef<HTMLDivElement>(null);
  const campoMobile = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
    setQuery("");
    setRicercaMobile(false);
  }, [pathname]);

  // Un solo controllo per tutte e due le ricerche: se il tocco cade fuori
  // dall'intestazione, si chiude tutto. Prima c'era un ref sul singolo campo,
  // e con due campi sarebbero serviti due controlli.
  useEffect(() => {
    const fuori = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setRicercaMobile(false);
      }
    };
    document.addEventListener("mousedown", fuori);
    return () => document.removeEventListener("mousedown", fuori);
  }, []);

  /**
   * L'intestazione dice quanto e' alta, in `--altezza-header`.
   *
   * Serve a tre punti che devono stare appena sotto di lei: il video della
   * testata, la colonna del menu e la colonna di famiglia nel catalogo. Prima
   * era il numero 73 scritto a mano in tre file: giusto sul desktop, sbagliato
   * sul telefono — dove l'intestazione e' piu' bassa — e restava una striscia
   * di fondo pagina fra la barra e il video.
   *
   * Si misura la sola prima riga, non tutta l'intestazione: quando si apre la
   * ricerca del telefono l'intestazione diventa piu' alta, ma quella e' una
   * cosa temporanea e non deve far saltare il video sotto.
   */
  useEffect(() => {
    const riga = rigaRef.current;
    if (!riga) return;
    const misura = () =>
      document.documentElement.style.setProperty(
        "--altezza-header",
        `${Math.round(riga.getBoundingClientRect().height)}px`,
      );
    misura();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", misura);
      return () => window.removeEventListener("resize", misura);
    }
    const ro = new ResizeObserver(misura);
    ro.observe(riga);
    return () => ro.disconnect();
  }, []);

  /**
   * Il marchio riporta alla home. Ma se la home e' gia' aperta il router non ha
   * niente da fare e il clic sembra rotto — proprio quando uno sta scorrendo a
   * meta' catalogo e vuole tornare in cima. Da un'altra pagina lascio navigare;
   * dalla home fermo il clic e riporto su.
   *
   * I clic con rotellina o con cmd/ctrl/shift non vanno intercettati: aprire in
   * una scheda nuova e' un comportamento del browser che non si toglie.
   */
  const tornaInCima = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const dolce = !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: dolce ? "smooth" : "auto" });
  };

  const q = query.trim().toLowerCase();
  const risultati = q
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.label.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q),
      )
    : categories;

  const scegli = (slug: string) => {
    navigate({ to: "/categoria/$slug", params: { slug } });
    setOpen(false);
    setQuery("");
    setRicercaMobile(false);
  };

  const cornice = (attivo: boolean) =>
    `flex items-center gap-2 rounded-md border bg-background/40 px-3 transition-all ${
      attivo ? "border-[var(--brand-red)] glow-red" : "border-white/20 hover:border-white/30"
    }`;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-white/10 bg-background/70 backdrop-blur-xl"
    >
      <div
        ref={rigaRef}
        className="flex items-center gap-1.5 px-3 py-2 sm:gap-3 sm:px-5 lg:px-8 lg:py-4"
      >
        <button
          onClick={onMenuToggle}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-white/80 hover:text-white lg:hidden"
          aria-label="Apri il menu del catalogo"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Marchio: quadratino NS + nome. Sul telefono il nome sparisce e resta
            il solo quadratino, quindi il collegamento avrebbe 36px di lato —
            troppo pochi per un pollice. Il padding negativo allarga l'area
            toccabile senza spostare niente di quello che si vede. */}
        <Link
          to="/"
          onClick={tornaInCima}
          aria-label={pathname === "/" ? "Torna in cima alla pagina" : "Vai alla home"}
          className="group/logo -mx-1 flex min-h-11 shrink-0 items-center gap-3 px-1 lg:mx-0 lg:min-h-0 lg:px-0"
        >
          <MarchioNS className="h-9 w-9 shrink-0 text-white transition-colors duration-300 group-hover/logo:text-[var(--brand-red)]" />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-lg tracking-wide text-white lg:text-xl">
              Tipografia Nuova Stampa
            </span>
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-white/50">
              Stampa professionale per la tua azienda
            </span>
          </div>
        </Link>

        <div className="flex-1" />

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Link
            to="/chi-siamo"
            className="occhiello hidden min-h-11 shrink-0 items-center px-1 text-white/55 transition-colors hover:text-white sm:inline-flex lg:min-h-0 lg:px-0"
          >
            Chi siamo
          </Link>

          <ThemeToggle />

          {/* Telefono: la lente apre la riga sotto. Da lg in su questo pulsante
              non c'e', perche' li' il campo e' gia' aperto. */}
          <button
            type="button"
            onClick={() => {
              const prossimo = !ricercaMobile;
              setRicercaMobile(prossimo);
              setOpen(false);
              if (prossimo) setTimeout(() => campoMobile.current?.focus(), 60);
            }}
            aria-label={ricercaMobile ? "Chiudi la ricerca" : "Cerca un prodotto"}
            aria-expanded={ricercaMobile}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white lg:hidden"
          >
            {ricercaMobile ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {/* Ricerca in linea, solo da 1024px in su. */}
          <div className="relative hidden w-full max-w-md lg:block">
            <div className={`${cornice(open)} py-2`}>
              <Search className="h-4 w-4 shrink-0 text-white/50" />
              <input
                type="search"
                aria-label="Cerca un prodotto nel catalogo"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Cerca un prodotto..."
                className="min-w-0 flex-1 bg-transparent font-mono-ui text-sm text-white outline-none placeholder:text-white/55"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="shrink-0 text-white/50 hover:text-white"
                  aria-label="Pulisci la ricerca"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {open && <Risultati risultati={risultati} onScegli={scegli} />}
          </div>

          {/* Il preventivo e' l'azione che il sito deve far compiere: da qui non
              sparisce mai, perche' l'intestazione e' appiccicata in alto. Sul
              telefono non c'e' — la' c'e' gia' la barra fissa in basso, e due
              pulsanti uguali sullo stesso schermo sono solo ingombro. */}
          <button
            type="button"
            onClick={() => apriPreventivo()}
            className="hidden shrink-0 rounded-sm px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-transform hover:scale-[1.03] lg:inline-flex"
            style={{ background: "var(--brand-red)" }}
          >
            Preventivo
          </button>
        </div>
      </div>

      {/* Seconda riga del telefono: c'e' solo quando serve. */}
      {ricercaMobile && (
        <div className="relative px-3 pb-3 lg:hidden">
          <div className={`${cornice(true)} py-3`}>
            <Search className="h-5 w-5 shrink-0 text-white/50" />
            <input
              ref={campoMobile}
              type="search"
              aria-label="Cerca un prodotto nel catalogo"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Cerca un prodotto..."
              className="min-w-0 flex-1 bg-transparent font-mono-ui text-base text-white outline-none placeholder:text-white/55"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="grid h-8 w-8 shrink-0 place-items-center text-white/50"
                aria-label="Pulisci la ricerca"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {open && (
            <div className="relative">
              <Risultati risultati={risultati} onScegli={scegli} />
            </div>
          )}
        </div>
      )}
    </header>
  );
}
