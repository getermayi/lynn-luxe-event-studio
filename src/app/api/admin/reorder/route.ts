import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { delegate, getResource, refreshSite } from "@/lib/admin-api";

export async function POST(req: NextRequest) {
  const { resource, ids } = (await req.json()) as { resource: string; ids: string[] };
  const r = getResource(resource);
  if (!r || !r.orderable || !Array.isArray(ids)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  await db.$transaction(ids.map((id, order) => delegate(r).update({ where: { id }, data: { order } })));
  refreshSite();
  return NextResponse.json({ ok: true });
}
