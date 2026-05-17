export function AppFooter() {
  return (
    <footer className="mt-16 lg:mt-24 border-t border-white/10 px-5 sm:px-8 lg:px-12 py-8 lg:py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 font-mono-ui text-[11px] uppercase tracking-[0.16em] text-white/40">
        <div className="col-span-2 md:col-span-1">
          <div className="text-white/60 mb-2">Tipografia Nuova Stampa</div>
          <div>Via Martiri della Libertà, 65</div>
          <div>13046 Livorno Ferraris (VC)</div>
        </div>
        <div>
          <div className="text-white/60 mb-2">Contatti</div>
          
            href="mailto:t.nuovastampa@gmail.com"
            className="block hover:text-white/70 transition-colors"
          >
            t.nuovastampa@gmail.com
          </a>
          
            href="tel:+393332876277"
            className="block hover:text-white/70 transition-colors mt-1"
          >
            +39 333 287 6277
          </a>
        </div>
        <div>
          <div className="text-white/60 mb-2">Dati fiscali</div>
          <div>P.IVA 02789310022</div>
          <div className="mt-1">REA VC-313502</div>
        </div>
        <div>
          <div className="text-white/60 mb-2">Orari</div>
          <div>Lun – Ven · 8:30 – 18:00</div>
          <div className="mt-1">Sabato su appuntamento</div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-white/5 font-mono-ui text-[10px] tracking-widest text-white/25 uppercase">
        © {new Date().getFullYear()} Tipografia Nuova Stampa — Tutti i diritti riservati
      </div>
    </footer>
  );
}
