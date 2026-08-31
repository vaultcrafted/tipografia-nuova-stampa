#!/usr/bin/env bash
# Monta il video dell'hero della home a partire da tre clip generate.
#
#   ./scripts/hero-encode.sh clip1.mp4 clip2.mp4 clip3.mp4
#
# Produce in public/media/_hero/:
#   hero.mp4        1280x720, ~11,7 s — desktop e tablet.
#   hero-small.mp4  854 px di larghezza — telefoni: l'hero parte da solo, e far
#                   pagare 1,3 MB di traffico a chi e' in giro sarebbe scortese.
#   hero.webp       poster, primo fotogramma utile.
#
# SCELTE DI MONTAGGIO, e perche'
#
# - Ogni clip e' tagliata a 4,6 s dei 5 disponibili: l'ultimo mezzo secondo dei
#   video generati e' spesso dove il movimento si spegne o compare un artefatto.
# - Dissolvenze incrociate di 0,7 s fra un'inquadratura e l'altra: uno stacco
#   secco fra tre riprese cosi' diverse sembra un errore di caricamento.
# - Il loop si chiude dissolvendo la CODA sulla TESTA (secondo passaggio), non
#   sfumando al nero. Il risultato e' che l'ultimo fotogramma coincide col primo:
#   il punto in cui il video riparte non esiste piu'. La versione precedente,
#   scura, apriva e chiudeva sul nero; qui il video e' chiaro e quel nero
#   sarebbe uno sbattimento in faccia ogni undici secondi.
# - Niente crop: le sorgenti chiare non hanno soffitti neri da togliere. Le clip
#   vengono solo normalizzate a 1280x720 24 fps, che serve perche' xfade lavori.
set -euo pipefail

A="${1:?servono tre clip: clip1 clip2 clip3}"
B="${2:?servono tre clip: clip1 clip2 clip3}"
C="${3:?servono tre clip: clip1 clip2 clip3}"
DEST="public/media/_hero"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$DEST"

NORM="setsar=1,fps=24,scale=1280:720"
D=4.6   # durata utile di ogni clip
X=0.7   # durata della dissolvenza fra le clip
L=0.8   # durata della dissolvenza che chiude il giro

# 1) le tre inquadrature in fila. crf basso: e' un file di passaggio, non deve
#    aggiungere artefatti che poi il secondo passaggio ricomprime.
ffmpeg -v error -y -i "$A" -i "$B" -i "$C" -filter_complex "\
[0:v]trim=0:$D,setpts=PTS-STARTPTS,$NORM[v0];\
[1:v]trim=0:$D,setpts=PTS-STARTPTS,$NORM[v1];\
[2:v]trim=0:$D,setpts=PTS-STARTPTS,$NORM[v2];\
[v0][v1]xfade=transition=fade:duration=$X:offset=3.9[x1];\
[x1][v2]xfade=transition=fade:duration=$X:offset=7.8[o]" \
  -map "[o]" -an -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p "$TMP/seq.mp4"

# 2) chiusura del giro. Il corpo (da L in poi) si dissolve sulla testa (i primi
#    L secondi): l'uscita finisce esattamente sul fotogramma con cui inizia.
#    offset = durata_corpo - L = (12,4 - 0,8) - 0,8 = 10,8.
ffmpeg -v error -y -i "$TMP/seq.mp4" -filter_complex "\
[0:v]split[a][b];\
[a]trim=start=$L,setpts=PTS-STARTPTS[body];\
[b]trim=0:$L,setpts=PTS-STARTPTS[head];\
[body][head]xfade=transition=fade:duration=$L:offset=10.8[o]" \
  -map "[o]" -an -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p \
  -movflags +faststart "$DEST/hero.mp4"

ffmpeg -v error -y -i "$DEST/hero.mp4" -an -vf scale=854:-2 \
  -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart \
  "$DEST/hero-small.mp4"

ffmpeg -v error -y -ss 0.3 -i "$DEST/hero.mp4" -frames:v 1 -q:v 80 "$DEST/hero.webp"

ls -l "$DEST"
