"use client";

import { ArrowDown, ArrowUp, Copy, ExternalLink, EyeOff, Layers, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { resources, type Resource } from "@/lib/resources";
import { cn } from "@/lib/utils";
import { api, btnDanger, btnGhost, btnPrimary, Drawer, FieldInput, inputCls, PageTitle, useToast } from "./ui";

type Row = Record<string, unknown> & { id: string };

function blank(r: Resource, parentId?: string): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  for (const f of r.fields) {
    o[f.name] = f.type === "boolean" ? f.name === "published" : f.type === "number" ? (f.name === "rating" ? 5 : 0) : ["list", "images", "json"].includes(f.type) ? [] : f.type === "select" ? f.options?.[0] ?? "" : f.type === "icon" ? "Sparkles" : "";
  }
  if (r.parent && parentId) o[r.parent.field] = parentId;
  return o;
}

export function ResourceManager({ resourceKey, parentId, embedded }: { resourceKey: string; parentId?: string; embedded?: boolean }) {
  const r = resources[resourceKey];
  const toast = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    const url = `/api/admin/${r.key}${parentId ? `?parent=${parentId}` : ""}`;
    setRows(await api<Row[]>(url));
  }, [r.key, parentId]);

  useEffect(() => {
    load().catch((e) => toast(e.message, "err"));
  }, [load, toast]);

  const shown = useMemo(
    () => (rows ?? []).filter((row) => JSON.stringify([row[r.titleField], row[r.subtitleField ?? ""]]).toLowerCase().includes(q.toLowerCase())),
    [rows, q, r.titleField, r.subtitleField],
  );

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const id = editing.id as string | undefined;
      await api(id ? `/api/admin/${r.key}/${id}` : `/api/admin/${r.key}`, { method: id ? "PUT" : "POST", json: editing });
      toast(id ? "Saved — the site is updated" : `${r.singular} created`);
      setEditing(null);
      load();
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: Row) {
    if (!confirm(`Delete “${String(row[r.titleField])}”? This can't be undone.`)) return;
    try {
      await api(`/api/admin/${r.key}/${row.id}`, { method: "DELETE" });
      toast("Deleted");
      setEditing(null);
      load();
    } catch (e) {
      toast((e as Error).message, "err");
    }
  }

  async function reorder(i: number, d: number) {
    if (!rows) return;
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    await api("/api/admin/reorder", { method: "POST", json: { resource: r.key, ids: next.map((x) => x.id) } }).catch((e) => toast(e.message, "err"));
  }

  async function togglePublished(row: Row) {
    await api(`/api/admin/${r.key}/${row.id}`, { method: "PUT", json: { published: !row.published } });
    toast(row.published ? "Hidden from site" : "Published");
    load();
  }

  function duplicate(row: Row) {
    const copy: Record<string, unknown> = { ...row };
    delete copy.id;
    copy[r.titleField] = `${row[r.titleField]} (copy)`;
    if ("slug" in copy) copy.slug = "";
    setEditing(copy);
  }

  return (
    <div>
      {!embedded ? (
        <PageTitle title={r.label} text={r.description}>
          <button onClick={() => setEditing(blank(r, parentId))} className={btnPrimary}>
            <Plus className="h-4 w-4" /> Add {r.singular.toLowerCase()}
          </button>
        </PageTitle>
      ) : (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">{rows?.length ?? 0} items · drag order with the arrows</p>
          <button type="button" onClick={() => setEditing(blank(r, parentId))} className={cn(btnPrimary, "!py-2")}>
            <Plus className="h-4 w-4" /> Add {r.singular.toLowerCase()}
          </button>
        </div>
      )}

      {!embedded && (rows?.length ?? 0) > 6 && (
        <label className="relative mb-5 block max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${r.label.toLowerCase()}…`} className={`${inputCls} pl-10`} />
        </label>
      )}

      {rows === null ? (
        <div className="grid h-40 place-items-center text-muted">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 p-10 text-center text-muted">Nothing here yet.</div>
      ) : (
        <div className={cn("grid gap-2.5", r.key === "gallery" && !embedded && "sm:grid-cols-2 xl:grid-cols-3")}>
          {shown.map((row, i) => {
            const img = r.imageField ? String(row[r.imageField] ?? "") : "";
            const path = r.publicPath?.(row);
            const count = (row._count as { subServices?: number } | undefined)?.subServices;
            return (
              <div key={row.id} className="group flex items-center gap-3 rounded-2xl border border-ink/8 bg-white p-2.5 pr-3 transition hover:border-ink/20 hover:shadow-sm">
                {r.orderable && (
                  <div className="flex flex-col">
                    <button onClick={() => reorder(i, -1)} disabled={i === 0 || !!q} className="rounded p-0.5 text-ink/30 hover:text-ink disabled:opacity-20" aria-label="Move up">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => reorder(i, 1)} disabled={i === shown.length - 1 || !!q} className="rounded p-0.5 text-ink/30 hover:text-ink disabled:opacity-20" aria-label="Move down">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                {r.imageField && (
                  <button onClick={() => setEditing({ ...row })} className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                    {img && <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />}
                  </button>
                )}
                <button onClick={() => setEditing({ ...row })} className="min-w-0 flex-1 text-left">
                  <p className="flex items-center gap-2 truncate font-semibold">
                    {String(row[r.titleField] ?? "Untitled")}
                    {row.published === false && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                        <EyeOff className="h-3 w-3" /> Hidden
                      </span>
                    )}
                    {row.featured === true && <span className="shrink-0 rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-semibold text-gold-700">Featured</span>}
                  </p>
                  <p className="truncate text-sm text-muted">
                    {count !== undefined && (
                      <span className="mr-2 inline-flex items-center gap-1 font-medium text-forest-700">
                        <Layers className="h-3 w-3" /> {count} sub-services ·
                      </span>
                    )}
                    {String(row[r.subtitleField ?? ""] ?? "")}
                  </p>
                </button>
                <div className="flex shrink-0 items-center opacity-100 sm:opacity-60 sm:group-hover:opacity-100">
                  {"published" in row && (
                    <button onClick={() => togglePublished(row)} title={row.published ? "Hide" : "Publish"} className="hidden rounded-lg p-2 text-ink/50 hover:bg-ink/5 hover:text-ink sm:block">
                      <EyeOff className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => duplicate(row)} title="Duplicate" className="hidden rounded-lg p-2 text-ink/50 hover:bg-ink/5 hover:text-ink sm:block">
                    <Copy className="h-4 w-4" />
                  </button>
                  {path && row.published !== false && (
                    <a href={path} target="_blank" title="View on site" className="rounded-lg p-2 text-ink/50 hover:bg-ink/5 hover:text-ink">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button onClick={() => setEditing({ ...row })} title="Edit" className="rounded-lg p-2 text-ink/50 hover:bg-ink/5 hover:text-ink">
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit ${r.singular.toLowerCase()}` : `New ${r.singular.toLowerCase()}`}
        wide={r.key === "services"}
        footer={
          <>
            {editing?.id ? (
              <button type="button" onClick={() => remove(editing as Row)} className={btnDanger}>
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(null)} className={btnGhost}>
                Cancel
              </button>
              <button type="button" onClick={save} disabled={saving} className={btnPrimary}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
              </button>
            </div>
          </>
        }
      >
        {editing && (
          <div className="space-y-8">
            <div className="grid gap-5 sm:grid-cols-2">
              {r.fields.map((f) => (
                <div key={f.name} className={cn(!f.half && "sm:col-span-2")}>
                  <label className="mb-1.5 block text-[13px] font-semibold text-ink/70">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  <FieldInput field={f} value={editing[f.name]} onChange={(v) => setEditing((e) => ({ ...e!, [f.name]: v }))} />
                  {f.help && <p className="mt-1.5 text-xs text-muted">{f.help}</p>}
                </div>
              ))}
            </div>
            {r.key === "services" && (
              <div className="rounded-2xl border border-ink/10 bg-cream/60 p-4 sm:p-5">
                <h3 className="font-display text-lg font-semibold">Sub-services</h3>
                {editing.id ? (
                  <div className="mt-3">
                    <ResourceManager resourceKey="subservices" parentId={editing.id as string} embedded />
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted">Save this service first, then add its sub-services here.</p>
                )}
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
