import { NextResponse, type NextRequest } from "next/server";
import { apiError, clean, delegate, getResource, missingRequired, refreshSite } from "@/lib/admin-api";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const r = getResource((await params).resource);
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parent = req.nextUrl.searchParams.get("parent");
  const where = r.parent && parent ? { [r.parent.field]: parent } : undefined;
  const orderBy = r.model === "lead" ? { createdAt: "desc" } : [{ order: "asc" }, { createdAt: "asc" }];
  const include = r.model === "service" ? { _count: { select: { subServices: true } } } : undefined;
  const rows = await delegate(r).findMany({ where, orderBy, include });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const r = getResource((await params).resource);
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const data = clean(r, await req.json());
    const missing = missingRequired(r, data);
    if (missing.length) return NextResponse.json({ error: `Please fill in: ${missing.join(", ")}` }, { status: 400 });
    if (r.orderable && data.order === undefined) {
      data.order = await delegate(r).count(r.parent ? { where: { [r.parent.field]: data[r.parent.field] } } : undefined);
    }
    const row = await delegate(r).create({ data });
    refreshSite();
    return NextResponse.json(row);
  } catch (e) {
    return apiError(e);
  }
}
