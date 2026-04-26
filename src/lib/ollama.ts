const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL ?? "mistral";
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";
const VERBOSE = process.env.OLLAMA_VERBOSE === "true";

export const EMBED_DIMS = 768;

function log(...args: unknown[]) {
  if (VERBOSE) console.log("[ollama]", ...args);
}

export async function embed(text: string): Promise<number[]> {
  const t0 = Date.now();
  const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, prompt: text }),
  });
  if (!res.ok) {
    throw new Error(`Ollama embed failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { embedding: number[] };
  if (!data.embedding || data.embedding.length !== EMBED_DIMS) {
    throw new Error(
      `Ollama embed returned unexpected vector length ${data.embedding?.length} (expected ${EMBED_DIMS})`
    );
  }
  log(`embed ${text.length}c → ${data.embedding.length}d in ${Date.now() - t0}ms`);
  return data.embedding;
}

export async function embedMany(texts: string[]): Promise<number[][]> {
  const out: number[][] = [];
  for (const t of texts) out.push(await embed(t));
  return out;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  const t0 = Date.now();
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: CHAT_MODEL, messages, stream: false }),
  });
  if (!res.ok) {
    throw new Error(`Ollama chat failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { message: { content: string } };
  log(`chat ${messages.length} msgs → ${data.message.content.length}c in ${Date.now() - t0}ms`);
  return data.message.content;
}

export async function ping(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function listModels(): Promise<string[]> {
  const res = await fetch(`${OLLAMA_URL}/api/tags`);
  if (!res.ok) return [];
  const data = (await res.json()) as { models?: { name: string }[] };
  return (data.models ?? []).map((m) => m.name);
}

export async function pullModel(name: string): Promise<void> {
  const res = await fetch(`${OLLAMA_URL}/api/pull`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, stream: false }),
  });
  if (!res.ok) {
    throw new Error(`Ollama pull '${name}' failed: ${res.status} ${await res.text()}`);
  }
}
