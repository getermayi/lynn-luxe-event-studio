import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db } from "./db";
import { safeEqual } from "./auth";

// Admin login. Once changed from the dashboard, the email + hashed password live in the
// database (setting key "__admin"); until then the ADMIN_EMAIL / ADMIN_PASSWORD env values apply.
const KEY = "__admin";

type Stored = { email: string; salt: string; hash: string; updatedAt: string };

async function stored(): Promise<Stored | null> {
  const row = await db.setting.findUnique({ where: { key: KEY } });
  return (row?.value as Stored | undefined) ?? null;
}

const hashOf = (password: string, salt: string) => scryptSync(password, salt, 64).toString("hex");

export async function currentEmail() {
  return (await stored())?.email ?? (process.env.ADMIN_EMAIL ?? "");
}

export async function verifyLogin(email: string, password: string) {
  const s = await stored();
  const e = email.trim().toLowerCase();
  if (s) {
    const a = Buffer.from(hashOf(password, s.salt), "hex");
    const b = Buffer.from(s.hash, "hex");
    return safeEqual(e, s.email) && a.length === b.length && timingSafeEqual(a, b);
  }
  if (!process.env.ADMIN_PASSWORD) return false;
  return safeEqual(e, (process.env.ADMIN_EMAIL ?? "").toLowerCase()) && safeEqual(password, process.env.ADMIN_PASSWORD);
}

export async function setLogin(email: string, password: string) {
  const salt = randomBytes(16).toString("hex");
  const value: Stored = { email: email.trim().toLowerCase(), salt, hash: hashOf(password, salt), updatedAt: new Date().toISOString() };
  await db.setting.upsert({ where: { key: KEY }, update: { value }, create: { key: KEY, value } });
}
