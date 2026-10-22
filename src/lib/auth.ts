import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "ll_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const secret = () =>
  new TextEncoder().encode(process.env.AUTH_SECRET || "dev-only-secret-change-me-please-0000");

export async function createSession(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as { email: string };
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};

/** Constant-time string compare (works in both Node and Edge runtimes). */
export function safeEqual(a: string, b: string) {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}
