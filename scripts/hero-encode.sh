#!/usr/bin/env bash
# Prepara i file dell'hero della home a partire da un mp4 sorgente.
#
#   ./scripts/hero-encode.sh sorgente.mp4
#
# Produce in public/media/_hero/:
#   hero.mp4       all-intra (un keyframe per fotogramma) — serve per lo scrubbing.
#                  Senza -g 1 il browser, per mostrare un fotogramma qualsiasi,
#                  deve decodificare dal keyframe precedente: il video scatta.
#                  Costa in peso (2 MB contro 300 KB) ed e' il prezzo dell'effetto.
#   hero-loop.mp4  compressione normale, 960px — la versione per mobile e per chi
#                  ha prefers-reduced-motion, dove il video va solo in loop.
#   hero.webp      primo fotogramma, usato come poster e come sfondo prima che il
#                  video sia deciso e caricato.
set -euo pipefail

SORGENTE="${1:?serve il file mp4 di partenza}"
DEST="public/media/_hero"
mkdir -p "$DEST"

# Il 13% in alto della sorgente e' soffitto quasi nero: tagliato qui, non via
# CSS. Zoomare nel browser per nasconderlo avrebbe voluto dire ingrandire un
# 720p oltre la sua risoluzione e vedersi l'immagine molle.
CROP="crop=1280:626:0:94"

ffmpeg -v error -y -i "$SORGENTE" -an -vf "$CROP" \
  -c:v libx264 -g 1 -keyint_min 1 -sc_threshold 0 \
  -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart \
  "$DEST/hero.mp4"

ffmpeg -v error -y -i "$SORGENTE" -an -vf "$CROP,scale=960:-2" \
  -c:v libx264 -crf 30 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  "$DEST/hero-loop.mp4"

ffmpeg -v error -y -i "$SORGENTE" -frames:v 1 -vf "$CROP" -q:v 80 \
  "$DEST/hero.webp"

ls -l "$DEST"
