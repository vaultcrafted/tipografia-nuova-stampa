#!/usr/bin/env python3
"""Scarica gli asset generati su Higgsfield, li ottimizza e li scrive in public/media/.
Va eseguito nella sandbox Higgsfield: e' l'unico ambiente che raggiunge il CDN."""
import concurrent.futures as cf, os, subprocess, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLAN = os.path.join(ROOT, "scripts", "media-plan.tsv")
OUT  = os.path.join(ROOT, "public", "media")
TMP  = os.path.join(ROOT, "tmp-media")

def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    return p.returncode, (p.stderr or "").strip()[:200]

def one(url, target):
    dest = os.path.join(OUT, target)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return f"SKIP {target}"
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    os.makedirs(TMP, exist_ok=True)
    src = os.path.join(TMP, target.replace("/", "_") + ".src")
    try:
        urllib.request.urlretrieve(url, src)
    except Exception as e:
        return f"DLFAIL {target} {e}"
    if target.endswith(".webp"):
        rc, err = run(["convert", src, "-resize", "1600x1600>", "-quality", "82",
                       "-define", "webp:method=5", dest])
    else:
        rc, err = run(["ffmpeg", "-y", "-loglevel", "error", "-i", src,
                       "-vf", "scale='min(1280,iw)':-2", "-c:v", "libx264",
                       "-crf", "26", "-preset", "veryfast", "-an",
                       "-movflags", "+faststart", dest])
    os.remove(src)
    return (f"OK {target}" if rc == 0 else f"CONVFAIL {target} {err}")

jobs = []
for line in open(PLAN):
    parts = line.rstrip("\n").split("\t")
    if len(parts) == 2 and parts[0].startswith("http"):
        jobs.append(tuple(parts))
print(f"{len(jobs)} asset da elaborare", flush=True)

bad = 0
with cf.ThreadPoolExecutor(max_workers=6) as ex:
    for r in ex.map(lambda a: one(*a), jobs):
        print(r, flush=True)
        if not r.startswith(("OK", "SKIP")):
            bad += 1
subprocess.run(["rm", "-rf", TMP])
print(f"FINITO — errori: {bad}", flush=True)
