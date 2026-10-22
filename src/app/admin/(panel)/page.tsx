import { ArrowRight, CalendarHeart, FileText, Images, Inbox, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { LEAD_STATUSES } from "@/lib/resources";

const statusColor: Record<string, string> = {
  new: "bg-gold-400",
  contacted: "bg-sky-500",
  qualified: "bg-violet-500",
  booked: "bg-emerald-600",
  lost: "bg-ink/30",
};

export default async function Dashboard() {
  const weekAgo = new Date(Date.now() - 7 * 864e5);
  const [total, week, byStatus, bySource, recent, services, subs, gallery, events] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    db.lead.groupBy({ by: ["status"], _count: true }),
    db.lead.groupBy({ by: ["source"], _count: true, orderBy: { _count: { source: "desc" } }, take: 5 }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    db.service.count(),
    db.subService.count(),
    db.galleryItem.count(),
    db.eventType.count(),
  ]);
  const count = (s: string) => byStatus.find((b) => b.status === s)?._count ?? 0;
  const booked = count("booked");
  const conv = total ? Math.round((booked / total) * 100) : 0;

  const cards = [
    { label: "Total leads", value: total, icon: Inbox },
    { label: "Leads this week", value: week, icon: TrendingUp },
    { label: "New — need a call", value: count("new"), icon: Sparkles, gold: true },
    { label: "Booked", value: `${booked} · ${conv}%`, icon: CalendarHeart },
  ];

  return (
    <div>
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-700">Welcome back</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className={c.gold ? "rounded-2xl bg-forest-800 p-5 text-white" : "rounded-2xl bg-white p-5 ring-1 ring-ink/5"}>
            <c.icon className={c.gold ? "h-5 w-5 text-gold-300" : "h-5 w-5 text-gold-600"} />
            <p className="mt-6 font-display text-3xl font-semibold tracking-tight">{c.value}</p>
            <p className={c.gold ? "mt-1 text-sm text-white/60" : "mt-1 text-sm text-muted"}>{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl bg-white p-6 ring-1 ring-ink/5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Latest enquiries</h2>
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-700">
              All leads <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-8 rounded-xl border border-dashed border-ink/15 p-8 text-center text-sm text-muted">
              No enquiries yet. Leads from the quote form, popup and contact page will appear here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/5">
              {recent.map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/leads?open=${l.id}`} className="flex items-center gap-4 py-3.5">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusColor[l.status] ?? "bg-ink/20"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{l.name}</span>
                      <span className="block truncate text-sm text-muted">
                        {[l.eventType, l.eventDate, l.guests && `${l.guests} guests`].filter(Boolean).join(" · ") || l.phone}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">{l.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-ink/5">
            <h2 className="font-display text-lg font-semibold">Pipeline</h2>
            <div className="mt-5 space-y-3">
              {LEAD_STATUSES.map((s) => (
                <div key={s}>
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{s}</span>
                    <span className="font-semibold">{count(s)}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/5">
                    <div className={`h-full rounded-full ${statusColor[s]}`} style={{ width: `${total ? (count(s) / total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {bySource.length > 0 && (
              <>
                <h3 className="mt-7 text-sm font-semibold text-muted">Top lead sources</h3>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {bySource.map((s) => (
                    <li key={s.source} className="flex justify-between">
                      <span>{s.source}</span>
                      <span className="font-semibold">{s._count}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 ring-1 ring-ink/5">
            <h2 className="font-display text-lg font-semibold">Website content</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {[
                { href: "/admin/services", label: `${services} services`, sub: `${subs} sub-services`, icon: Sparkles },
                { href: "/admin/events", label: `${events} event types`, sub: "landing pages", icon: CalendarHeart },
                { href: "/admin/gallery", label: `${gallery} photos`, sub: "gallery", icon: Images },
                { href: "/admin/content", label: "Page text", sub: "hero, about, popup…", icon: FileText },
              ].map((q) => (
                <Link key={q.href} href={q.href} className="rounded-xl border border-ink/8 p-3.5 transition hover:border-gold-500">
                  <q.icon className="h-4 w-4 text-gold-600" />
                  <p className="mt-3 font-semibold">{q.label}</p>
                  <p className="text-xs text-muted">{q.sub}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
