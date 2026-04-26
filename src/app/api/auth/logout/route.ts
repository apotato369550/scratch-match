import { NextResponse } from "next/server";
import { getSessionToken, destroySession, clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const token = getSessionToken();
  if (token) destroySession(token);
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
