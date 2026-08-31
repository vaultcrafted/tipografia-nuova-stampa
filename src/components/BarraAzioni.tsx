import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * La barra fissa in basso sul telefono, e il bottone WhatsApp sul desktop.
 *
 * PERCHE' ESISTE
 * Il sito deve far arrivare richieste di preventivo. Prima l'unico modo di
 * chiederne uno era arrivare in fondo alla home o aprire una scheda prodotto:
 * su un telefono vuol dire parecchi centimetri di pollice, e chi si e' convinto
 * a meta' pagina non aveva niente da toccare. C'era solo un bottone WhatsApp
 * che galleggiava, e per giunta finiva sopra al testo.
 *
 * ORA sul telefono c'e' una barra fissa con le due azioni vere — preventivo e
 * WhatsApp — sempre a portata di pollice. Sul desktop resta il solo bottone
 * WhatsApp: li' il preventivo e' gia' raggiungibile in tre punti della pagina e
 * una barra fissa ruberebbe spazio senza aggiungere niente.
 *
 * La barra compare solo dopo aver superato la testata: sulla prima schermata
 * c'e' gia' il video e coprirlo con una barra sarebbe un autogol.
 */

const WHATSAPP = "https://wa.me/393332876277";

function IconaWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.32.13-.328.244-.658.244-1.018 0-.092 0-.187-.058-.262-.158-.232-1.476-.886-1.65-.886zm-2.74 7.467c-1.69 0-3.354-.46-4.812-1.318l-.345-.205-3.557.917.945-3.473-.231-.36C7.428 18.65 6.94 16.917 6.94 15.116c0-5.198 4.232-9.43 9.444-9.43 5.198 0 9.444 4.232 9.444 9.444s-4.246 9.444-9.444 9.542zm0-20.6C9.96 4.07 4.704 9.327 4.704 15.745c0 2.063.546 4.07 1.578 5.852L4.5 27.5l6.073-1.596A11.46 11.46 0 0 0 16.37 27.5c6.345 0 11.602-5.257 11.7-11.7 0-3.124-1.232-6.05-3.41-8.243a11.62 11.62 0 0 0-8.29-3.498z" />
    </svg>
  );
}

export function BarraAzioni({ onPreventivo }: { onPreventivo: () => void }) {
  const [visibile, setVisibile] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const inHome = pathname === "/";

  /**
   * IN HOME la barra aspetta la prima schermata: sopra c'e' il video della
   * testata, ed e' l'unica cosa che deve occupare quello spazio.
   *
   * ALTROVE c'e' subito. Su una scheda prodotto il pulsante in alto e' solo da
   * lg in su (per non raddoppiare la barra), quindi finche' la barra restava
   * nascosta chi apriva un prodotto da Google si trovava a leggere descrizione,
   * formati e grammature **senza niente da toccare per chiedere il prezzo**.
   * Su un telefono e' il momento in cui l'intenzione e' piu' alta.
   */
  useEffect(() => {
    if (!inHome) {
      setVisibile(true);
      return;
    }
    const controlla = () => setVisibile(window.scrollY > window.innerHeight * 0.6);
    controlla();
    window.addEventListener("scroll", controlla, { passive: true });
    return () => window.removeEventListener("scroll", controlla);
  }, [inHome]);

  return (
    <>
      {/* Telefono: barra fissa in basso. `pb-[env(safe-area-inset-bottom)]`
          perche' sugli iPhone recenti la striscia di sistema mangerebbe i
          pulsanti. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[100] border-t border-white/12 bg-background/95 backdrop-blur-xl transition-transform duration-300 md:hidden ${
          visibile ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch gap-2 p-3">
          <button
            type="button"
            onClick={onPreventivo}
            className="flex-1 rounded-sm px-5 py-3.5 text-sm font-semibold uppercase tracking-widest text-white"
            style={{ background: "var(--brand-red)" }}
          >
            Richiedi preventivo
          </button>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Scrivici su WhatsApp"
            className="grid w-[52px] shrink-0 place-items-center rounded-sm text-white"
            style={{ background: "#25D366" }}
          >
            <IconaWhatsApp className="h-6 w-6" />
          </a>
        </div>
      </div>

      {/* Desktop: solo WhatsApp, in basso a destra. */}
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Scrivici su WhatsApp"
        title="Scrivici su WhatsApp"
        className="fixed bottom-6 right-6 z-[100] hidden h-13 w-13 place-items-center rounded-full text-white transition-transform duration-200 hover:scale-110 active:scale-95 md:grid"
        style={{
          height: 52,
          width: 52,
          backgroundColor: "#25D366",
          boxShadow: "0 8px 24px rgba(37,211,102,0.4)",
        }}
      >
        <IconaWhatsApp className="h-6 w-6" />
      </a>
    </>
  );
}
