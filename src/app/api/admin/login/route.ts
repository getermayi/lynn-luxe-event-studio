import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, cookieOptions, createSession } from "@/lib/auth";
import { verifyLogin } from "@/lib/credentials";

export const runtime = "nodejs";

const attempts = new Map<string, { n: number; until: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const a = attempts.get(ip);
  if (a && a.until > Date.now()) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const { email = "", password = "" } = await req.json().catch(() => ({}));
  if (!(await verifyLogin(String(email), String(password)))) {
    const n = (a?.n ?? 0) + 1;
    attempts.set(ip, { n, until: n >= 5 ? Date.now() + 5 * 60_000 : 0 });
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }

  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSession(String(email)), cookieOptions);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return res;
}
