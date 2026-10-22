"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Img } from "@/components/ui/Img";
import { waLink } from "@/lib/utils";
import { lockScroll, submitLead, useSite } from "./SiteProvider";

const KEY = "ll_popup_seen";
const ease = [0.22, 1, 0.36, 1] as const;

/** Timed + exit-intent lead capture popup. Respects a cool-down and never shows after a lead was sent. */
export function LeadPopup() {
  const { popup, site, quoteForm, quote } = useSite();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", eventType: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const shown = useRef(false);
  const quoteOpen = useRef(false);
  quoteOpen.current = quote !== null;

  useEffect(() => {
    if (!popup.enabled || pathname === "/contact") return;
    try {
      const seen = Number(localStorage.getItem(KEY) || 0);
      if (localStorage.getItem("ll_lead")) return;
      if (Date.now() - seen < popup.frequencyDays * 864e5) return;
    } catch {}

    const show = () => {
      if (shown.current || quoteOpen.current) return;
      shown.current = true;
      setOpen(true);
      try {
        localStorage.setItem(KEY, String(Date.now()));
      } catch {}
    };
    const t = setTimeout(show, Math.max(3, popup.delaySeconds) * 1000);
    const onLeave = (e: MouseEvent) => {
      if (popup.exitIntent && e.clientY <= 0) show();
    };
    document.addEventListener("mouseout", onLeave);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [popup, pathname]);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await submitLead({ ...form, source: "popup" });
      setStatus("done");
    } catch (err) {
      setError((err as Error).message);
      setStatus("idle");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[85] flex items-end justify-center p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close" onClick={() => setOpen(false)} className="absolute inset-0 bg-forest-950/60 backdrop-blur-sm" />
          <motion.div
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            initial={{ y: 80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.7, ease }}
            className="relative grid max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-ivory shadow-2xl sm:grid-cols-[1fr_1.15fr] sm:rounded-[28px]"
          >
            <div className="relative hidden min-h-[460px] sm:block">
              <Img src={popup.image} alt="" fill sizes="400px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/10 to-transparent" />
              <img src={site.wordmark} alt={site.name} className="absolute bottom-7 left-7 w-40" />
            </div>
            <div className="relative p-7 sm:p-9">
              <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 text-ink/50 transition hover:bg-ink/5 hover:text-ink">
                <X className="h-5 w-5" />
              </button>
              {status === "done" ? (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="py-6">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-forest-800 text-gold-300">
                    <Check className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 font-display text-3xl font-medium tracking-tight">{popup.successTitle}</h3>
                  <p className="mt-3 text-muted">{popup.successText}</p>
                  <a href={waLink(site.whatsapp, `Hi Lynn Luxe! I'm ${form.name}. I'd like a free consultation${form.eventType ? ` for a ${form.eventType}` : ""}.`)} target="_blank" rel="noopener" className="btn btn-dark mt-7">
                    <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
                  </a>
                </motion.div>
              ) : (
                <>
                  <p className="kicker">{popup.kicker}</p>
                  <h3 className="mt-4 font-display text-[2rem] font-medium leading-[1.05] tracking-tight sm:text-4xl">{popup.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{popup.text}</p>
                  <form onSubmit={send} className="mt-6 space-y-3">
                    <input required minLength={2} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" autoComplete="name" />
                    <input required type="tel" inputMode="tel" placeholder="Phone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" autoComplete="tel" />
                    <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="field">
                      <option value="">What's the occasion?</option>
                      {quoteForm.eventTypes.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" aria-hidden />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button disabled={status === "sending"} className="btn btn-gold w-full">
                      {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
                      {popup.buttonLabel}
                    </button>
                    <button type="button" onClick={() => setOpen(false)} className="w-full pt-1 text-center text-sm text-ink/45 hover:text-ink/70">
                      No thanks, I'm just browsing
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
