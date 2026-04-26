import "dotenv/config";
import { ensureCollections, ping, qdrant, COLL_CV, COLL_JOB } from "../src/lib/qdrant";

async function main() {
  if (!(await ping())) {
    console.error("Qdrant not reachable. Is the docker container running?");
    console.error("  docker compose up -d qdrant");
    process.exit(1);
  }
  await ensureCollections();
  for (const name of [COLL_CV, COLL_JOB]) {
    const info = await qdrant.getCollection(name);
    console.log(`  ${name}: status=${info.status} points=${info.points_count ?? 0}`);
  }
  console.log("Qdrant collections ready.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
