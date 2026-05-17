import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { categories, type Category } from "@/data/categories";

export function QuoteFormModal({
  open,
  onClose,
  category,
}: {
  open: boolean;
  onClose: () => void;
  category?: Category;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState(category?.slug ?? categories[0].slug);

  useEffect(() => {
    if (category) setSelected(category.slug);
  }, [category]);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputCls =
    "w-full rounded-md border border-white/20 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[var(--brand-red)] focus:glow-red";

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/15 bg-[oklch(0.14_0.025_250)] p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Chiudi"
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">
              ✓ Conferma
            </div>
            <h3 className="font-display text-3xl text-white mb-3">
              Richiesta inviata
            </h3>
            <p className="text-white/70 max-w-md mx-auto">
              Ti contatteremo entro 24 ore con un preventivo personalizzato.
              Grazie per averci scelto.
            </p>
            <button
              onClick={onClose}
              className="mt-8 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white transition-all"
              style={{ background: "var(--brand-red)" }}
            >
              Chiudi
            </button>
          </div>
        ) : (
          <>
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
              Preventivo · gratuito
            </div>
            <h3 className="font-display text-3xl sm:text-4xl text-white mb-1">
              Richiedi un preventivo
            </h3>
            <p className="text-sm text-white/60 mb-6">
              Risposta garantita entro 24 ore lavorative.
            </p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">
                  Nome e cognome *
                </label>
                <input required type="text" className={inputCls} placeholder="Mario Rossi" />
              </div>

              <div>
                <label className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">
                  Email *
                </label>
                <input required type="email" className={inputCls} placeholder="mario@esempio.it" />
              </div>

              <div>
                <label className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">
                  Telefono
                </label>
                <input type="tel" className={inputCls} placeholder="+39 ..." />
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">
                  Categoria prodotto
                </label>
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className={inputCls}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug} className="bg-black">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">
                  Formato desiderato
                </label>
                <input type="text" className={inputCls} placeholder="es. A5, 85×55mm..." />
              </div>

              <div>
                <label className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">
                  Quantità
                </label>
                <input type="number" min={1} className={inputCls} placeholder="500" />
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">
                  Finitura desiderata
                </label>
                <input type="text" className={inputCls} placeholder="es. plastificazione opaca, verniciatura UV..." />
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">
                  Allegato (opzionale)
                </label>
                <input
                  type="file"
                  className="w-full rounded-md border border-white/20 bg-black/40 px-3 py-2 text-sm text-white/70 file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-mono file:uppercase file:tracking-widest file:text-white/80 hover:file:bg-white/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">
                  Note aggiuntive
                </label>
                <textarea rows={4} className={inputCls} placeholder="Scrivi qui ogni dettaglio utile..." />
              </div>

              <button
                type="submit"
                className="sm:col-span-2 mt-2 inline-flex items-center justify-center rounded-md px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.01]"
                style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
              >
                Invia richiesta
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
