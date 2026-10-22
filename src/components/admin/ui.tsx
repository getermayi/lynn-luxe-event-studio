"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown, ArrowUp, Check, ImagePlus, Loader2, Plus, Search, Trash2, Upload, X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ICONS, type Field } from "@/lib/resources";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/* ---------- fetch helper ---------- */
export async function api<T = unknown>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.json !== undefined ? { "Content-Type": "application/json" } : init?.headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });
  if (res.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Session expired");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Request failed");
  return data as T;
}

/* ---------- toasts ---------- */
type Toast = { id: number; text: string; tone: "ok" | "err" };
const ToastCtx = createContext<(text: string, tone?: "ok" | "err") => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setList((l) => [...l, { id, text, tone }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {list.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className={cn("flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium shadow-xl", t.tone === "ok" ? "bg-forest-800 text-white" : "bg-red-600 text-white")}
            >
              {t.tone === "ok" ? <Check className="h-4 w-4 text-gold-300" /> : <X className="h-4 w-4" />} {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- layout bits ---------- */
export const inputCls =
  "w-full rounded-xl border border-ink/12 bg-white px-3.5 py-2.5 text-[14.5px] outline-none transition placeholder:text-ink/30 focus:border-gold-500 focus:ring-4 focus:ring-gold-300/25";
export const btn = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-60";
export const btnPrimary = `${btn} bg-forest-800 text-white hover:bg-forest-700`;
export const btnGold = `${btn} bg-gold-400 text-forest-900 hover:bg-gold-300`;
export const btnGhost = `${btn} border border-ink/12 bg-white text-ink hover:bg-ink/[0.03]`;
export const btnDanger = `${btn} text-red-600 hover:bg-red-50`;

export function PageTitle({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {text && <p className="mt-1.5 max-w-2xl text-[15px] text-muted">{text}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Drawer({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", esc);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-forest-950/40 backdrop-blur-[2px]" />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className={cn("relative flex h-full w-full flex-col bg-ivory shadow-2xl", wide ? "max-w-3xl" : "max-w-2xl")}
          >
            <div className="flex items-center justify-between border-b border-ink/10 bg-white px-5 py-4 sm:px-7">
              <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-ink/50 hover:bg-ink/5 hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">{children}</div>
            {footer && <div className="flex items-center justify-between gap-3 border-t border-ink/10 bg-white px-5 py-4 sm:px-7">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 text-sm font-medium">
      <span className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-forest-700" : "bg-ink/15")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </span>
      {label}
    </button>
  );
}

/* ---------- media ---------- */
type MediaItem = { url: string; name: string; uploaded?: boolean };

/** Shrink big photos in the browser (max 2400px, JPEG/WebP) so uploads stay fast and small. */
async function shrink(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 900_000) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const type = file.type === "image/png" ? "image/webp" : "image/jpeg";
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, type, 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, type === "image/webp" ? ".webp" : ".jpg"), { type });
  } catch {
    return file;
  }
}

export async function uploadFiles(files: FileList | File[]) {
  const fd = new FormData();
  for (const f of Array.from(files)) {
    if (f.type.startsWith("video/") && f.size > 4 * 1024 * 1024) throw new Error(`${f.name}: videos must be under 4 MB — upload longer videos to YouTube/Instagram and paste the link.`);
    fd.append("files", await shrink(f));
  }
  const res = await api<{ urls: string[] }>("/api/admin/upload", { method: "POST", body: fd });
  return res.urls;
}

export function MediaPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (url: string) => void }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const load = useCallback(() => api<MediaItem[]>("/api/admin/upload").then(setItems).catch(() => null), []);
  useEffect(() => {
    if (open) load();
  }, [open, load]);
  const shown = items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Drawer open={open} onClose={onClose} title="Choose an image" wide>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search images…" className={`${inputCls} pl-10`} />
        </label>
        <label className={cn(btnGold, "cursor-pointer")}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload new
          <input
            type="file"
            accept="image/*,video/mp4"
            multiple
            hidden
            onChange={async (e) => {
              if (!e.target.files?.length) return;
              setBusy(true);
              try {
                const urls = await uploadFiles(e.target.files);
                toast("Uploaded");
                if (urls.length === 1) {
                  onPick(urls[0]);
                  onClose();
                } else load();
              } catch (err) {
                toast((err as Error).message, "err");
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {shown.map((m) => (
          <button
            key={m.url}
            type="button"
            onClick={() => {
              onPick(m.url);
              onClose();
            }}
            className="group overflow-hidden rounded-xl bg-white text-left ring-1 ring-ink/10 transition hover:ring-2 hover:ring-gold-500"
          >
            <div className="aspect-[4/3] overflow-hidden bg-sand">
              {m.url.endsWith(".mp4") ? (
                <video src={m.url} className="h-full w-full object-cover" muted />
              ) : (
                <img src={m.url} alt="" loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
              )}
            </div>
            <p className="truncate px-2.5 py-2 text-xs text-muted">{m.name}</p>
          </button>
        ))}
      </div>
    </Drawer>
  );
}

export function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [picker, setPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex gap-3">
      <button type="button" onClick={() => setPicker(true)} className="group relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-sand ring-1 ring-ink/10">
        {value ? (
          value.endsWith(".mp4") ? <video src={value} className="h-full w-full object-cover" muted /> : <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full place-items-center text-ink/35">
            <ImagePlus className="h-6 w-6" />
          </span>
        )}
        <span className="absolute inset-0 grid place-items-center bg-forest-900/60 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">Change</span>
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="/images/… or https://…" className={inputCls} />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setPicker(true)} className={cn(btnGhost, "!py-1.5 !text-xs")}>
            Library
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className={cn(btnGhost, "!py-1.5 !text-xs")}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className={cn(btnDanger, "!py-1.5 !text-xs")}>
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/mp4"
          hidden
          onChange={async (e) => {
            if (!e.target.files?.length) return;
            setBusy(true);
            try {
              onChange((await uploadFiles(e.target.files))[0]);
            } catch (err) {
              toast((err as Error).message, "err");
            } finally {
              setBusy(false);
              e.target.value = "";
            }
          }}
        />
      </div>
      <MediaPicker open={picker} onClose={() => setPicker(false)} onPick={onChange} />
    </div>
  );
}

/* ---------- list editors ---------- */
function move<T>(arr: T[], i: number, d: number) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const out = [...arr];
  [out[i], out[j]] = [out[j], out[i]];
  return out;
}

function RowTools({ i, len, onMove, onRemove }: { i: number; len: number; onMove: (d: number) => void; onRemove: () => void }) {
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" disabled={i === 0} onClick={() => onMove(-1)} className="rounded-lg p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink disabled:opacity-30" aria-label="Move up">
        <ArrowUp className="h-4 w-4" />
      </button>
      <button type="button" disabled={i === len - 1} onClick={() => onMove(1)} className="rounded-lg p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink disabled:opacity-30" aria-label="Move down">
        <ArrowDown className="h-4 w-4" />
      </button>
      <button type="button" onClick={onRemove} className="rounded-lg p-1.5 text-red-500/70 hover:bg-red-50 hover:text-red-600" aria-label="Remove">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ListInput({ value, onChange, images }: { value: string[]; onChange: (v: string[]) => void; images?: boolean }) {
  const list = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-2">
      {list.map((v, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">
            {images ? (
              <ImageInput value={v} onChange={(nv) => onChange(list.map((x, k) => (k === i ? nv : x)))} />
            ) : v.length > 70 ? (
              <textarea rows={2} value={v} onChange={(e) => onChange(list.map((x, k) => (k === i ? e.target.value : x)))} className={inputCls} />
            ) : (
              <input value={v} onChange={(e) => onChange(list.map((x, k) => (k === i ? e.target.value : x)))} className={inputCls} />
            )}
          </div>
          <RowTools i={i} len={list.length} onMove={(d) => onChange(move(list, i, d))} onRemove={() => onChange(list.filter((_, k) => k !== i))} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...list, ""])} className={cn(btnGhost, "!py-2 !text-xs")}>
        <Plus className="h-3.5 w-3.5" /> Add {images ? "image" : "item"}
      </button>
    </div>
  );
}

export function ObjectListInput({ value, onChange, shape }: { value: Record<string, unknown>[]; onChange: (v: Record<string, unknown>[]) => void; shape?: Record<string, unknown> }) {
  const list = Array.isArray(value) ? value : [];
  const template = shape ?? Object.fromEntries(Object.entries(list[0] ?? { title: "", text: "" }).map(([k, v]) => [k, typeof v === "number" ? 0 : typeof v === "boolean" ? false : Array.isArray(v) ? [] : ""]));
  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div key={i} className="rounded-2xl border border-ink/10 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gold-700">Item {i + 1}</span>
            <RowTools i={i} len={list.length} onMove={(d) => onChange(move(list, i, d))} onRemove={() => onChange(list.filter((_, k) => k !== i))} />
          </div>
          <JsonEditor value={item} onChange={(nv) => onChange(list.map((x, k) => (k === i ? (nv as Record<string, unknown>) : x)))} nested />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...list, structuredClone(template)])} className={cn(btnGhost, "!py-2 !text-xs")}>
        <Plus className="h-3.5 w-3.5" /> Add item
      </button>
    </div>
  );
}

