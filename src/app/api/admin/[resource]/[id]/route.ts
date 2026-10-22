import { NextResponse, type NextRequest } from "next/server";
import { apiError, clean, delegate, getResource, missingRequired, refreshSite } from "@/lib/admin-api";

type Ctx = { params: Promise<{ resource: string; id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { resource, id } = await params;
  const r = getResource(resource);
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const row = await delegate(r).findUnique({ where: { id } });
  return row ? NextResponse.json(row) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { resource, id } = await params;
  const r = getResource(resource);
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await req.json();
    const data = clean(r, body, true);
    if ("slug" in data && !data.slug) delete data.slug;
    const missing = missingRequired(r, { ...body, ...data }).filter((label) =>
      r.fields.some((f) => f.label === label && f.name in body),
    );
    if (missing.length) return NextResponse.json({ error: `Please fill in: ${missing.join(", ")}` }, { status: 400 });
    const row = await delegate(r).update({ where: { id }, data });
    refreshSite();
    return NextResponse.json(row);
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { resource, id } = await params;
  const r = getResource(resource);
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    await delegate(r).delete({ where: { id } });
    refreshSite();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
