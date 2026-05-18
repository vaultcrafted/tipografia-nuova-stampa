import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo — Tipografia Nuova Stampa" },
      {
        name: "description",
        content:
          "Dal 1995 trasformiamo idee in stampa. Scopri chi siamo, cosa facciamo e il nostro approccio al lavoro.",
      },
    ],
    links: [{ rel: "canonical", href: "https://tipografia-nuova-stampa.lovable.app/chi-siamo" }],
  }),
  component: ChiSiamoPage,
});

function ChiSiamoPage() {
  return (
    <div className="px-6 sm:px-10 lg:px-16 pb-24">
      <section className="pt-12 lg:pt-16 pb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Home
        </Link>

        <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
          ◢ Dal 1995
        </div>
        <h1 className="font-display text-white text-[14vw] sm:text-[9vw] lg:text-[6.5vw] leading-[0.92] tracking-tight mb-8">
          Chi siamo
        </h1>
        <img
          src="/Logo-cambio.svg"
          alt="Tipografia Nuova Stampa"
          className="h-20 lg:h-28 w-auto mb-12 dark:invert-0 invert"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-6 text-white/70 leading-relaxed">
            <p>
              La tipografia nasce nel <strong className="text-white">1995</strong>. Dal{" "}
              <strong className="text-white">2024</strong> è stata presa in gestione da Stefano
              Giunipero, che ne ha rivoluzionato approccio, servizi e tecnologie, portando
              una visione più moderna e completa della stampa professionale.
            </p>
            <p>
              Da anni trasformiamo idee in stampa, dando forma a progetti che devono
              distinguersi davvero. Siamo una tipografia che unisce esperienza artigianale,
              attenzione ai dettagli e tecnologie moderne per offrire un servizio completo,
              veloce e curato in ogni fase.
            </p>
            <p>
              Lavoriamo ogni giorno con aziende, locali, brand ed eventi, seguendo il cliente
              dalla progettazione grafica fino al prodotto finito. Dalla piccola tiratura alle
              produzioni personalizzate, il nostro obiettivo è sempre lo stesso: creare
              materiali che abbiano impatto visivo, qualità concreta e una forte identità.
            </p>
            <p>
              Negli anni abbiamo ampliato i nostri servizi integrando stampa digitale
              professionale, grande formato, packaging personalizzato, gadget, incisione laser
              e soluzioni creative su misura. Crediamo che oggi non basti "stampare bene":
              serve aiutare i clienti a comunicare meglio, distinguersi e valorizzare il
              proprio brand.
            </p>
            <p>
              Ogni progetto viene seguito con attenzione reale, senza lavorazioni
              standardizzate o approcci superficiali. Per noi contano la precisione, le
              tempistiche rispettate e il rapporto diretto con chi si affida al nostro lavoro.
            </p>
            <p>
              Siamo il partner ideale per chi cerca una tipografia affidabile, moderna e
              capace di trasformare un'idea in qualcosa di concreto, professionale e
              memorabile.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-md border border-white/10 bg-card/40 backdrop-blur-sm p-6">
              <div
                className="font-mono-ui text-[10px] uppercase tracking-[0.2em] mb-4"
                style={{ color: "var(--brand-red)" }}
              >
                Cosa facciamo
              </div>
              <ul className="space-y-3">
                {[
                  "Stampa digitale professionale",
                  "Grande formato e banner",
                  "Packaging ed etichette personalizzate",
                  "Brochure, flyer e materiale promozionale",
                  "Gadget e merchandising",
                  "Incisione e personalizzazione laser",
                  "Supporto grafico e creativo",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-sm text-white/80 border-b border-white/5 pb-3 last:border-0 flex items-start gap-2"
                  >
                    <span style={{ color: "var(--brand-red)" }}>◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-white/10 bg-card/40 backdrop-blur-sm p-6">
              <div
                className="font-mono-ui text-[10px] uppercase tracking-[0.2em] mb-4"
                style={{ color: "var(--brand-red)" }}
              >
                Il nostro approccio
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                Qualità, velocità e attenzione ai dettagli. Perché ogni stampa rappresenta
                il tuo nome, e deve farlo nel modo giusto.
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-white/70 flex items-start gap-2">
                  <span style={{ color: "var(--brand-red)" }}>→</span>
                  Un solo interlocutore: il titolare segue ogni progetto personalmente
                </li>
                <li className="text-sm text-white/70 flex items-start gap-2">
                  <span style={{ color: "var(--brand-red)" }}>→</span>
                  Supporto a 360°, dalla grafica al prodotto finito
                </li>
                <li className="text-sm text-white/70 flex items-start gap-2">
                  <span style={{ color: "var(--brand-red)" }}>→</span>
                  Nessun approccio standardizzato: ogni cliente è unico
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
