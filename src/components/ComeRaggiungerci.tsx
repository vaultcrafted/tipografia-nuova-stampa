import { MapPin, Navigation, Phone } from "lucide-react";

const INDIRIZZO = "Via Martiri della Libertà, 65 · 13046 Livorno Ferraris (VC)";

/** Apre le indicazioni stradali: sul telefono passa direttamente all'app mappe. */
const INDICAZIONI =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent("Tipografia Nuova Stampa, Via Martiri della Libertà 65, 13046 Livorno Ferraris VC");

/**
 * Mappa incorporata di Google. `loading="lazy"` è deliberato: l'iframe carica
 * gli script di Google solo quando l'utente ci scorre sopra, così la pagina
 * non paga quel peso all'apertura.
 */
const MAPPA =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2807.3190966675743!2d8.080187477389815!3d45.28177324559042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4787d2fa026bc619%3A0x331e6f5bd1a5530b!2sTipografia%20Nuova%20Stampa!5e0!3m2!1sit!2sit!4v1788191132788!5m2!1sit!2sit";

export function ComeRaggiungerci() {
  return (
    <section className="mt-16 lg:mt-24">
      <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">
        ◆ Come raggiungerci
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-8">
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-3xl lg:text-4xl text-white leading-tight">
            Siamo in centro a<br />Livorno Ferraris
          </h2>

          <div className="flex items-start gap-3 text-sm text-white/70">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--brand-red)" }} aria-hidden="true" />
            <span>{INDIRIZZO}</span>
          </div>

          <p className="text-sm text-white/60 leading-relaxed">
            Parcheggio libero davanti all'ingresso. Se porti un file da stampare
            o devi ritirare un lavoro, passa pure senza appuntamento negli orari
            di apertura.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={INDICAZIONI}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.03]"
              style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Indicazioni stradali
            </a>
            <a
              href="tel:+393332876277"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-widest text-white/70 transition-colors hover:text-white hover:border-white/40"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Chiamaci
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10">
          <iframe
            src={MAPPA}
            title="Mappa: Tipografia Nuova Stampa, Livorno Ferraris"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="block h-[320px] w-full border-0 lg:h-full lg:min-h-[380px]"
          />
        </div>
      </div>
    </section>
  );
}
