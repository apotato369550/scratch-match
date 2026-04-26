import "dotenv/config";
import { listModels, pullModel, ping } from "../src/lib/ollama";

const REQUIRED = [
  process.env.OLLAMA_CHAT_MODEL ?? "mistral",
  process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text",
];

async function main() {
  if (!(await ping())) {
    console.error("Ollama not reachable. Is the docker container running?");
    console.error("  docker compose up -d ollama");
    process.exit(1);
  }
  const installed = await listModels();
  console.log("installed models:", installed.length ? installed.join(", ") : "(none)");

  for (const m of REQUIRED) {
    const has = installed.some((n) => n === m || n.startsWith(`${m}:`));
    if (has) {
      console.log(`  ✓ ${m} already present`);
      continue;
    }
    console.log(`  pulling ${m} … (this can take several minutes)`);
    await pullModel(m);
    console.log(`  ✓ ${m} pulled`);
  }
  console.log("Ollama models ready.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
