import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { defaultSettings, type SettingKey } from "@/lib/defaults";
import { deepMerge } from "@/lib/utils";
import { refreshSite } from "@/lib/admin-api";

type Ctx = { params: Promise<{ key: string }> };

const isKey = (k: string): k is SettingKey => k in defaultSettings;

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { key } = await params;
  if (!isKey(key)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const row = await db.setting.findUnique({ where: { key } });
  return NextResponse.json(deepMerge(defaultSettings[key], row?.value));
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { key } = await params;
  if (!isKey(key)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const value = await req.json();
  if (!value || typeof value !== "object") return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  refreshSite();
  return NextResponse.json({ ok: true });
}

/** Reset a section back to the built-in defaults. */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { key } = await params;
  if (!isKey(key)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.setting.deleteMany({ where: { key } });
  refreshSite();
  return NextResponse.json(defaultSettings[key]);
}
