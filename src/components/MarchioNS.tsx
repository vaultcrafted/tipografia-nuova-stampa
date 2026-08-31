/**
 * Marchio Tipografia Nuova Stampa.
 *
 * Un carattere mobile visto in faccia: il blocco, la N scavata e la tacca
 * semicircolare sul fianco — la scanalatura che il compositore usa per sentire
 * al tatto il verso della lettera senza doverla guardare.
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
      <mask id="marchio-ns-n">
        <rect width="100" height="100" fill="#fff" />
        <g fill="#000">
          <rect x="32" y="26" width="13" height="48" />
          <rect x="59" y="26" width="13" height="48" />
          <polygon points="32,26 45,26 72,74 59,74" />
        </g>
      </mask>
      <path
        fill="currentColor"
        mask="url(#marchio-ns-n)"
        d="M10 4h82a6 6 0 0 1 6 6v80a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V65a15 15 0 0 0 0-30V10a6 6 0 0 1 6-6z"
      />
    </svg>
  );
}
