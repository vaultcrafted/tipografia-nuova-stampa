import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u").replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Ridimensiona e comprime un'immagine prima dell'upload.
 * - Max 2000px sul lato lungo
 * - Qualità JPEG 85%
 * - Risultato sempre JPEG (salvo PNG con trasparenza)
 */
export async function compressImage(file: File, maxPx = 2000, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      const scale = Math.min(1, maxPx / Math.max(width, height));
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, w, h);

      // Usa PNG solo se il file originale è PNG con trasparenza potenziale
      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
      const ext = outputType === "image/png" ? "png" : "jpg";
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          const name = file.name.replace(/\.[^.]+$/, `.${ext}`);
          resolve(new File([blob], name, { type: outputType }));
        },
        outputType,
        outputType === "image/jpeg" ? quality : undefined
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Errore caricamento immagine")); };
    img.src = url;
  });
}
