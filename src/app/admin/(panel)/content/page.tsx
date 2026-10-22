"use client";

import { ExternalLink, Loader2, RotateCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { api, btnGhost, btnPrimary, JsonEditor, ObjectListInput, PageTitle, useToast } from "@/components/admin/ui";
import { settingLabels, type SettingKey } from "@/lib/defaults";
import { cn } from "@/lib/utils";

const keys = Object.keys(settingLabels) as SettingKey[];
const preview: Partial<Record<SettingKey, string>> = { home: "/", about: "/about", contact: "/contact", site: "/", servicesPage: "/services", packages: "/services#packages", portfolioPage: "/portfolio", journalPage: "/journal", inquire: "/inquire", faqPage: "/faq" };

export default function ContentPage() {
  const toast = useToast();
  const [tab, setTab] = useState<SettingKey>("home");
  const [value, setValue] = useState<unknown>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(null);
    setDirty(false);
    api(`/api/admin/settings/${tab}`).then(setValue).catch((e) => toast(e.message, "err"));
  }, [tab, toast]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setSaving(true);
    try {
      await api(`/api/admin/settings/${tab}`, { method: "PUT", json: value });
      setDirty(false);
      toast("Saved — live on the website");
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!confirm(`Reset “${settingLabels[tab].label}” to the original text? Your edits in this section will be lost.`)) return;
    setValue(await api(`/api/admin/settings/${tab}`, { method: "DELETE" }));
    setDirty(false);
    toast("Section reset");
  }

  function switchTab(k: SettingKey) {
    if (dirty && !confirm("You have unsaved changes. Leave this section?")) return;
    setTab(k);
  }

  return (
    <div>
      <PageTitle title="Pages & settings" text="Edit every headline, paragraph, button, image and contact detail on the website. Changes go live as soon as you save." />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:block lg:space-y-1 lg:px-0">
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => switchTab(k)}
              className={cn(
                "shrink-0 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition lg:block lg:w-full",
                tab === k ? "bg-forest-800 text-white" : "bg-white text-ink/65 ring-1 ring-ink/8 hover:text-ink lg:bg-transparent lg:ring-0 lg:hover:bg-white",
              )}
            >
              {settingLabels[k].label}
            </button>
          ))}
        </div>

        <div className="min-w-0">
          <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-white p-5 ring-1 ring-ink/5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">{settingLabels[tab].label}</h2>
              <p className="text-sm text-muted">{settingLabels[tab].help}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              {preview[tab] && (
                <a href={preview[tab]} target="_blank" className={btnGhost}>
                  <ExternalLink className="h-4 w-4" /> Preview
                </a>
              )}
              <button onClick={reset} className={btnGhost} title="Reset to original">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {value === null ? (
            <div className="grid h-60 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
          ) : Array.isArray(value) ? (
            <ObjectListInput
              value={value as Record<string, unknown>[]}
              onChange={(v) => {
                setValue(v);
                setDirty(true);
              }}
            />
          ) : (
            <JsonEditor
              value={value}
              onChange={(v) => {
                setValue(v);
                setDirty(true);
              }}
            />
          )}

          <div className={cn("sticky bottom-4 mt-8 flex items-center justify-between gap-3 rounded-2xl bg-forest-900 p-3 pl-5 text-white shadow-2xl transition", dirty ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0")}>
            <span className="text-sm">You have unsaved changes</span>
            <button onClick={save} disabled={saving} className={cn(btnPrimary, "!bg-gold-400 !text-forest-900")}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
