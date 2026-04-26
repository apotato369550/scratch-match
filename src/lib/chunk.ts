const SIZE = Number(process.env.CHUNK_SIZE_TOKENS ?? 500);
const OVERLAP = Number(process.env.CHUNK_OVERLAP_TOKENS ?? 50);

export interface ChunkOptions {
  size?: number;
  overlap?: number;
}

export function chunk(text: string, opts: ChunkOptions = {}): string[] {
  const size = opts.size ?? SIZE;
  const overlap = opts.overlap ?? OVERLAP;
  if (size <= 0) throw new Error("chunk size must be > 0");
  if (overlap < 0 || overlap >= size) throw new Error("overlap must be 0..<size");

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const chunks: string[] = [];
  const step = size - overlap;
  for (let i = 0; i < words.length; i += step) {
    const slice = words.slice(i, i + size);
    if (slice.length === 0) break;
    chunks.push(slice.join(" "));
    if (i + size >= words.length) break;
  }
  return chunks;
}
