import "dotenv/config";
import { db } from "../src/lib/db";

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const EMAIL = `bones-test+${Date.now()}@example.ph`;
const PASSWORD = "test-password-123";

let passed = 0;
let failed = 0;

function ok(label: string, cond: unknown, detail?: string) {
  if (cond) {
    console.log(`  PASS  ${label}`);
    passed++;
  } else {
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

function section(label: string) {
  console.log(`\n[${label}]`);
}

let cookie = "";

function captureCookie(res: Response) {
  const set = res.headers.get("set-cookie");
  if (!set) return;
  const m = set.match(/sm_session=([^;]+)/);
  if (m) cookie = `sm_session=${m[1]}`;
}

async function call(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  withCookie = true
): Promise<{ res: Response; data: any }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(withCookie && cookie ? { cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  captureCookie(res);
  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { res, data };
}

async function main() {
  console.log(`Scratch Match — bones integration test`);
  console.log(`base: ${BASE}`);
  console.log(`email: ${EMAIL}`);

  // 0. Server reachable
  section("server reachable");
  try {
    const r = await fetch(`${BASE}/api/me`);
    ok("GET /api/me responds", r.ok || r.status === 200);
  } catch (e) {
    console.log(`  FAIL  server unreachable at ${BASE}`);
    console.log(`        start it with: npm run dev`);
    process.exit(1);
  }

  // 1. Schema sanity
  section("schema");
  const tables = (
    db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[]
  ).map((r) => r.name);
  for (const t of [
    "users",
    "seeker_profiles",
    "employer_profiles",
    "cvs",
    "jobs",
    "matches",
    "sessions",
  ]) {
    ok(`table ${t} exists`, tables.includes(t));
  }

  // 2. Signup
  section("signup");
  {
    const { res, data } = await call(
      "POST",
      "/api/auth/signup",
      { email: EMAIL, password: PASSWORD, role: "seeker" },
      false
    );
    ok("status 200", res.status === 200, `got ${res.status}`);
    ok("returns role=seeker", data?.role === "seeker");
    ok("returns numeric id", typeof data?.id === "number");
    ok("sets sm_session cookie", cookie.startsWith("sm_session="));
  }

  // 3. /me with cookie
  section("/api/me (authenticated)");
  {
    const { res, data } = await call("GET", "/api/me");
    ok("status 200", res.status === 200);
    ok("returns user", data?.user?.email === EMAIL);
    ok("role=seeker", data?.user?.role === "seeker");
  }

  // 4. Duplicate signup → 409
  section("duplicate signup");
  {
    const { res } = await call(
      "POST",
      "/api/auth/signup",
      { email: EMAIL, password: PASSWORD, role: "seeker" },
      false
    );
    ok("status 409", res.status === 409, `got ${res.status}`);
  }

  // 5. Bad signup payload → 400
  section("invalid signup");
  {
    const { res } = await call(
      "POST",
      "/api/auth/signup",
      { email: "not-an-email", password: "x", role: "seeker" },
      false
    );
    ok("status 400", res.status === 400, `got ${res.status}`);
  }

  // 6. Logout
  section("logout");
  {
    const { res } = await call("POST", "/api/auth/logout");
    ok("status 200", res.status === 200);
    cookie = ""; // server cleared it; drop locally too
  }

  // 7. /me without cookie
  section("/api/me (anonymous)");
  {
    const { res, data } = await call("GET", "/api/me", undefined, false);
    ok("status 200", res.status === 200);
    ok("user is null", data?.user === null);
  }

  // 8. Login wrong password
  section("login (wrong password)");
  {
    const { res } = await call(
      "POST",
      "/api/auth/login",
      { email: EMAIL, password: "wrong" },
      false
    );
    ok("status 401", res.status === 401, `got ${res.status}`);
  }

  // 9. Login correct
  section("login (correct)");
  {
    const { res, data } = await call(
      "POST",
      "/api/auth/login",
      { email: EMAIL, password: PASSWORD },
      false
    );
    ok("status 200", res.status === 200, `got ${res.status}`);
    ok("returns role", data?.role === "seeker");
    ok("sets sm_session cookie", cookie.startsWith("sm_session="));
  }

  // 10. Sample data sanity
  section("sample data");
  const seekerCount = (
    db.prepare("SELECT COUNT(*) AS n FROM users WHERE role='seeker'").get() as { n: number }
  ).n;
  const employerCount = (
    db.prepare("SELECT COUNT(*) AS n FROM users WHERE role='employer'").get() as { n: number }
  ).n;
  const jobCount = (db.prepare("SELECT COUNT(*) AS n FROM jobs").get() as { n: number }).n;
  ok("at least 3 seekers", seekerCount >= 3, `found ${seekerCount}`);
  ok("at least 2 employers", employerCount >= 2, `found ${employerCount}`);
  ok("at least 4 jobs", jobCount >= 4, `found ${jobCount}`);

  // Cleanup: remove the test user (cascades sessions)
  section("cleanup");
  const r = db.prepare("DELETE FROM users WHERE email = ?").run(EMAIL);
  ok("test user removed", r.changes === 1);

  console.log(`\n${failed === 0 ? "ALL CHECKS PASSED" : "SOME CHECKS FAILED"}  (${passed} passed, ${failed} failed)`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
