import { useEffect, useId, useRef, useState } from "react";
import { X, Paperclip, Loader2, FileCheck } from "lucide-react";
import emailjs from "@emailjs/browser";
import { categories, type Category } from "@/data/categories";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const ACCEPTED = ".pdf,.ai,.eps,.jpg,.jpeg,.png,.webp,.zip,.psd,.indd";
const MAX_MB = 50;

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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState(category?.slug ?? categories[0].slug);
  const [file, setFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileUrlInputRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const fid = (n: string) => `${uid}-${n}`;

  useEffect(() => {
    if (category) setSelected(category.slug);
  }, [category]);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setError(null);
      setFile(null);
      setFileUrl(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`Il file supera i ${MAX_MB}MB. Comprimi o usa WeTransfer.`);
      return;
    }
    setFile(f);
    setFileUrl(null);
    setFileUploading(true);
    setError(null);

    try {
      // Genera nome file univoco
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "bin";
      const timestamp = Date.now();
      const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `preventivi/${timestamp}_${safeName}`;

      // Ottieni presigned URL
      const res = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, contentType: f.type || "application/octet-stream", public: true }),
      });
      const { url, publicUrl } = await res.json() as { url: string; publicUrl: string };

      // Carica su R2
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": f.type || "application/octet-stream" },
        body: f,
      });

      setFileUrl(publicUrl);
    } catch {
      setError("Errore nel caricamento del file. Riprova.");
      setFile(null);
    } finally {
      setFileUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    if (file && !fileUrl) { setError("Attendi il caricamento del file."); return; }
    setSending(true);
    setError(null);
    try {
      // Aggiorna il campo nascosto con l'URL del file
      if (fileUrlInputRef.current) {
        fileUrlInputRef.current.value = fileUrl ?? "Nessun file allegato";
      }
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setSubmitted(true);
    } catch {
      setError("Errore nell'invio. Riprova o contattaci direttamente.");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full rounded-md border border-white/20 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[var(--brand-red)] focus:glow-red";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/15 bg-[oklch(0.14_0.025_250)] p-6 sm:p-8 shadow-2xl">
        <button onClick={onClose} aria-label="Chiudi" className="absolute top-4 right-4 p-2 text-white/60 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">✓ Conferma</div>
            <h3 className="font-display text-3xl text-white mb-3">Richiesta inviata</h3>
            <p className="text-white/70 max-w-md mx-auto">
              Ti contatteremo entro 24 ore con un preventivo personalizzato. Grazie per averci scelto.
            </p>
            <button onClick={onClose}
              className="mt-8 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white transition-all"
              style={{ background: "var(--brand-red)" }}>
              Chiudi
            </button>
          </div>
        ) : (
          <>
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
              Preventivo · gratuito
            </div>
            <h3 className="font-display text-3xl sm:text-4xl text-white mb-1">Richiedi un preventivo</h3>
            <p className="text-sm text-white/60 mb-6">Risposta garantita entro 24 ore lavorative.</p>

            <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor={fid("name")} className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">Nome e cognome *</label>
                <input id={fid("name")} name="name" required type="text" className={inputCls} placeholder="Mario Rossi" />
              </div>

              <div>
                <label htmlFor={fid("email")} className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">Email *</label>
                <input id={fid("email")} name="email" required type="email" className={inputCls} placeholder="mario@esempio.it" />
              </div>

              <div>
                <label htmlFor={fid("tel")} className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">Telefono</label>
                <input id={fid("tel")} name="phone" type="tel" className={inputCls} placeholder="+39 ..." />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={fid("cat")} className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">Categoria prodotto</label>
                <select id={fid("cat")} name="category" value={selected} onChange={(e) => setSelected(e.target.value)} className={inputCls}>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name} className="bg-black">{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={fid("fmt")} className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">Formato desiderato</label>
                <input id={fid("fmt")} name="format" type="text" className={inputCls} placeholder="es. A5, 85×55mm..." />
              </div>

              <div>
                <label htmlFor={fid("qty")} className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">Quantità</label>
                <input id={fid("qty")} name="quantity" type="number" min={1} className={inputCls} placeholder="500" />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={fid("fin")} className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">Finitura desiderata</label>
                <input id={fid("fin")} name="finishing" type="text" className={inputCls} placeholder="es. plastificazione opaca, verniciatura UV..." />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={fid("notes")} className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">Note aggiuntive</label>
                <textarea id={fid("notes")} name="notes" rows={3} className={inputCls} placeholder="Scrivi qui ogni dettaglio utile..." />
              </div>

              {/* File upload */}
              <div className="sm:col-span-2">
                <label className="font-mono-ui text-[10px] uppercase tracking-widest text-white/50 mb-1.5 block">
                  Allega file grafico (opzionale)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex items-center gap-3 rounded-md border px-4 py-3 cursor-pointer transition-colors ${
                    fileUrl
                      ? "border-green-500/50 bg-green-500/10"
                      : "border-white/20 bg-black/40 hover:border-[var(--brand-red)]/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED}
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={fileUploading}
                  />
                  {fileUploading ? (
                    <Loader2 className="h-4 w-4 text-white/50 animate-spin shrink-0" />
                  ) : fileUrl ? (
                    <FileCheck className="h-4 w-4 text-green-400 shrink-0" />
                  ) : (
                    <Paperclip className="h-4 w-4 text-white/40 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    {fileUploading ? (
                      <span className="text-sm text-white/50">Caricamento in corso...</span>
                    ) : fileUrl ? (
                      <span className="text-sm text-green-400 truncate">{file?.name}</span>
                    ) : (
                      <span className="text-sm text-white/40">
                        PDF, AI, EPS, JPG, PNG, ZIP, PSD — max {MAX_MB}MB
                      </span>
                    )}
                  </div>
                  {fileUrl && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); setFileUrl(null); }}
                      className="shrink-0 text-white/30 hover:text-white/70 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="mt-1 font-mono-ui text-[9px] text-white/25 uppercase tracking-widest">
                  Il file viene caricato in modo sicuro e riceveremo il link via email
                </p>

                {/* Campo nascosto con URL del file — incluso nell'email */}
                <input
                  ref={fileUrlInputRef}
                  type="hidden"
                  name="file_url"
                  defaultValue="Nessun file allegato"
                />
              </div>

              {error && (
                <div className="sm:col-span-2 text-sm text-red-400 text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={sending || fileUploading}
                className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "var(--brand-red)", boxShadow: "var(--shadow-glow-red)" }}
              >
                {sending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Invio in corso...</>
                ) : (
                  "Invia richiesta"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
