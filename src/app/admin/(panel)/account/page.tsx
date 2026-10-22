"use client";

import { Download, Eye, EyeOff, KeyRound, Loader2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { api, btnGhost, btnPrimary, inputCls, PageTitle, useToast } from "@/components/admin/ui";

export default function AccountPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    api<{ email: string }>("/api/admin/account").then((d) => setEmail(d.email)).catch(() => null);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (next && next !== confirm) return toast("New passwords don't match", "err");
    setSaving(true);
    try {
      await api("/api/admin/account", { method: "PUT", json: { currentPassword: current, email, newPassword: next } });
      toast("Login details updated");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      toast((err as Error).message, "err");
    } finally {
      setSaving(false);
    }
  }

  async function restore(file: File) {
    if (!window.confirm("Restore this backup? It replaces all services, pages, portfolio, journal, gallery, FAQs and testimonials with the file's contents. Leads are kept.")) return;
    setRestoring(true);
    try {
      await api("/api/admin/backup", { method: "POST", json: JSON.parse(await file.text()) });
      toast("Backup restored — the website is updated");
    } catch (err) {
      toast((err as Error).message, "err");
    } finally {
      setRestoring(false);
    }
  }

  const type = show ? "text" : "password";

  return (
    <div>
      <PageTitle title="Account & backup" text="Change your admin login, and download or restore a full copy of the website's content." />

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={save} className="rounded-2xl bg-white p-6 ring-1 ring-ink/5 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-800 text-gold-300"><KeyRound className="h-5 w-5" /></span>
            <h2 className="font-display text-xl font-semibold">Admin login</h2>
          </div>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink/70">Login email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} autoComplete="username" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink/70">Current password *</span>
              <input type={type} required value={current} onChange={(e) => setCurrent(e.target.value)} className={inputCls} autoComplete="current-password" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink/70">New password (leave blank to keep)</span>
              <input type={type} minLength={8} value={next} onChange={(e) => setNext(e.target.value)} className={inputCls} autoComplete="new-password" placeholder="At least 8 characters" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink/70">Confirm new password</span>
              <input type={type} value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} autoComplete="new-password" />
            </label>
            <button type="button" onClick={() => setShow(!show)} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {show ? "Hide" : "Show"} passwords
            </button>
          </div>
          <button disabled={saving} className={`${btnPrimary} mt-6 w-full`}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save login details
          </button>
        </form>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-ink/5 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400 text-forest-900"><Download className="h-5 w-5" /></span>
            <h2 className="font-display text-xl font-semibold">Backup & restore</h2>
          </div>
          <p className="mt-4 text-[15px] text-muted">
            Download a single file containing every page, service, sub-service, venue, portfolio story, article, gallery photo link, FAQ, testimonial and lead. Keep it somewhere safe — you can restore it any time.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <a href="/api/admin/backup" className={`${btnPrimary} flex-1`}>
              <Download className="h-4 w-4" /> Download backup
            </a>
            <label className={`${btnGhost} flex-1 cursor-pointer`}>
              {restoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Restore from file
              <input type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) restore(f); e.target.value = ""; }} />
            </label>
          </div>
          <p className="mt-4 text-xs text-muted">Uploaded photos themselves are stored in the website's <code>uploads</code> folder — back that folder up too.</p>
        </div>
      </div>
    </div>
  );
}
