"use client";

import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api, btnGold, PageTitle, uploadFiles, useToast } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type Item = { url: string; name: string; uploaded?: boolean };

export default function MediaPage() {
  const toast = useToast();
  const [items, setItems] = useState<Item[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const load = useCallback(() => api<Item[]>("/api/admin/upload").then(setItems), []);
  useEffect(() => {
    load().catch((e) => toast(e.message, "err"));
  }, [load, toast]);

  async function upload(files: FileList | File[]) {
    if (!files.length) return;
    setBusy(true);
    try {
      const urls = await uploadFiles(files);
      toast(`${urls.length} file${urls.length > 1 ? "s" : ""} uploaded`);
      load();
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setBusy(false);
    }
  }

  async function remove(it: Item) {
    if (!confirm(`Delete ${it.name}? Pages using it will show a blank image.`)) return;
    await api(`/api/admin/upload?url=${encodeURIComponent(it.url)}`, { method: "DELETE" });
    toast("Deleted");
    load();
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        upload(e.dataTransfer.files);
      }}
    >
      <PageTitle title="Media library" text="Upload photos (resized automatically) and short videos (under 4 MB), then pick them anywhere in the dashboard. Drag & drop works too.">
        <label className={cn(btnGold, "cursor-pointer")}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload files
          <input type="file" multiple accept="image/*,video/mp4,video/webm" hidden onChange={(e) => e.target.files && upload(e.target.files)} />
        </label>
      </PageTitle>

      <div className={cn("rounded-3xl transition", drag && "bg-gold-100 ring-2 ring-gold-400")}>
        {items === null ? (
          <div className="grid h-40 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((it) => (
              <div key={it.url} className="group overflow-hidden rounded-2xl bg-white ring-1 ring-ink/8">
                <div className="aspect-[4/3] overflow-hidden bg-sand">
                  {/\.(mp4|webm)$/.test(it.url) ? (
                    <video src={it.url} muted className="h-full w-full object-cover" />
                  ) : (
                    <img src={it.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex items-center gap-1 p-2">
                  <p className="min-w-0 flex-1 truncate px-1 text-xs text-muted" title={it.name}>
                    {it.uploaded && <span className="mr-1 font-semibold text-gold-700">•</span>}
                    {it.name}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(it.url);
                      toast("Link copied");
                    }}
                    className="rounded-lg p-1.5 text-ink/45 hover:bg-ink/5 hover:text-ink"
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {it.uploaded && (
                    <button onClick={() => remove(it)} className="rounded-lg p-1.5 text-red-500/70 hover:bg-red-50 hover:text-red-600" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
