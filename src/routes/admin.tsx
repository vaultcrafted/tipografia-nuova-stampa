import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, X, Check, Loader2, ChevronRight, LogOut, Trash2, Plus, ArrowLeft, ExternalLink, Eye, EyeOff, Pencil } from "lucide-react";
import { cfImageUrl } from "@/lib/cloudflare-images";
import { slugify, compressImage } from "@/lib/utils";
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
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const submit = () => pwd === ADMIN_PASSWORD ? onLogin() : setError(true);
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 text-center">Tipografia Nuova Stampa</div>
        <h1 className="font-display text-4xl text-white text-center mb-8">Admin</h1>
        <div className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm p-6">
          <div className="relative">
            <input
              type={show ? "text" : "password"} value={pwd} onChange={e => setPwd(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="Password" autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-[var(--brand-red)] transition-colors font-mono-ui text-sm"
            />
            <button type="button" onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              aria-label={show ? "Nascondi password" : "Mostra password"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="mt-2 text-xs font-mono-ui text-red-400">Password errata</p>}
          <button onClick={submit} className="mt-4 w-full rounded-md py-3 text-sm font-bold uppercase tracking-widest text-white" style={{ background: "var(--brand-red)" }}>Accedi</button>
        </div>
      </div>
    </div>
  );
}

