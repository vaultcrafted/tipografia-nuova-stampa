import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, X, Check, Loader2, ChevronRight, LogOut, Trash2, Plus, ArrowLeft, ExternalLink } from "lucide-react";
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
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 text-center">Tipografia Nuova Stampa</div>
        <h1 className="font-display text-4xl text-white text-center mb-8">Admin</h1>
        <div className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm p-6">
          <input
            type="password" value={pwd} onChange={e => setPwd(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (pwd === ADMIN_PASSWORD ? onLogin() : setError(true))}
            placeholder="Password" autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--brand-red)] transition-colors font-mono-ui text-sm"
          />
          {error && <p className="mt-2 text-xs font-mono-ui text-red-400">Password errata</p>}
          <button
            onClick={() => pwd === ADMIN_PASSWORD ? onLogin() : setError(true)}
            className="mt-4 w-full rounded-md py-3 text-sm font-bold uppercase tracking-widest text-white"
            style={{ background: "var(--brand-red)" }}
          >Accedi</button>
        </div>
      </div>
    </div>
  );
}

// ─── Album list view ──────────────────────────────────────────────────────────
function AlbumList({ onNew }: { onNew: () => void }) {
  const [categorySlug, setCategorySlug] = useState<typeof CATEGORIES[number]>("fotografia");
  const [eventSlug, setEventSlug] = useState<typeof EVENTS[number]>("concerti");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/portfolio/albums?category=${categorySlug}&event=${eventSlug}`);
      if (res.ok) setAlbums(await res.json() as Album[]);
    } finally { setLoading(false); }
  }, [categorySlug, eventSlug]);

  useEffect(() => { loadAlbums(); }, [loadAlbums]);

  const deleteAlbum = async (slug: string) => {
    if (!confirm(`Eliminare l'album "${slug}"? Le foto su R2 non verranno cancellate.`)) return;
    setDeleting(slug);
    try {
      await fetch("/api/admin/save-album", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-password": ADMIN_PASSWORD },
        body: JSON.stringify({ categorySlug, eventSlug, albumSlug: slug }),
      });
      await loadAlbums();
    } finally { setDeleting(null); }
  };

  return (
    <div className="space-y-6">
      {/* Filtri */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Tipo</label>
          <select value={categorySlug} onChange={e => setCategorySlug(e.target.value as typeof CATEGORIES[number])}
            className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)] font-mono-ui text-sm">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Evento</label>
          <select value={eventSlug} onChange={e => setEventSlug(e.target.value as typeof EVENTS[number])}
            className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)] font-mono-ui text-sm">
            {EVENTS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
          <div className="font-mono-ui text-[10px] uppercase tracking-widest text-white/40">
            {loading ? "Caricamento..." : `${albums.length} album`}
          </div>
          <button onClick={onNew}
            className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            <Plus className="h-3 w-3" /> Nuovo album
          </button>
        </div>

        {albums.length === 0 && !loading ? (
          <div className="px-5 py-12 text-center">
            <p className="text-white/30 text-sm font-mono-ui">Nessun album in {categorySlug}/{eventSlug}</p>
            <button onClick={onNew}
              className="mt-4 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white"
              style={{ background: "var(--brand-red)" }}>
              <Plus className="h-3.5 w-3.5" /> Crea il primo album
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {albums.map(album => (
              <div key={album.slug} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
                {/* Cover thumb */}
                <div className="w-14 h-10 rounded overflow-hidden shrink-0 bg-white/5 border border-white/10">
                  {album.photos[0] && (
                    <img src={cfImageUrl(album.photos[0].id, "thumbnail")} alt=""
                      className="w-full h-full object-cover" />
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg text-white truncate">{album.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono-ui text-[10px] text-white/40">{album.date}</span>
                    {album.location && <><span className="text-white/20">·</span><span className="font-mono-ui text-[10px] text-white/40">{album.location}</span></>}
                    <span className="text-white/20">·</span>
                    <span className="font-mono-ui text-[10px] text-white/40">{album.photos.length} foto</span>
                    {album.pixiesetUrl && (
                      <a href={album.pixiesetUrl} target="_blank" rel="noopener noreferrer"
                        className="font-mono-ui text-[10px] text-[var(--brand-red)] flex items-center gap-1 hover:underline">
                        <ExternalLink className="h-2.5 w-2.5" /> Pixieset
                      </a>
                    )}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <a href={`/portfolio/${categorySlug}/${eventSlug}/${album.slug}`} target="_blank"
                    className="p-2 text-white/30 hover:text-white transition-colors" title="Vedi sul sito">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button onClick={() => deleteAlbum(album.slug)} disabled={deleting === album.slug}
                    className="p-2 text-white/30 hover:text-red-400 transition-colors" title="Elimina">
                    {deleting === album.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── New album form ───────────────────────────────────────────────────────────
type UploadItem = { file: File; preview: string; status: "pending" | "uploading" | "done" | "error"; r2Key?: string };

function NewAlbumForm({ onBack, onDone }: { onBack: () => void; onDone: (url: string) => void }) {
  const [categorySlug, setCategorySlug] = useState<typeof CATEGORIES[number]>("fotografia");
  const [eventSlug, setEventSlug] = useState<typeof EVENTS[number]>("concerti");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [pixiesetUrl, setPixiesetUrl] = useState("");
  const [items, setItems] = useState<UploadItem[]>([]);
  const [step, setStep] = useState<"form" | "uploading">("form");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const albumSlug = slugify(title || "album");

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    setItems(prev => [...prev, ...files.map(file => ({ file, preview: URL.createObjectURL(file), status: "pending" as const }))]);
  }, []);

  const publish = async () => {
    if (!title || !date || items.length === 0) { setError("Compila titolo, data e carica almeno una foto."); return; }
    setError("");
    setStep("uploading");
    const uploaded: Photo[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const ext = item.file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const r2Key = `${categorySlug}/${eventSlug}/${albumSlug}/${String(i + 1).padStart(3, "0")}.${ext}`;
      setItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "uploading" } : it));
      try {
        const res = await fetch("/api/admin/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-password": ADMIN_PASSWORD },
          body: JSON.stringify({ key: r2Key, contentType: item.file.type }),
        });
        const { url } = await res.json() as { url: string };
        await fetch(url, { method: "PUT", headers: { "Content-Type": item.file.type }, body: item.file });
        setItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "done", r2Key } : it));
        uploaded.push({ id: r2Key, alt: `${title} — foto ${i + 1}`, featured: i === 0 });
      } catch {
        setItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "error" } : it));
      }
    }
    if (uploaded.length === 0) { setError("Upload fallito. Riprova."); setStep("form"); return; }
    const album: Album = { slug: albumSlug, title, date, location: location.trim() || undefined, pixiesetUrl: pixiesetUrl.trim() || undefined, photos: uploaded };
    await fetch("/api/admin/save-album", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": ADMIN_PASSWORD },
      body: JSON.stringify({ categorySlug, eventSlug, album }),
    });
    onDone(`/portfolio/${categorySlug}/${eventSlug}/${albumSlug}`);
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
        <ArrowLeft className="h-3 w-3" /> Lista album
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Tipo</label>
          <select value={categorySlug} onChange={e => setCategorySlug(e.target.value as typeof CATEGORIES[number])} disabled={step === "uploading"}
            className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)] font-mono-ui text-sm">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Evento</label>
          <select value={eventSlug} onChange={e => setEventSlug(e.target.value as typeof EVENTS[number])} disabled={step === "uploading"}
            className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[var(--brand-red)] font-mono-ui text-sm">
            {EVENTS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Titolo *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="es. Mario & Giulia" disabled={step === "uploading"}
            className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--brand-red)] font-mono-ui text-sm" />
        </div>
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Data *</label>
          <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="es. Giugno 2024" disabled={step === "uploading"}
            className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--brand-red)] font-mono-ui text-sm" />
        </div>
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Location</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="es. Casale Monferrato" disabled={step === "uploading"}
            className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--brand-red)] font-mono-ui text-sm" />
        </div>
      </div>

      <div>
        <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
          Link galleria completa (Pixieset) — opzionale
        </label>
        <input type="url" value={pixiesetUrl} onChange={e => setPixiesetUrl(e.target.value)}
          placeholder="https://tuonome.pixieset.com/album-nome/" disabled={step === "uploading"}
          className="w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--brand-red)] font-mono-ui text-sm" />
        <p className="mt-1 font-mono-ui text-[9px] text-white/25 uppercase tracking-widest">
          Se presente, apparirà un pulsante "Vedi tutte le foto" sulla pagina dell'album
        </p>
      </div>

      {title && (
        <div className="font-mono-ui text-[10px] text-white/30">
          URL: /portfolio/{categorySlug}/{eventSlug}/<span className="text-white/60">{albumSlug}</span>
        </div>
      )}

      <div onDrop={onDrop} onDragOver={e => e.preventDefault()}
        onClick={() => step !== "uploading" && fileInputRef.current?.click()}
        className="relative rounded-xl border-2 border-dashed border-white/15 hover:border-[var(--brand-red)]/50 transition-colors cursor-pointer p-8 text-center">
        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
          onChange={e => {
            const files = Array.from(e.target.files ?? []).filter(f => f.type.startsWith("image/"));
            setItems(prev => [...prev, ...files.map(file => ({ file, preview: URL.createObjectURL(file), status: "pending" as const }))]);
          }}
          disabled={step === "uploading"} />
        <Upload className="h-8 w-8 text-white/20 mx-auto mb-3" />
        <p className="text-white/50 text-sm">Trascina le foto qui oppure clicca per selezionarle</p>
        <p className="font-mono-ui text-[10px] text-white/25 mt-1 uppercase tracking-widest">JPG · PNG · WEBP</p>
      </div>

      {items.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40">{items.length} foto · prima = cover</div>
            {step !== "uploading" && (
              <button onClick={() => setItems([])} className="font-mono-ui text-[10px] uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors">
                Rimuovi tutte
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {items.map((item, i) => (
              <div key={i} className="relative group aspect-square rounded-md overflow-hidden border border-white/10">
                <img src={item.preview} alt="" className="w-full h-full object-cover" />
                {i === 0 && <div className="absolute top-1 left-1 font-mono-ui text-[8px] uppercase tracking-widest bg-[var(--brand-red)] text-white px-1.5 py-0.5 rounded">cover</div>}
                {item.status === "uploading" && <div className="absolute inset-0 bg-black/60 grid place-items-center"><Loader2 className="h-4 w-4 text-white animate-spin" /></div>}
                {item.status === "done" && <div className="absolute inset-0 bg-green-500/20 grid place-items-center"><Check className="h-4 w-4 text-green-400" /></div>}
                {item.status === "error" && <div className="absolute inset-0 bg-red-500/20 grid place-items-center"><X className="h-4 w-4 text-red-400" /></div>}
                {item.status === "pending" && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    {i !== 0 && (
                      <button onClick={() => setItems(prev => { const n = [...prev]; const [it] = n.splice(i, 1); return [it, ...n]; })}
                        className="font-mono-ui text-[7px] uppercase bg-white/20 text-white px-1.5 py-1 rounded hover:bg-[var(--brand-red)] transition-colors">cover</button>
                    )}
                    <button onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))}
                      className="p-1.5 bg-white/20 rounded hover:bg-red-500/60 transition-colors">
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="font-mono-ui text-[11px] text-red-400 uppercase tracking-widest">{error}</p>}

      <button onClick={publish} disabled={step === "uploading" || !title || !date || items.length === 0}
        className="w-full rounded-md py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ background: "var(--brand-red)" }}>
        {step === "uploading" ? <><Loader2 className="h-4 w-4 animate-spin" />Caricamento...</> : <><Upload className="h-4 w-4" />Pubblica album ({items.length} foto)</>}
      </button>
    </div>
  );
}

// ─── Done state ───────────────────────────────────────────────────────────────
function DoneState({ url, onNew, onList }: { url: string; onNew: () => void; onList: () => void }) {
  return (
    <div className="rounded-xl border border-white/10 bg-card/40 p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-green-500/20 grid place-items-center mx-auto mb-4">
        <Check className="h-7 w-7 text-green-400" />
      </div>
      <h2 className="font-display text-3xl text-white mb-2">Album pubblicato!</h2>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <a href={url} className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-bold uppercase tracking-widest text-white" style={{ background: "var(--brand-red)" }}>
          Vedi album <ChevronRight className="h-4 w-4" />
        </a>
        <button onClick={onNew} className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-bold uppercase tracking-widest text-white/60 border border-white/20 hover:text-white transition-colors">
          <Plus className="h-4 w-4" /> Nuovo album
        </button>
        <button onClick={onList} className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-bold uppercase tracking-widest text-white/60 border border-white/20 hover:text-white transition-colors">
          Lista album
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<"list" | "new" | "done">("list");
  const [doneUrl, setDoneUrl] = useState("");

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <div className="px-6 sm:px-10 lg:px-16 pb-32 lg:pb-16 max-w-4xl mx-auto">
      <div className="pt-12 pb-8 flex items-center justify-between">
        <div>
          <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Pannello amministrazione</div>
          <h1 className="font-display text-4xl text-white">
            {view === "list" ? "Album" : view === "new" ? "Nuovo album" : "Pubblicato"}
          </h1>
        </div>
        <button onClick={() => setAuthed(false)} className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">
          <LogOut className="h-3.5 w-3.5" /> Esci
        </button>
      </div>

      {view === "list" && <AlbumList onNew={() => setView("new")} />}
      {view === "new" && (
        <NewAlbumForm
          onBack={() => setView("list")}
          onDone={(url) => { setDoneUrl(url); setView("done"); }}
        />
      )}
      {view === "done" && (
        <DoneState
          url={doneUrl}
          onNew={() => setView("new")}
          onList={() => setView("list")}
        />
      )}
    </div>
  );
}