/* ---------- generic recursive editor (for page content) ---------- */
const human = (k: string) =>
  k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).replace(/\bCta\b/g, "CTA").replace(/\bSeo\b/g, "SEO").replace(/\bUrl\b/g, "URL");
const isImageKey = (k: string) => /(image|logo|wordmark|monogram|ogimage|photo|poster)$/i.test(k);
const isLongKey = (k: string) => /(text|subtitle|description|answer|blurb|paragraph|summary|quote|note)/i.test(k);

export function JsonEditor({ value, onChange, nested }: { value: unknown; onChange: (v: unknown) => void; nested?: boolean }) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  const obj = value as Record<string, unknown>;
  return (
    <div className={cn("grid gap-5", nested ? "sm:grid-cols-2" : "")}>
      {Object.entries(obj).map(([k, v]) => {
        const set = (nv: unknown) => onChange({ ...obj, [k]: nv });
        const full = typeof v === "object" || (typeof v === "string" && (isLongKey(k) || isImageKey(k) || v.length > 60));
        return (
          <div key={k} className={cn(full && "sm:col-span-2")}>
            {typeof v === "object" && v !== null && !Array.isArray(v) ? (
              <fieldset className="rounded-2xl border border-ink/10 bg-white/60 p-4 sm:p-5">
                <legend className="px-2 font-display text-[15px] font-semibold">{human(k)}</legend>
                <JsonEditor value={v} onChange={set} nested />
              </fieldset>
            ) : (
              <>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink/70">{human(k)}</label>
                {typeof v === "boolean" ? (
                  <Toggle checked={v} onChange={set} label={v ? "On" : "Off"} />
                ) : typeof v === "number" ? (
                  <input type="number" value={v} onChange={(e) => set(Number(e.target.value))} className={inputCls} />
                ) : Array.isArray(v) ? (
                  v.length && typeof v[0] === "object" ? (
                    <ObjectListInput value={v as Record<string, unknown>[]} onChange={set} />
                  ) : (
                    <ListInput value={v as string[]} onChange={set} images={/images$/i.test(k)} />
                  )
                ) : isImageKey(k) ? (
                  <ImageInput value={String(v ?? "")} onChange={set} />
                ) : isLongKey(k) || String(v).length > 80 ? (
                  <textarea rows={3} value={String(v ?? "")} onChange={(e) => set(e.target.value)} className={inputCls} />
                ) : (
                  <input value={String(v ?? "")} onChange={(e) => set(e.target.value)} className={inputCls} />
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- configured field ---------- */
export function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case "textarea":
      return <textarea rows={field.name === "body" ? 18 : field.name === "description" ? 5 : 3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
    case "number":
      return <input type="number" value={Number(value ?? 0)} onChange={(e) => onChange(Number(e.target.value))} className={inputCls} />;
    case "boolean":
      return <Toggle checked={Boolean(value)} onChange={onChange} label={value ? "Yes" : "No"} />;
    case "image":
      return <ImageInput value={String(value ?? "")} onChange={onChange} />;
    case "images":
      return <ListInput value={(value as string[]) ?? []} onChange={onChange} images />;
    case "list":
      return <ListInput value={(value as string[]) ?? []} onChange={onChange} />;
    case "json":
      return <ObjectListInput value={(value as Record<string, unknown>[]) ?? []} onChange={onChange} shape={field.itemShape} />;
    case "select":
      return (
        <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={cn(inputCls, "capitalize")}>
          {field.options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      );
    case "icon":
      return (
        <div className="flex flex-wrap gap-1.5">
          {ICONS.map((name) => (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => onChange(name)}
              className={cn("grid h-10 w-10 place-items-center rounded-xl border transition", value === name ? "border-forest-800 bg-forest-800 text-gold-300" : "border-ink/10 bg-white text-ink/60 hover:border-ink/30")}
            >
              <Icon name={name} className="h-4.5 w-4.5" />
            </button>
          ))}
        </div>
      );
    default:
      return <input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder={field.type === "slug" ? "auto-generated from title" : undefined} />;
  }
}
