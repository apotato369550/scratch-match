import { NextResponse } from "next/server";
import { z } from "zod";
import { db, type UserRow } from "@/lib/db";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";

const Body = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(parsed.email) as
    | UserRow
    | undefined;

  if (!user || !verifyPassword(parsed.password, user.password_hash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  setSessionCookie(createSession(user.id));
  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}
