import { useEffect, useId, useRef, useState } from "react";
import { X, Paperclip, Loader2, FileCheck } from "lucide-react";
import emailjs from "@emailjs/browser";
import { compressImage } from "@/lib/utils";
import { categories, type Category } from "@/data/categories";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const ACCEPTED = ".pdf,.ai,.eps,.jpg,.jpeg,.png,.webp,.zip,.psd,.indd";
const MAX_MB = 25; // deve restare allineato a MAX_ALLEGATO_BYTES in src/lib/r2-upload.ts

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
  const [dettagli, setDettagli] = useState(false);
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
      // Comprimi se è un'immagine
      const isImage = f.type.startsWith("image/");
      const fileToUpload = isImage ? await compressImage(f) : f;

      const contentType = fileToUpload.type || "application/octet-stream";

      // Il nome del file lo assegna il server, dentro preventivi/: il browser
      // non decide dove si scrive nel bucket. Qui dichiariamo solo tipo e peso,
      // che il server verifica prima di firmare l'upload.
      const res = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, size: fileToUpload.size, public: true }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setError(
          res.status === 415
            ? "Formato non accettato. Usa PDF, JPG, PNG, WEBP, TIFF, SVG, EPS o ZIP."
            : body.error ?? "Errore nel caricamento del file. Riprova.",
        );
        setFile(null);
        return;
      }

      const { url, publicUrl } = await res.json() as { url: string; publicUrl: string };

      const put = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: fileToUpload,
      });
      if (!put.ok) throw new Error(`upload R2 ${put.status}`);

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
    // Email O telefono, non per forza tutti e due. Obbligare l'email fa perdere
    // le richieste di chi preferisce essere richiamato — e in tipografia sono
    // tante. Uno dei due pero' serve, altrimenti non sappiamo dove rispondere.
    const dati = new FormData(formRef.current);
    const email = String(dati.get("email") ?? "").trim();
    const telefono = String(dati.get("phone") ?? "").trim();
    if (!email && !telefono) {
      setError("Lasciaci almeno un recapito: email o telefono.");
      return;
    }
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
    "w-full rounded-sm border border-white/20 bg-black/40 px-3.5 py-3 text-[15px] text-white placeholder:text-white/55 outline-none transition-colors focus:border-[var(--brand-red)]";
  const labelCls = "occhiello mb-2 block text-white/55";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-lg border border-white/15 bg-[var(--nero-800)] p-6 shadow-2xl sm:max-w-2xl sm:rounded-lg sm:p-9">
        <button onClick={onClose} aria-label="Chiudi" className="absolute top-4 right-4 p-2 text-white/60 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/55 mb-3">✓ Conferma</div>
            <h3 className="mb-3 font-display text-3xl text-white">Richiesta arrivata</h3>
            <p className="mx-auto max-w-md leading-relaxed text-white/70">
              La legge Stefano, di persona. Di solito rispondiamo in giornata, al
              massimo entro 24 ore lavorative, con prezzo e tempi.
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/55">
              Se hai fretta chiama pure:{" "}
              <a href="tel:+393332876277" className="text-white underline underline-offset-4">
                +39 333 287 6277
              </a>
            </p>
            <button onClick={onClose}
              className="mt-8 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white transition-all"
              style={{ background: "var(--brand-red)" }}>
              Chiudi
            </button>
          </div>
        ) : (
          <>
            <div className="occhiello mb-3 text-white/55">Preventivo gratuito</div>
            <h3 className="font-display text-3xl text-white sm:text-4xl">Dicci cosa ti serve</h3>
            <p className="mb-7 mt-2 text-[15px] leading-relaxed text-white/60">
              Bastano nome e un recapito. Tutto il resto è facoltativo: se non lo
              sai ancora, lo decidiamo insieme.
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor={fid("name")} className={labelCls}>Nome e cognome *</label>
                <input id={fid("name")} name="name" required type="text" className={inputCls} placeholder="Mario Rossi" />
              </div>

              <div>
                <label htmlFor={fid("email")} className={labelCls}>Email</label>
                <input id={fid("email")} name="email" type="email" className={inputCls} placeholder="mario@esempio.it" />
              </div>

              <div>
                <label htmlFor={fid("tel")} className={labelCls}>Telefono</label>
                <input id={fid("tel")} name="phone" type="tel" className={inputCls} placeholder="+39 ..." />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={fid("cat")} className={labelCls}>Categoria prodotto</label>
                <select id={fid("cat")} name="category" value={selected} onChange={(e) => setSelected(e.target.value)} className={inputCls}>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name} className="bg-black">{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={fid("qty")} className={labelCls}>Quantità</label>
                <input id={fid("qty")} name="quantity" type="number" min={1} className={inputCls} placeholder="500" />
              </div>

              {/* Formato e finitura sono le due domande che fanno abbandonare un
                  modulo: chi non e' del mestiere non sa cosa rispondere e
                  chiude. Restano disponibili per chi le sa gia', ma richiuse.
                  I campi non vengono smontati, solo nascosti con l'attributo
                  `hidden`: cosi' se qualcuno li compila e poi richiude il
                  blocco, il valore parte lo stesso nella mail. */}
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setDettagli((v) => !v)}
                  aria-expanded={dettagli}
                  className="occhiello text-white/50 underline underline-offset-4 transition-colors hover:text-white"
                >
                  {dettagli ? "− Nascondi i dettagli tecnici" : "+ Aggiungi formato e finitura"}
                </button>
              </div>

              <div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2" hidden={!dettagli}>
                <div>
                  <label htmlFor={fid("fmt")} className={labelCls}>Formato</label>
                  <input id={fid("fmt")} name="format" type="text" className={inputCls} placeholder="es. A5, 85×55mm..." />
                </div>
                <div>
                  <label htmlFor={fid("fin")} className={labelCls}>Finitura</label>
                  <input id={fid("fin")} name="finishing" type="text" className={inputCls} placeholder="es. plastificazione opaca..." />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={fid("notes")} className={labelCls}>Note aggiuntive</label>
                <textarea id={fid("notes")} name="notes" rows={3} className={inputCls} placeholder="Scrivi qui ogni dettaglio utile..." />
              </div>

              {/* File upload */}
              <div className="sm:col-span-2">
                <label className={labelCls}>
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
                    <Paperclip className="h-4 w-4 text-white/55 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    {fileUploading ? (
                      <span className="text-sm text-white/50">Caricamento in corso...</span>
                    ) : fileUrl ? (
                      <span className="text-sm text-green-400 truncate">{file?.name}</span>
                    ) : (
                      <span className="text-sm text-white/55">
                        PDF, AI, EPS, JPG, PNG, ZIP, PSD — max {MAX_MB}MB
                      </span>
                    )}
                  </div>
                  {fileUrl && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); setFileUrl(null); }}
                      className="shrink-0 text-white/55 hover:text-white/70 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="mt-1 font-mono-ui text-[9px] text-white/55 uppercase tracking-widest">
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
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-sm px-6 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
                style={{ background: "var(--brand-red)" }}
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
