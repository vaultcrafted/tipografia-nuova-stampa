/**
 * Marchio Tipografia Nuova Stampa.
 *
 * Un carattere mobile visto in faccia: il blocco, la N scavata e la tacca
 * semicircolare sul fianco — la scanalatura che il compositore usa per sentire
 * al tatto il verso della lettera senza doverla guardare.
 *
 * La N e' un foro nel tracciato (fill-rule evenodd), non una maschera: le
 * maschere SVG vengono rese male da diversi rasterizzatori (favicon, anteprime
 * social, alcuni RIP di stampa).
 *
 * Eredita il colore dal contesto (`currentColor`), quindi funziona in positivo,
 * in negativo e in monocromia senza varianti separate.
 */
export function MarchioNS({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Tipografia Nuova Stampa"
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10 4h82a6 6 0 0 1 6 6v80a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V65a15 15 0 0 0 0-30V10a6 6 0 0 1 6-6z M32 26 L45 26 L59 50.9 L59 26 L72 26 L72 74 L59 74 L45 49.1 L45 74 L32 74 Z"
      />
    </svg>
  );
}
