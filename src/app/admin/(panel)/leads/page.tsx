"use client";

import { Download, Loader2, MessageCircle, Phone, Search, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { api, btnDanger, btnGhost, btnPrimary, Drawer, inputCls, PageTitle, useToast } from "@/components/admin/ui";
import { LEAD_STATUSES } from "@/lib/resources";
import { cn, telLink, waLink, waNumber } from "@/lib/utils";

type Lead = {
  id: string; name: string; phone: string; email: string; eventType: string; eventDate: string; guests: string;
  budget: string; services: string; message: string; source: string; page: string; status: string; notes: string; createdAt: string;
};

const tone: Record<string, string> = {
  new: "bg-gold-100 text-gold-700",
  contacted: "bg-sky-100 text-sky-800",
  qualified: "bg-violet-100 text-violet-800",
  booked: "bg-emerald-100 text-emerald-800",
  lost: "bg-ink/5 text-ink/50",
};

function LeadsBoard() {
  const toast = useToast();
  const params = useSearchParams();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => api<Lead[]>("/api/admin/leads").then(setLeads), []);
  useEffect(() => {
    load().catch((e) => toast(e.message, "err"));
  }, [load, toast]);

  useEffect(() => {
    const id = params.get("open");
    if (id && leads) setOpen(leads.find((l) => l.id === id) ?? null);
  }, [params, leads]);

  const shown = useMemo(
    () =>
      (leads ?? []).filter(
        (l) => (filter === "all" || l.status === filter) && JSON.stringify(l).toLowerCase().includes(q.toLowerCase()),
      ),
    [leads, filter, q],
  );

  async function setStatus(l: Lead, status: string) {
    setLeads((ls) => ls?.map((x) => (x.id === l.id ? { ...x, status } : x)) ?? null);
    await api(`/api/admin/leads/${l.id}`, { method: "PUT", json: { status } }).catch((e) => toast(e.message, "err"));
  }

  async function save() {
    if (!open) return;
    setSaving(true);
    try {
      await api(`/api/admin/leads/${open.id}`, { method: "PUT", json: open });
      toast("Lead updated");
      setOpen(null);
      load();
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!open || !confirm(`Delete lead from ${open.name}?`)) return;
    await api(`/api/admin/leads/${open.id}`, { method: "DELETE" });
    toast("Lead deleted");
    setOpen(null);
    load();
  }

  const count = (s: string) => (leads ?? []).filter((l) => s === "all" || l.status === s).length;

  return (
    <div>
      <PageTitle title="Leads" text="Every enquiry from the website. Call or WhatsApp in one tap, track status, keep notes.">
        <a href="/api/admin/leads-export" className={btnGhost}>
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </PageTitle>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {["all", ...LEAD_STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold capitalize transition", filter === s ? "bg-forest-800 text-white" : "bg-white text-ink/60 ring-1 ring-ink/10 hover:text-ink")}>
              {s} <span className="ml-1 opacity-60">{count(s)}</span>
            </button>
          ))}
        </div>
        <label className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, event…" className={`${inputCls} pl-10`} />
        </label>
      </div>

      {leads === null ? (
        <div className="grid h-40 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 p-12 text-center text-muted">No leads here yet.</div>
      ) : (
        <div className="space-y-2">
          {shown.map((l) => (
            <div key={l.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink/5 transition hover:ring-ink/15 sm:flex-row sm:items-center">
              <button onClick={() => setOpen(l)} className="min-w-0 flex-1 text-left">
                <p className="flex items-center gap-2 font-semibold">
                  {l.name}
                  <span className="font-normal text-muted">· {l.phone}</span>
                </p>
                <p className="mt-0.5 truncate text-sm text-muted">
                  {[l.eventType, l.eventDate, l.guests && `${l.guests} guests`, l.budget, l.services].filter(Boolean).join(" · ") || l.message || "—"}
                </p>
                <p className="mt-1 text-xs text-ink/40">
                  {new Date(l.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · via {l.source}
                </p>
              </button>
              <div className="flex items-center gap-2">
                <select value={l.status} onChange={(e) => setStatus(l, e.target.value)} className={cn("rounded-full border-0 px-3 py-1.5 text-xs font-bold capitalize outline-none", tone[l.status])}>
                  {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <a href={telLink(l.phone)} className="grid h-9 w-9 place-items-center rounded-full bg-forest-800 text-gold-300" aria-label="Call">
                  <Phone className="h-4 w-4" />
                </a>
                <a href={waLink(waNumber(l.phone), `Hi ${l.name}! This is Lynn Luxe Event Studio — thank you for your enquiry${l.eventType ? ` about your ${l.eventType.toLowerCase()}` : ""}.`)} target="_blank" rel="noopener" className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white" aria-label="WhatsApp">
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer
        open={!!open}
        onClose={() => setOpen(null)}
        title={open?.name ?? "Lead"}
        footer={
          <>
            <button onClick={remove} className={btnDanger}><Trash2 className="h-4 w-4" /> Delete</button>
            <button onClick={save} disabled={saving} className={btnPrimary}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Save</button>
          </>
        }
      >
        {open && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-2">
              <a href={telLink(open.phone)} className={cn(btnPrimary, "w-full")}><Phone className="h-4 w-4" /> Call</a>
              <a href={waLink(waNumber(open.phone), `Hi ${open.name}! This is Lynn Luxe Event Studio.`)} target="_blank" rel="noopener" className={cn(btnGhost, "w-full")}><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            </div>
            <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-5 text-sm ring-1 ring-ink/5">
              {([
                ["Phone", open.phone], ["Email", open.email], ["Event", open.eventType], ["Date", open.eventDate],
                ["Guests", open.guests], ["Budget", open.budget], ["Services", open.services], ["Source", `${open.source}${open.page ? ` (${open.page})` : ""}`],
              ] as const).map(([k, v]) => (
                <div key={k} className={k === "Services" || k === "Source" ? "col-span-2" : ""}>
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="mt-0.5 break-words font-medium">{v || "—"}</dd>
                </div>
              ))}
              {open.message && (
                <div className="col-span-2">
                  <dt className="text-xs text-muted">Message</dt>
                  <dd className="mt-0.5 whitespace-pre-wrap">{open.message}</dd>
                </div>
              )}
            </dl>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-ink/70">Status</label>
              <div className="flex flex-wrap gap-1.5">
                {LEAD_STATUSES.map((s) => (
                  <button key={s} type="button" onClick={() => setOpen({ ...open, status: s })} className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize", open.status === s ? "bg-forest-800 text-white" : "bg-white ring-1 ring-ink/10")}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-ink/70">Internal notes</label>
              <textarea rows={6} value={open.notes} onChange={(e) => setOpen({ ...open, notes: e.target.value })} placeholder="Call notes, quote sent, follow-up date…" className={inputCls} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense>
      <LeadsBoard />
    </Suspense>
  );
}