// ─── Album list ───────────────────────────────────────────────────────────────
function AlbumList({
  onNew,
  onEdit,
}: {
  onNew: () => void;
  onEdit: (album: Album, categorySlug: string, eventSlug: string) => void;
}) {
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
    if (!confirm(`Eliminare l'album "${slug}"?\nLe foto verranno eliminate anche da R2.`)) return;
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

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
          <div className="font-mono-ui text-[10px] uppercase tracking-widest text-white/40">
            {loading ? "Caricamento..." : `${albums.length} album`}
          </div>
          <button onClick={onNew} className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            <Plus className="h-3 w-3" /> Nuovo album
          </button>
        </div>

        {albums.length === 0 && !loading ? (
          <div className="px-5 py-12 text-center">
            <p className="text-white/30 text-sm font-mono-ui">Nessun album in {categorySlug}/{eventSlug}</p>
            <button onClick={onNew} className="mt-4 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white" style={{ background: "var(--brand-red)" }}>
              <Plus className="h-3.5 w-3.5" /> Crea il primo album
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {albums.map(album => (
              <div key={album.slug} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
                <div className="w-14 h-10 rounded overflow-hidden shrink-0 bg-white/5 border border-white/10">
                  {album.photos[0] && <img src={cfImageUrl(album.photos[0].id, "thumbnail")} alt="" className="w-full h-full object-cover" />}
                </div>
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
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => onEdit(album, categorySlug, eventSlug)}
                    className="p-2 text-white/30 hover:text-white transition-colors" title="Modifica">
                    <Pencil className="h-4 w-4" />
                  </button>
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

// ─── Album form (nuovo o modifica) ───────────────────────────────────────────
type UploadItem = { file: File; preview: string; status: "pending" | "uploading" | "done" | "error"; r2Key?: string };
type ExistingPhoto = Photo & { toDelete?: boolean };

function AlbumForm({
  onBack,
  onDone,
  editAlbum,
  editCategorySlug,
  editEventSlug,
}: {
  onBack: () => void;
  onDone: (url: string) => void;
  editAlbum?: Album;
  editCategorySlug?: string;
  editEventSlug?: string;
}) {
  const isEdit = !!editAlbum;

  const [categorySlug, setCategorySlug] = useState<typeof CATEGORIES[number]>((editCategorySlug as typeof CATEGORIES[number]) ?? "fotografia");
  const [eventSlug, setEventSlug] = useState<typeof EVENTS[number]>((editEventSlug as typeof EVENTS[number]) ?? "concerti");
  const [title, setTitle] = useState(editAlbum?.title ?? "");
  const [date, setDate] = useState(editAlbum?.date ?? "");
  const [location, setLocation] = useState(editAlbum?.location ?? "");
  const [pixiesetUrl, setPixiesetUrl] = useState(editAlbum?.pixiesetUrl ?? "");
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>(editAlbum?.photos ?? []);
  const [newItems, setNewItems] = useState<UploadItem[]>([]);
  const [step, setStep] = useState<"form" | "uploading">("form");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const albumSlug = isEdit ? editAlbum.slug : slugify(title || "album");

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    setNewItems(prev => [...prev, ...files.map(file => ({ file, preview: URL.createObjectURL(file), status: "pending" as const }))]);
  }, []);

  const toggleDeleteExisting = (id: string) => {
    setExistingPhotos(prev => prev.map(p => p.id === id ? { ...p, toDelete: !p.toDelete } : p));
  };

  const setCoverExisting = (id: string) => {
    setExistingPhotos(prev => {
      const reordered = [...prev];
      const idx = reordered.findIndex(p => p.id === id);
      if (idx > 0) { const [item] = reordered.splice(idx, 1); reordered.unshift(item); }
      return reordered.map((p, i) => ({ ...p, featured: i === 0 }));
    });
  };

  const publish = async () => {
    const keptPhotos = existingPhotos.filter(p => !p.toDelete);
    const totalPhotos = keptPhotos.length + newItems.length;
    if (!title || !date || totalPhotos === 0) { setError("Compila titolo, data e assicurati di avere almeno una foto."); return; }
    setError("");
    setStep("uploading");

    const uploadedNew: Photo[] = [];
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      setNewItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "uploading" } : it));
      try {
        // Comprimi prima dell'upload (max 2000px, qualità 85%)
        const compressed = await compressImage(item.file);
        const ext = compressed.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const r2Key = `${categorySlug}/${eventSlug}/${albumSlug}/${Date.now()}_${String(i + 1).padStart(3, "0")}.${ext}`;
        const res = await fetch("/api/admin/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-password": ADMIN_PASSWORD },
          body: JSON.stringify({ key: r2Key, contentType: compressed.type }),
        });
        const { url } = await res.json() as { url: string };
        await fetch(url, { method: "PUT", headers: { "Content-Type": compressed.type }, body: compressed });
        setNewItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "done", r2Key } : it));
        uploadedNew.push({ id: r2Key, alt: `${title} — foto ${keptPhotos.length + i + 1}`, featured: false });
      } catch {
        setNewItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "error" } : it));
      }
    }

    const allPhotos: Photo[] = [
      ...keptPhotos.map((p, i) => ({ id: p.id, alt: p.alt, featured: i === 0 })),
      ...uploadedNew,
    ];
    if (allPhotos.length === 0) { setError("Nessuna foto disponibile. Riprova."); setStep("form"); return; }

    const album: Album = {
      slug: albumSlug,
      title,
      date,
      location: location.trim() || undefined,
      pixiesetUrl: pixiesetUrl.trim() || undefined,
      photos: allPhotos,
    };

    // Se in modifica l'evento è cambiato, elimina dal vecchio e salva nel nuovo
    if (isEdit && editEventSlug && editEventSlug !== eventSlug) {
      await fetch("/api/admin/save-album", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-password": ADMIN_PASSWORD },
        body: JSON.stringify({ categorySlug, eventSlug: editEventSlug, albumSlug, skipR2: true }),
      });
    }

    await fetch("/api/admin/save-album", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": ADMIN_PASSWORD },
      body: JSON.stringify({ categorySlug, eventSlug, album }),
    });

    onDone(`/portfolio/${categorySlug}/${eventSlug}/${albumSlug}`);
  };

  const inputCls = "w-full bg-card/40 border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[var(--brand-red)] transition-colors font-mono-ui text-sm";

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
        <ArrowLeft className="h-3 w-3" /> Lista album
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Tipo{isEdit && <span className="ml-2 text-white/20">(non modificabile)</span>}</label>
          <select value={categorySlug} onChange={e => setCategorySlug(e.target.value as typeof CATEGORIES[number])} disabled={step === "uploading" || isEdit} className={inputCls + (isEdit ? " opacity-50 cursor-not-allowed" : "")}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Evento</label>
          <select value={eventSlug} onChange={e => setEventSlug(e.target.value as typeof EVENTS[number])} disabled={step === "uploading"} className={inputCls}>
            {EVENTS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Titolo *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="es. Mario & Giulia" disabled={step === "uploading"} className={inputCls} />
        </div>
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Data *</label>
          <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="es. Giugno 2024" disabled={step === "uploading"} className={inputCls} />
        </div>
        <div>
          <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Location</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="es. Casale Monferrato" disabled={step === "uploading"} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Link galleria completa (Pixieset)</label>
        <input type="url" value={pixiesetUrl} onChange={e => setPixiesetUrl(e.target.value)} placeholder="https://tuonome.pixieset.com/album/" disabled={step === "uploading"} className={inputCls} />
      </div>

      {/* Foto esistenti (solo in modifica) */}
      {isEdit && existingPhotos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40">
              Foto esistenti · prima = cover · click rosso per eliminare
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {existingPhotos.map((photo, i) => (
              <div key={photo.id} className={`relative group aspect-square rounded-md overflow-hidden border transition-all ${photo.toDelete ? "border-red-500 opacity-40" : i === 0 ? "border-[var(--brand-red)]" : "border-white/10"}`}>
                <img src={cfImageUrl(photo.id, "thumbnail")} alt={photo.alt} className="w-full h-full object-cover" />
                {i === 0 && !photo.toDelete && (
                  <div className="absolute top-1 left-1 font-mono-ui text-[7px] uppercase tracking-widest bg-[var(--brand-red)] text-white px-1 py-0.5 rounded">cover</div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {i !== 0 && !photo.toDelete && (
                    <button onClick={() => setCoverExisting(photo.id)}
                      className="font-mono-ui text-[7px] uppercase bg-white/20 text-white px-1.5 py-1 rounded hover:bg-[var(--brand-red)] transition-colors">
                      cover
                    </button>
                  )}
                  <button onClick={() => toggleDeleteExisting(photo.id)}
                    className={`p-1.5 rounded transition-colors ${photo.toDelete ? "bg-white/20 hover:bg-white/40" : "bg-white/20 hover:bg-red-500/60"}`}>
                    {photo.toDelete ? <Check className="h-3 w-3 text-white" /> : <Trash2 className="h-3 w-3 text-white" />}
                  </button>
                </div>
                {photo.toDelete && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <X className="h-6 w-6 text-red-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {existingPhotos.some(p => p.toDelete) && (
            <p className="mt-2 font-mono-ui text-[9px] text-red-400 uppercase tracking-widest">
              {existingPhotos.filter(p => p.toDelete).length} foto verranno eliminate da R2
            </p>
          )}
        </div>
      )}

      {/* Nuove foto */}
      <div>
        {isEdit && <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">Aggiungi nuove foto</div>}
        <div onDrop={onDrop} onDragOver={e => e.preventDefault()}
          onClick={() => step !== "uploading" && fileInputRef.current?.click()}
          className="relative rounded-xl border-2 border-dashed border-white/15 hover:border-[var(--brand-red)]/50 transition-colors cursor-pointer p-6 text-center">
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
            onChange={e => {
              const files = Array.from(e.target.files ?? []).filter(f => f.type.startsWith("image/"));
              setNewItems(prev => [...prev, ...files.map(file => ({ file, preview: URL.createObjectURL(file), status: "pending" as const }))]);
            }}
            disabled={step === "uploading"} />
          <Upload className="h-7 w-7 text-white/20 mx-auto mb-2" />
          <p className="text-white/50 text-sm">Trascina le foto qui o clicca per selezionarle</p>
        </div>

        {newItems.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/40">{newItems.length} nuove foto</div>
              {step !== "uploading" && (
                <button onClick={() => setNewItems([])} className="font-mono-ui text-[10px] uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors">Rimuovi tutte</button>
              )}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {newItems.map((item, i) => (
                <div key={i} className="relative group aspect-square rounded-md overflow-hidden border border-white/10">
                  <img src={item.preview} alt="" className="w-full h-full object-cover" />
                  {item.status === "uploading" && <div className="absolute inset-0 bg-black/60 grid place-items-center"><Loader2 className="h-4 w-4 text-white animate-spin" /></div>}
                  {item.status === "done" && <div className="absolute inset-0 bg-green-500/20 grid place-items-center"><Check className="h-4 w-4 text-green-400" /></div>}
                  {item.status === "error" && <div className="absolute inset-0 bg-red-500/20 grid place-items-center"><X className="h-4 w-4 text-red-400" /></div>}
                  {item.status === "pending" && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => setNewItems(prev => prev.filter((_, idx) => idx !== i))}
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
      </div>

      {error && <p className="font-mono-ui text-[11px] text-red-400 uppercase tracking-widest">{error}</p>}

      <button onClick={publish}
        disabled={step === "uploading" || !title || !date || (existingPhotos.filter(p => !p.toDelete).length + newItems.length === 0)}
        className="w-full rounded-md py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ background: "var(--brand-red)" }}>
        {step === "uploading"
          ? <><Loader2 className="h-4 w-4 animate-spin" />Salvataggio...</>
          : isEdit ? <><Pencil className="h-4 w-4" />Salva modifiche</> : <><Upload className="h-4 w-4" />Pubblica album ({newItems.length} foto)</>}
      </button>
    </div>
  );
}

// ─── Done state ───────────────────────────────────────────────────────────────
function DoneState({ url, onNew, onList, isEdit }: { url: string; onNew: () => void; onList: () => void; isEdit?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-card/40 p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-green-500/20 grid place-items-center mx-auto mb-4">
        <Check className="h-7 w-7 text-green-400" />
      </div>
      <h2 className="font-display text-3xl text-white mb-2">{isEdit ? "Modifiche salvate!" : "Album pubblicato!"}</h2>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <a href={url} className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-bold uppercase tracking-widest text-white" style={{ background: "var(--brand-red)" }}>
          Vedi album <ChevronRight className="h-4 w-4" />
        </a>
        {!isEdit && (
          <button onClick={onNew} className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-bold uppercase tracking-widest text-white/60 border border-white/20 hover:text-white transition-colors">
            <Plus className="h-4 w-4" /> Nuovo album
          </button>
        )}
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
  const [view, setView] = useState<"list" | "new" | "edit" | "done">("list");
  const [doneUrl, setDoneUrl] = useState("");
  const [isEditDone, setIsEditDone] = useState(false);
  const [editData, setEditData] = useState<{ album: Album; categorySlug: string; eventSlug: string } | null>(null);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const title = view === "list" ? "Album" : view === "new" ? "Nuovo album" : view === "edit" ? "Modifica album" : "Salvato";

  return (
    <div className="px-6 sm:px-10 lg:px-16 pb-32 lg:pb-16 max-w-4xl mx-auto">
      <div className="pt-12 pb-8 flex items-center justify-between">
        <div>
          <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Pannello amministrazione</div>
          <h1 className="font-display text-4xl text-white">{title}</h1>
        </div>
        <button onClick={() => setAuthed(false)} className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">
          <LogOut className="h-3.5 w-3.5" /> Esci
        </button>
      </div>

      {view === "list" && (
        <AlbumList
          onNew={() => setView("new")}
          onEdit={(album, cat, ev) => {
            setEditData({ album, categorySlug: cat, eventSlug: ev });
            setView("edit");
          }}
        />
      )}
      {view === "new" && (
        <AlbumForm
          onBack={() => setView("list")}
          onDone={(url) => { setDoneUrl(url); setIsEditDone(false); setView("done"); }}
        />
      )}
      {view === "edit" && editData && (
        <AlbumForm
          onBack={() => setView("list")}
          onDone={(url) => { setDoneUrl(url); setIsEditDone(true); setView("done"); }}
          editAlbum={editData.album}
          editCategorySlug={editData.categorySlug}
          editEventSlug={editData.eventSlug}
        />
      )}
      {view === "done" && (
        <DoneState
          url={doneUrl}
          isEdit={isEditDone}
          onNew={() => setView("new")}
          onList={() => setView("list")}
        />
      )}
    </div>
  );
}
