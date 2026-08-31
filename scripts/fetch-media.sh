#!/usr/bin/env bash
# Scarica gli asset generati su Higgsfield, li ottimizza e li scrive in public/media/.
# Va eseguito nella sandbox Higgsfield (l'unico ambiente che raggiunge il CDN).
set -uo pipefail
cd "$(dirname "$0")/.."
PLAN="scripts/media-plan.tsv"
OUT="public/media"
mkdir -p "$OUT" tmp-media

fetch_one() {
  url="$1"; target="$2"
  dest="public/media/$target"
  mkdir -p "$(dirname "$dest")"
  [ -s "$dest" ] && return 0
  tmp="tmp-media/$(echo "$target" | tr '/' '_')"
  curl -sS --retry 3 --max-time 120 -o "$tmp.src" "$url" || { echo "DL FAIL $target"; return 1; }
  case "$target" in
    *.webp) convert "$tmp.src" -resize 1600x1600\> -quality 82 -define webp:method=5 "$dest" \
              || { echo "CONV FAIL $target"; return 1; } ;;
    *.mp4)  ffmpeg -y -loglevel error -i "$tmp.src" -vf "scale='min(1280,iw)':-2" \
              -c:v libx264 -crf 26 -preset veryfast -an -movflags +faststart "$dest" \
              || { echo "CONV FAIL $target"; return 1; } ;;
  esac
  rm -f "$tmp.src"
  echo "OK $target"
}
export -f fetch_one

awk -F'\t' 'NF==2{print $1"\t"$2}' "$PLAN" \
  | xargs -P 6 -d '\n' -I{} bash -c 'IFS=$"\t" read -r u t <<< "{}"; fetch_one "$u" "$t"'

rm -rf tmp-media
echo "--- risultato ---"
find "$OUT" -type f | wc -l
