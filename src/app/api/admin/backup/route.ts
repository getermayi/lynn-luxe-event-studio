import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { refreshSite } from "@/lib/admin-api";

export const runtime = "nodejs";

const strip = <T extends { createdAt?: Date; updatedAt?: Date }>(rows: T[]) =>
  rows.map(({ createdAt: _c, updatedAt: _u, ...r }) => r);

/** Download every piece of website content (and leads) as one JSON file. */
export async function GET() {
  const [settings, services, subServices, events, venues, projects, posts, gallery, testimonials, faqs, leads] = await Promise.all([
    db.setting.findMany({ where: { NOT: { key: "__admin" } } }),
    db.service.findMany(),
    db.subService.findMany(),
    db.eventType.findMany(),
    db.venue.findMany(),
    db.project.findMany(),
    db.post.findMany(),
    db.galleryItem.findMany(),
    db.testimonial.findMany(),
    db.faq.findMany(),
    db.lead.findMany(),
  ]);
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: settings.map(({ key, value }) => ({ key, value })),
    services: strip(services),
    subServices: strip(subServices),
    events: strip(events),
    venues: strip(venues),
    projects: strip(projects),
    posts: strip(posts),
    gallery: strip(gallery),
    testimonials: strip(testimonials),
    faqs: strip(faqs),
    leads: leads.map((l) => ({ ...l, createdAt: l.createdAt.toISOString(), updatedAt: undefined })),
  };
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="lynn-luxe-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}

/** Restore a backup file — replaces all website content (leads are kept and merged). */
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => null);
  if (!b || b.version !== 1 || !Array.isArray(b.services)) {
    return NextResponse.json({ error: "That doesn't look like a Lynn Luxe backup file." }, { status: 400 });
  }
  try {
    await db.$transaction(async (tx) => {
      await tx.subService.deleteMany();
      await tx.service.deleteMany();
      await tx.eventType.deleteMany();
      await tx.venue.deleteMany();
      await tx.project.deleteMany();
      await tx.post.deleteMany();
      await tx.galleryItem.deleteMany();
      await tx.testimonial.deleteMany();
      await tx.faq.deleteMany();
      for (const s of b.settings ?? []) {
        if (s.key === "__admin") continue;
        await tx.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: { key: s.key, value: s.value } });
      }
      for (const r of b.services) await tx.service.create({ data: r });
      for (const r of b.subServices ?? []) await tx.subService.create({ data: r });
      for (const r of b.events ?? []) await tx.eventType.create({ data: r });
      for (const r of b.venues ?? []) await tx.venue.create({ data: r });
      for (const r of b.projects ?? []) await tx.project.create({ data: r });
      for (const r of b.posts ?? []) await tx.post.create({ data: r });
      for (const r of b.gallery ?? []) await tx.galleryItem.create({ data: r });
      for (const r of b.testimonials ?? []) await tx.testimonial.create({ data: r });
      for (const r of b.faqs ?? []) await tx.faq.create({ data: r });
      for (const { updatedAt: _u, ...l } of b.leads ?? []) {
        await tx.lead.upsert({ where: { id: l.id }, update: {}, create: { ...l, createdAt: new Date(l.createdAt) } });
      }
    }, { timeout: 60_000 });
    refreshSite();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: `Restore failed — nothing was changed. ${(e as Error).message.slice(0, 200)}` }, { status: 400 });
  }
}
