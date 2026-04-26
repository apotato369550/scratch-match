import "dotenv/config";
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";

const email = (process.env.ADMIN_EMAIL ?? "admin@scratchmatch.local").toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "changeme";

const existing = db.prepare("SELECT id, role FROM users WHERE email = ?").get(email) as
  | { id: number; role: string }
  | undefined;

if (existing) {
  if (existing.role !== "admin") {
    console.error(`User ${email} exists but is role='${existing.role}', not admin. Aborting.`);
    process.exit(1);
  }
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
    hashPassword(password),
    existing.id
  );
  console.log(`Admin ${email} already existed; password reset.`);
} else {
  const r = db
    .prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'admin')")
    .run(email, hashPassword(password));
  console.log(`Admin ${email} created (id=${r.lastInsertRowid}).`);
}
