import { useState, useRef, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, X, Check, Loader2, ChevronRight, LogOut, Trash2 } from "lucide-react";
import { cfImageUrl } from "@/lib/cloudflare-images";
import { slugify } from "@/lib/utils";
import type { Album, Photo } from "@/data/portfolio";

const ADMIN_PASSWORD = "nuovastampa2024";

const CATEGORIES = ["fotografia", "video"] as const;
const EVENTS = ["matrimoni", "concerti", "eventi", "diciottesimi", "battesimi", "feste-private"] as const;

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Tipografia Nuova Stampa" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (pwd === ADMIN_PASSWORD) { onLogin(); setError(false); }
    else { setError(true); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 text-center">
          Tipografia Nuova Stampa
        </div>
        <h1 className="font-display text-4xl text-white text-center mb-8">Admin</h1>
        <div className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm p-6">
          <input
            type="password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="Password"
            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--brand-red)] transition-colors font-mono-ui text-sm"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-xs font-mono-ui text-red-400">Password errata</p>
          )}
          <button
            onClick={submit}
            className="mt-4 w-full rounded-md py-3 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.02]"
            style={{ background: "var(--brand-red)" }}
          >
            Accedi
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Photo upload item ────────────────────────────────────────────────────────
type UploadItem = {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  r2Key?: string;
};

