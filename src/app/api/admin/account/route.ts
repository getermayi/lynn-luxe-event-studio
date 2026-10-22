import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, cookieOptions, createSession } from "@/lib/auth";
import { currentEmail, setLogin, verifyLogin } from "@/lib/credentials";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ email: await currentEmail() });
}

/** Change the admin email and/or password. Requires the current password. */
export async function PUT(req: NextRequest) {
  const { currentPassword = "", email = "", newPassword = "" } = await req.json().catch(() => ({}));
  const nowEmail = await currentEmail();
  if (!(await verifyLogin(nowEmail, String(currentPassword)))) {
    return NextResponse.json({ error: "Your current password is incorrect." }, { status: 400 });
  }
  const nextEmail = String(email || nowEmail).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  const nextPass = String(newPassword || currentPassword);
  if (nextPass.length < 8) return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });

  await setLogin(nextEmail, nextPass);
  const res = NextResponse.json({ ok: true, email: nextEmail });
  res.cookies.set(SESSION_COOKIE, await createSession(nextEmail), cookieOptions);
  return res;
}
