// ─── Compressione video lato browser con FFmpeg.wasm ─────────────────────────
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;

async function getFFmpeg(onProgress?: (msg: string) => void): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;

  const ffmpeg = new FFmpeg();
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

  if (onProgress) {
    ffmpeg.on("log", ({ message }) => onProgress(message));
  }

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

export type VideoCompressProgress = {
  phase: "loading" | "processing" | "done";
  percent: number;
};

/**
 * Comprime un video lato browser per renderlo adatto al web.
 * Output: H.264, max 1080p, bitrate moderato, audio AAC.
 *
 * @param file     - File video originale
 * @param onProgress - Callback per aggiornamenti di progresso
 */
export async function compressVideo(
  file: File,
  onProgress?: (p: VideoCompressProgress) => void
): Promise<File> {
  onProgress?.({ phase: "loading", percent: 0 });

  const ffmpeg = await getFFmpeg();

  ffmpeg.on("progress", ({ progress }) => {
    onProgress?.({ phase: "processing", percent: Math.min(100, Math.round(progress * 100)) });
  });

  const inputName = "input" + (file.name.match(/\.[^.]+$/)?.[0] ?? ".mp4");
  const outputName = "output.mp4";

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // Scala a max 1080p, codifica H.264 con CRF 26 (buon compromesso qualità/peso),
  // audio AAC 128k, preset "fast" per non far attendere troppo
  await ffmpeg.exec([
    "-i", inputName,
    "-vf", "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease",
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "26",
    "-c:a", "aac",
    "-b:a", "128k",
    "-movflags", "+faststart",
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);
  const blob = new Blob([data as Uint8Array<ArrayBuffer>], { type: "video/mp4" });

  onProgress?.({ phase: "done", percent: 100 });

  const outputFile = new File(
    [blob],
    file.name.replace(/\.[^.]+$/, ".mp4"),
    { type: "video/mp4" }
  );

  // Pulizia memoria
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return outputFile;
}