// ─── Main Admin Page ──────────────────────────────────────────────────────────
function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [step, setStep] = useState<"form" | "uploading" | "done">("form");

  // Form state
  const [categorySlug, setCategorySlug] = useState<typeof CATEGORIES[number]>("fotografia");
  const [eventSlug, setEventSlug] = useState<typeof EVENTS[number]>("concerti");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [items, setItems] = useState<UploadItem[]>([]);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const albumSlug = slugify(title || "album");

  // ── Drag & drop ──
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    addFiles(files);
  }, []);

  const addFiles = (files: File[]) => {
    const newItems: UploadItem[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
    }));
    setItems(prev => [...prev, ...newItems]);
  };

  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const moveFirst = (idx: number) => {
    setItems(prev => {
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      return [item, ...next];
    });
  };

  // ── Upload & publish ──
  const publish = async () => {
    if (!title || !date || items.length === 0) {
      setError("Compila titolo, data e carica almeno una foto.");
      return;
    }
    setError("");
    setStep("uploading");

    const uploaded: Photo[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const ext = item.file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const r2Key = `${categorySlug}/${eventSlug}/${albumSlug}/${String(i + 1).padStart(3, "0")}.${ext}`;

      setItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "uploading" } : it));

      try {
        // 1. Ottieni presigned URL
        const res = await fetch("/api/admin/upload-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": ADMIN_PASSWORD,
          },
          body: JSON.stringify({ key: r2Key, contentType: item.file.type }),
        });
        const { url } = await res.json() as { url: string };

        // 2. Upload diretto su R2
        await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": item.file.type },
          body: item.file,
        });

        setItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "done", r2Key } : it));
        uploaded.push({
          id: r2Key,
          alt: `${title} — foto ${i + 1}`,
          featured: i === 0,
        });
      } catch {
        setItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "error" } : it));
      }
    }

    if (uploaded.length === 0) {
      setError("Upload fallito per tutte le foto. Riprova.");
      setStep("form");
      return;
    }

    // 3. Salva album su KV
    const album: Album = {
      slug: albumSlug,
      title,
      date,
      location: location.trim() || undefined,
      photos: uploaded,
    };

    await fetch("/api/admin/save-album", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": ADMIN_PASSWORD,
      },
      body: JSON.stringify({ categorySlug, eventSlug, album }),
    });

    const url = `/portfolio/${categorySlug}/${eventSlug}/${albumSlug}`;
    setPublishedUrl(url);
    setStep("done");
  };

  const reset = () => {
    setStep("form");
    setTitle("");
    setDate("");
    setLocation("");
    setItems([]);
    setPublishedUrl("");
    setError("");
  };

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <div className="px-6 sm:px-10 lg:px-16 pb-32 lg:pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pt-12 pb-8 flex items-center justify-between">
        <div>
          <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
            Pannello amministrazione
          </div>
          <h1 className="font-display text-4xl text-white">Nuovo album</h1>
        </div>
        <button
          onClick={() => setAuthed(false)}
          className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" /> Esci
        </button>
      </div>

      {/* Done state */}
      {step === "done" && (
        <div className="rounded-xl border border-white/10 bg-card/40 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/20 grid place-items-center mx-auto mb-4">
            <Check className="h-7 w-7 text-green-400" />
          </div>
          <h2 className="font-display text-3xl text-white mb-2">Album pubblicato!</h2>
          <p className="text-white/50 text-sm mb-6">
            {items.filter(i => i.status === "done").length} foto caricate su R2.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={publishedUrl}
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-bold uppercase tracking-widest text-white"
              style={{ background: "var(--brand-red)" }}
            >
              Vedi album <ChevronRight className="h-4 w-4" />
            </a>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-bold uppercase tracking-widest text-white/60 border border-white/20 hover:text-white transition-colors"
            >
              Nuovo album
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      {step !== "done" && (
        <div className="space-y-6">
          {/* Categoria + Evento */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Tipo</label>
              <select
                value={categorySlug}
                onChange={e => setCategorySlug(e.target.value as typeof CATEGORIES[number])}
                className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)] transition-colors font-mono-ui text-sm"
                disabled={step === "uploading"}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Evento</label>
              <select
                value={eventSlug}
                onChange={e => setEventSlug(e.target.value as typeof EVENTS[number])}
                className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)] transition-colors font-mono-ui text-sm"
                disabled={step === "uploading"}
              >
                {EVENTS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* Titolo + Data + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Titolo *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="es. Mario & Giulia"
                disabled={step === "uploading"}
                className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--brand-red)] transition-colors font-mono-ui text-sm"
              />
            </div>
            <div>
              <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Data *</label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                placeholder="es. Giugno 2024"
                disabled={step === "uploading"}
                className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--brand-red)] transition-colors font-mono-ui text-sm"
              />
            </div>
            <div>
              <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="es. Casale Monferrato"
                disabled={step === "uploading"}
                className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--brand-red)] transition-colors font-mono-ui text-sm"
              />
            </div>
          </div>

          {/* Slug preview */}
          {title && (
            <div className="font-mono-ui text-[10px] text-white/30">
              URL: /portfolio/{categorySlug}/{eventSlug}/<span className="text-white/60">{albumSlug}</span>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => step !== "uploading" && fileInputRef.current?.click()}
            className="relative rounded-xl border-2 border-dashed border-white/15 hover:border-[var(--brand-red)]/50 transition-colors cursor-pointer p-8 text-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={e => addFiles(Array.from(e.target.files ?? []))}
              disabled={step === "uploading"}
            />
            <Upload className="h-8 w-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm">Trascina le foto qui oppure clicca per selezionarle</p>
            <p className="font-mono-ui text-[10px] text-white/25 mt-1 uppercase tracking-widest">JPG · PNG · WEBP</p>
          </div>

          {/* Photo grid */}
          {items.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {items.length} foto · prima = cover
                </div>
                {step !== "uploading" && (
                  <button onClick={() => setItems([])} className="font-mono-ui text-[10px] uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors">
                    Rimuovi tutte
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {items.map((item, i) => (
                  <div key={i} className="relative group aspect-square rounded-md overflow-hidden border border-white/10">
                    <img src={item.preview} alt="" className="w-full h-full object-cover" />

                    {/* Cover badge */}
                    {i === 0 && (
                      <div className="absolute top-1 left-1 font-mono-ui text-[8px] uppercase tracking-widest bg-[var(--brand-red)] text-white px-1.5 py-0.5 rounded">
                        cover
                      </div>
                    )}

                    {/* Status overlay */}
                    {item.status === "uploading" && (
                      <div className="absolute inset-0 bg-black/60 grid place-items-center">
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      </div>
                    )}
                    {item.status === "done" && (
                      <div className="absolute inset-0 bg-green-500/20 grid place-items-center">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                    )}
                    {item.status === "error" && (
                      <div className="absolute inset-0 bg-red-500/20 grid place-items-center">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    )}

                    {/* Actions (solo pending) */}
                    {item.status === "pending" && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {i !== 0 && (
                          <button
                            onClick={() => moveFirst(i)}
                            className="font-mono-ui text-[8px] uppercase tracking-widest bg-white/20 text-white px-2 py-1 rounded hover:bg-[var(--brand-red)] transition-colors"
                            title="Usa come cover"
                          >
                            cover
                          </button>
                        )}
                        <button
                          onClick={() => removeItem(i)}
                          className="p-1.5 bg-white/20 rounded hover:bg-red-500/60 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="font-mono-ui text-[11px] text-red-400 uppercase tracking-widest">{error}</p>
          )}

          {/* Publish button */}
          <button
            onClick={publish}
            disabled={step === "uploading" || !title || !date || items.length === 0}
            className="w-full rounded-md py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            style={{ background: "var(--brand-red)" }}
          >
            {step === "uploading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Caricamento in corso...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Pubblica album ({items.length} foto)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
