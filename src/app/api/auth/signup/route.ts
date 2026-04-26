import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";

const Body = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
  role: z.enum(["seeker", "employer"]),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(parsed.email);
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const result = db
    .prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)")
    .run(parsed.email, hashPassword(parsed.password), parsed.role);

  const userId = Number(result.lastInsertRowid);
  const token = createSession(userId);
  setSessionCookie(token);

  return NextResponse.json({ id: userId, email: parsed.email, role: parsed.role });
}
