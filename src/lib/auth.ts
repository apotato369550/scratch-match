import crypto from "node:crypto";
import { cookies } from "next/headers";
import { db, type UserRow, type Role } from "./db";

export { hashPassword, verifyPassword } from "./password";

const SESSION_COOKIE = "sm_session";
const SESSION_TTL_DAYS = 14;

export function createSession(userId: number): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)"
  ).run(token, userId, expires.toISOString());
  return token;
}

export function destroySession(token: string): void {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function setSessionCookie(token: string): void {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export function clearSessionCookie(): void {
  cookies().delete(SESSION_COOKIE);
}

export function getSessionToken(): string | undefined {
  return cookies().get(SESSION_COOKIE)?.value;
}

export function getCurrentUser(): UserRow | null {
  const token = getSessionToken();
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP`
    )
    .get(token) as UserRow | undefined;
  return row ?? null;
}

export function requireRole(user: UserRow | null, ...roles: Role[]): UserRow {
  if (!user) throw new Response("Unauthorized", { status: 401 });
  if (!roles.includes(user.role)) throw new Response("Forbidden", { status: 403 });
  return user;
}
