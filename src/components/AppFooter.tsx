export function AppFooter() {
  return (
    <footer className="mt-24 border-t border-white/10 px-6 lg:px-12 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono-ui text-[11px] uppercase tracking-[0.16em] text-white/40">
        <div>
          <div className="text-white/60 mb-2">Tipografia Nuova Stampa</div>
          <div>Via della Stampa, 12</div>
          <div>13046 Livorno Ferraris (VC)</div>
        </div>
        <div>
          <div className="text-white/60 mb-2">Contatti</div>
          <div>info@nuovastampa.it</div>
          <div>+39 0161 000 000</div>
        </div>
        <div>
          <div className="text-white/60 mb-2">Dati fiscali</div>
          <div>P.IVA 00000000000</div>
          <div>REA VC-000000</div>
        </div>
        <div>
          <div className="text-white/60 mb-2">Orari</div>
          <div>Lun – Ven · 8:30 – 18:00</div>
          <div>Sabato su appuntamento</div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-white/5 font-mono-ui text-[10px] tracking-widest text-white/25 uppercase">
        © {new Date().getFullYear()} Tipografia Nuova Stampa — Tutti i diritti riservati
      </div>
    </footer>
  );
}
