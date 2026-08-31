#!/usr/bin/env bash
# Monta il video dell'hero della home a partire da tre clip generate.
#
#   ./scripts/hero-encode.sh clip1.mp4 clip2.mp4 clip3.mp4
#
# Produce in public/media/_hero/:
#   hero.mp4        1280x648, ~12,5 s — desktop e tablet.
#   hero-small.mp4  854 px di larghezza — telefoni: l'hero parte da solo, e far
#                   pagare 1,7 MB di traffico a chi e' in giro sarebbe scortese.
#   hero.webp       poster, preso a 1,2 s (non a 0, dove c'e' la dissolvenza
#                   dal nero e si vedrebbe un poster nero).
#
# SCELTE DI MONTAGGIO, e perche'
#
# - Ogni clip e' tagliata a 4,6 s dei 5 disponibili: l'ultimo mezzo secondo dei
#   video generati e' spesso dove il movimento si spegne o compare un artefatto.
# - Dissolvenze incrociate di 0,7 s: uno stacco secco fra tre inquadrature cosi'
#   diverse sembra un errore di caricamento.
# - Apre e chiude sul nero. E' quello che rende il loop invisibile: il punto in
#   cui il video riparte cade fra due fotogrammi neri, quindi non si vede nessun
#   salto. Senza, l'ultimo fotogramma tornerebbe di colpo al primo.
# - Crop di 60 px in alto su tutte: toglie soffitto e parete chiara, e soprattutto
#   porta le tre clip allo stesso formato, senza cui xfade non le monta.
set -euo pipefail

A="${1:?servono tre clip: clip1 clip2 clip3}"
B="${2:?servono tre clip: clip1 clip2 clip3}"
C="${3:?servono tre clip: clip1 clip2 clip3}"
DEST="public/media/_hero"
mkdir -p "$DEST"

CR="crop=1280:648:0:60,setsar=1,fps=24"
D=4.6   # durata utile di ogni clip
X=0.7   # durata della dissolvenza

ffmpeg -v error -y -i "$A" -i "$B" -i "$C" -filter_complex "\
[0:v]trim=0:$D,setpts=PTS-STARTPTS,$CR[v0];\
[1:v]trim=0:$D,setpts=PTS-STARTPTS,$CR[v1];\
[2:v]trim=0:$D,setpts=PTS-STARTPTS,$CR[v2];\
[v0][v1]xfade=transition=fade:duration=$X:offset=3.9[x1];\
[x1][v2]xfade=transition=fade:duration=$X:offset=7.8[x2];\
[x2]fade=t=in:st=0:d=0.6,fade=t=out:st=11.8:d=0.6[o]" \
  -map "[o]" -an -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p \
  -movflags +faststart "$DEST/hero.mp4"

ffmpeg -v error -y -i "$DEST/hero.mp4" -an -vf scale=854:-2 \
  -c:v libx264 -crf 31 -preset slow -pix_fmt yuv420p -movflags +faststart \
  "$DEST/hero-small.mp4"

ffmpeg -v error -y -ss 1.2 -i "$DEST/hero.mp4" -frames:v 1 -q:v 80 "$DEST/hero.webp"

ls -l "$DEST"
