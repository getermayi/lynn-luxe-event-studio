"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, waLink } from "@/lib/utils";
import { lockScroll, submitLead, useSite } from "./SiteProvider";

const ease = [0.22, 1, 0.36, 1] as const;
const empty = { eventType: "", eventDate: "", guests: "", budget: "", name: "", phone: "", email: "", message: "", website: "" };

export function QuoteModal() {
  const { quote, closeQuote, quoteForm, site } = useSite();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const open = quote !== null;

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    setStep(quote?.eventType ? 1 : 0);
    setStatus("idle");
    setError("");
    setData((d) => ({ ...d, eventType: quote?.eventType ?? d.eventType }));
    const esc = (e: KeyboardEvent) => e.key === "Escape" && closeQuote();
    window.addEventListener("keydown", esc);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", esc);
    };
  }, [open, quote, closeQuote]);

  const set = (k: keyof typeof empty, v: string) => setData((d) => ({ ...d, [k]: v }));
  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    setError("");
  };

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await submitLead({ ...data, services: quote?.services ?? "", source: quote?.source ?? "quote-form" });
      setStatus("done");
    } catch (err) {
      setError((err as Error).message);
      setStatus("idle");
    }
  }

  const waText = `Hi Lynn Luxe! I'm ${data.name || "planning an event"}. ${data.eventType ? `Event: ${data.eventType}. ` : ""}${data.eventDate ? `Date: ${data.eventDate}. ` : ""}${data.guests ? `Guests: ${data.guests}. ` : ""}${data.budget ? `Budget: ${data.budget}.` : ""}`;

  const steps = ["Event", "Details", "Contact"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={quoteForm.title}
        >
          <motion.button
            aria-label="Close"
            onClick={closeQuote}
            className="absolute inset-0 bg-forest-950/70 backdrop-blur-md"
          />
          <motion.div
            data-lenis-prevent
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease }}
            className="on-dark relative max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-[28px] bg-forest-800 text-white shadow-2xl ring-1 ring-white/10 sm:rounded-[28px]"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />
            <div className="relative p-6 sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="kicker">{quoteForm.subtitle}</p>
                  <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                    {status === "done" ? quoteForm.successTitle : quoteForm.title}
                  </h2>
                </div>
                <button onClick={closeQuote} aria-label="Close" className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {status !== "done" && (
                <div className="mt-6 flex gap-2">
                  {steps.map((s, i) => (
                    <div key={s} className="flex-1">
                      <div className="h-1 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full bg-gold-400"
                          animate={{ width: i <= step ? "100%" : "0%" }}
                          transition={{ duration: 0.5, ease }}
                        />
                      </div>
                      <p className={cn("mt-2 font-mono text-[10px] uppercase tracking-[0.2em]", i <= step ? "text-gold-300" : "text-white/35")}>
                        0{i + 1} · {s}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative mt-7 min-h-[290px]">
                <AnimatePresence mode="wait" custom={dir}>
                  {status === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                        className="grid h-16 w-16 place-items-center rounded-full bg-gold-400 text-forest-900"
                      >
                        <Check className="h-8 w-8" strokeWidth={2.5} />
                      </motion.div>
                      <p className="mt-6 text-lg leading-relaxed text-white/75">{quoteForm.successText}</p>
                      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a href={waLink(site.whatsapp, waText)} target="_blank" rel="noopener" className="btn btn-gold">
                          <MessageCircle className="h-5 w-5" /> Continue on WhatsApp
                        </a>
                        <button onClick={closeQuote} className="btn btn-ghost-light">
                          Back to site
                        </button>
                      </div>
                    </motion.div>
                  ) : step === 0 ? (
                    <Pane key="s0" dir={dir}>
                      <p className="text-white/70">What are you celebrating?</p>
                      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {quoteForm.eventTypes.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              set("eventType", t);
                              go(1);
                            }}
                            className={cn(
                              "rounded-2xl border px-3 py-4 text-left text-[15px] font-medium transition duration-300 hover:-translate-y-0.5",
                              data.eventType === t
                                ? "border-gold-400 bg-gold-400/15 text-gold-200"
                                : "border-white/12 bg-white/[0.04] hover:border-white/30",
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </Pane>
                  ) : step === 1 ? (
                    <Pane key="s1" dir={dir}>
                      <label className="block text-sm text-white/70">
                        Event date <span className="text-white/40">(approximate is fine)</span>
                        <input type="date" value={data.eventDate} onChange={(e) => set("eventDate", e.target.value)} className="field mt-2 [color-scheme:dark]" />
                      </label>
                      <p className="mt-6 text-sm text-white/70">Number of guests</p>
                      <Chips options={quoteForm.guestRanges} value={data.guests} onPick={(v) => set("guests", v)} />
                      <p className="mt-6 text-sm text-white/70">Approximate budget</p>
                      <Chips options={quoteForm.budgets} value={data.budget} onPick={(v) => set("budget", v)} />
                      <div className="mt-8 flex items-center justify-between">
                        <button type="button" onClick={() => go(0)} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button type="button" onClick={() => go(2)} className="btn btn-gold">
                          Continue <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </Pane>
                  ) : (
                    <Pane key="s2" dir={dir}>
                      <form onSubmit={send} className="space-y-3">
                        <input required minLength={2} placeholder="Your name" value={data.name} onChange={(e) => set("name", e.target.value)} className="field" autoComplete="name" />
                        <input required type="tel" placeholder="Phone / WhatsApp number" value={data.phone} onChange={(e) => set("phone", e.target.value)} className="field" autoComplete="tel" inputMode="tel" />
                        <input type="email" placeholder="Email (optional)" value={data.email} onChange={(e) => set("email", e.target.value)} className="field" autoComplete="email" />
                        <textarea rows={3} placeholder="Anything we should know? Theme, venue, ideas… (optional)" value={data.message} onChange={(e) => set("message", e.target.value)} className="field resize-none" />
                        <input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} className="hidden" aria-hidden />
                        {error && <p className="text-sm text-red-300">{error}</p>}
                        <div className="flex items-center justify-between pt-3">
                          <button type="button" onClick={() => go(1)} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
                            <ArrowLeft className="h-4 w-4" /> Back
                          </button>
                          <button disabled={status === "sending"} className="btn btn-gold disabled:opacity-70">
                            {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Get my free quote
                          </button>
                        </div>
                        <p className="pt-1 text-xs text-white/40">We'll only use your details to plan your event. No spam.</p>
                      </form>
                    </Pane>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Pane({ children, dir }: { children: React.ReactNode; dir: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 * dir }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 * dir }}
      transition={{ duration: 0.45, ease }}
    >
      {children}
    </motion.div>
  );
}

function Chips({ options, value, onPick }: { options: string[]; value: string; onPick: (v: string) => void }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onPick(o)}
          className={cn(
            "chip",
            value === o ? "border-gold-400 bg-gold-400 text-forest-900" : "border-white/15 text-white/80 hover:border-white/40",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
