#!/usr/bin/env python3
"""
Genera le versioni ridotte delle immagini di catalogo.

PERCHE'
Le foto sono tutte a 1600px, e la piu' pesante e' 128 kB. Nella home finiscono
dentro riquadri larghi 170px sul telefono: si scaricavano 830 kB di immagini per
mostrarne si' e no 60. Su una connessione mobile in giro sono secondi di attesa
per niente.

Cloudflare puo' ridimensionare al volo con /cdn-cgi/image/, ma su questa zona non
e' attivo (risponde 404), quindi i file ridotti si preparano qui e si mettono in
repository accanto agli originali.

QUALI MISURE E PERCHE'
  verticali (copertine, 1195x1600)   → 320w, 480w e 640w
      la scheda del telefono e' larga ~175px, che a schermo doppio fanno 350px
      reali: con soli 320 e 640 il browser era costretto a salire a 640 e a
      scaricare 45 kB invece di 29. Il gradino da 480 esiste per questo.
  orizzontali (scatti a-d, 1600x1195) → 400w e 800w
      800 copre il riquadro della galleria (~350px) a schermo doppio.
L'originale resta come ultimo gradino del srcset e serve al lightbox, dove
l'immagine si guarda davvero a piena pagina.

USO
    python3 scripts/immagini-derivate.py
E' idempotente: rigenera solo quello che manca o e' piu' vecchio dell'originale.
"""

import os
import sys
from PIL import Image

RADICE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "media")
QUALITA = 82

# Le cartelle che cominciano con "_" sono materiale di servizio (texture, sfondi),
# non entrano nelle schede prodotto.
def cartelle():
    for nome in sorted(os.listdir(RADICE)):
        percorso = os.path.join(RADICE, nome)
        if os.path.isdir(percorso) and not nome.startswith("_"):
            yield percorso


def misure(larghezza, altezza):
    return (320, 480, 640) if altezza > larghezza else (400, 800)


def main():
    fatti = 0
    saltati = 0
    byte = 0
    for cartella in cartelle():
        for nome in sorted(os.listdir(cartella)):
            if not nome.endswith(".webp"):
                continue
            # Non si generano derivate delle derivate.
            if any(nome.endswith(f"-{w}.webp") for w in (320, 400, 480, 640, 800)):
                continue
            origine = os.path.join(cartella, nome)
            with Image.open(origine) as im:
                larghezza, altezza = im.size
                for w in misure(larghezza, altezza):
                    if w >= larghezza:
                        continue
                    destinazione = origine[: -len(".webp")] + f"-{w}.webp"
                    if os.path.exists(destinazione) and os.path.getmtime(destinazione) >= os.path.getmtime(origine):
                        saltati += 1
                        byte += os.path.getsize(destinazione)
                        continue
                    h = round(altezza * w / larghezza)
                    im.resize((w, h), Image.LANCZOS).save(
                        destinazione, "WEBP", quality=QUALITA, method=6
                    )
                    fatti += 1
                    byte += os.path.getsize(destinazione)
    print(f"generate {fatti}, gia' presenti {saltati}, in tutto {byte // 1024 // 1024} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
