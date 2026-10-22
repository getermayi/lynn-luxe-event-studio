"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, MessageCircle, Plus, Quote, Star, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { lockScroll, submitLead, useSite } from "@/components/site/SiteProvider";
import { Img } from "@/components/ui/Img";
import { cn, waLink } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- Gallery with filters + lightbox ---------- */
type Photo = { id: string; title: string; category: string; image: string };

export function GalleryGrid({ items, filters = true }: { items: Photo[]; filters?: boolean }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))], [items]);
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const shown = cat === "All" ? items : items.filter((i) => i.category === cat);

  const move = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    if (open === null) return;
    lockScroll(true);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", key);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", key);
    };
  }, [open, move]);

  return (
    <>
      {filters && cats.length > 2 && (
        <div className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn("chip shrink-0", cat === c ? "border-forest-800 bg-forest-800 text-white" : "border-ink/15 text-ink/70 hover:border-ink/40")}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <motion.div layout className="columns-2 gap-3 sm:gap-4 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.button
              layout
              key={p.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.6, ease }}
              onClick={() => setOpen(i)}
              className="group relative mb-3 block w-full overflow-hidden rounded-2xl bg-sand sm:mb-4"
            >
              <Img
                src={p.image}
                alt={p.title}
                width={800}
                height={i % 3 === 0 ? 1000 : i % 3 === 1 ? 640 : 820}
                sizes="(min-width:1024px) 33vw, 50vw"
                className={cn("w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-105", i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-[5/4]" : "aspect-square")}
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-forest-950/75 via-transparent to-transparent p-4 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="text-left text-white">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-300">{p.category}</p>
                  <p className="mt-1 text-sm font-medium">{p.title}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open !== null && shown[open] && (
          <motion.div data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-center justify-center bg-forest-950/95 p-4 backdrop-blur-xl">
            <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
            <button onClick={() => move(-1)} aria-label="Previous" className="absolute left-3 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button onClick={() => move(1)} aria-label="Next" className="absolute right-3 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6">
              <ArrowRight className="h-5 w-5" />
            </button>
            <motion.figure
              key={shown[open].id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => info.offset.x > 80 ? move(-1) : info.offset.x < -80 && move(1)}
              className="relative h-[78vh] w-full max-w-5xl"
            >
              <Img src={shown[open].image} alt={shown[open].title} fill sizes="100vw" className="object-contain" />
              <figcaption className="absolute -bottom-10 left-0 right-0 text-center text-sm text-white/70">
                {shown[open].title} <span className="text-white/35">· {open + 1} / {shown.length}</span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- FAQ accordion ---------- */
export function FaqList({ items, dark }: { items: { id: string; question: string; answer: string }[]; dark?: boolean }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className={cn("divide-y border-y", dark ? "divide-white/10 border-white/10" : "divide-ink/10 border-ink/10")}>
      {items.map((f) => {
        const isOpen = open === f.id;
        return (
          <div key={f.id}>
            <button onClick={() => setOpen(isOpen ? null : f.id)} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen}>
              <span className="font-display text-lg font-medium tracking-tight sm:text-xl">{f.question}</span>
              <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500", isOpen ? "rotate-45 border-gold-400 bg-gold-400 text-forest-900" : dark ? "border-white/20" : "border-ink/15")}>
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
                  <p className={cn("max-w-3xl pb-7 text-[15.5px] leading-relaxed", dark ? "text-white/60" : "text-muted")}>{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Testimonials ---------- */
export function Testimonials({ items }: { items: { id: string; name: string; event: string; quote: string; rating: number }[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length]);
  const t = items[i];
  if (!t) return null;
  return (
    <div className="relative mx-auto max-w-4xl text-center">
      <Quote className="mx-auto h-10 w-10 text-gold-400" />
      <AnimatePresence mode="wait">
        <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.7, ease }}>
          <p className="mt-8 font-display text-2xl font-medium leading-snug tracking-tight sm:text-4xl">“{t.quote}”</p>
          <div className="mt-8 flex justify-center gap-1 text-gold-400">
            {Array.from({ length: Math.max(1, Math.min(5, t.rating)) }).map((_, k) => (
              <Star key={k} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="mt-3 font-semibold">{t.name}</p>
          <p className="text-sm text-muted">{t.event}</p>
        </motion.div>
      </AnimatePresence>
      {items.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {items.map((x, k) => (
            <button key={x.id} aria-label={`Review ${k + 1}`} onClick={() => setI(k)} className={cn("h-1.5 rounded-full transition-all duration-500", k === i ? "w-8 bg-gold-500" : "w-1.5 bg-ink/20")} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Inline lead form ---------- */
export function LeadForm({ source = "contact-form", dark, defaultEvent = "" }: { source?: string; dark?: boolean; defaultEvent?: string }) {
  const { quoteForm, site } = useSite();
  const [f, setF] = useState({ name: "", phone: "", email: "", eventType: defaultEvent, eventDate: "", guests: "", budget: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await submitLead({ ...f, source });
      setStatus("done");
    } catch (err) {
      setError((err as Error).message);
      setStatus("idle");
    }
  }

  if (status === "done")
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={cn("rounded-3xl p-8", dark ? "bg-white/[0.05]" : "bg-white")}>
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gold-400 text-forest-900">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-display text-3xl font-medium tracking-tight">{quoteForm.successTitle}</h3>
        <p className={cn("mt-3", dark ? "text-white/65" : "text-muted")}>{quoteForm.successText}</p>
        <a href={waLink(site.whatsapp, `Hi Lynn Luxe! I'm ${f.name}. ${f.eventType ? `I'm planning a ${f.eventType}` : "I'm planning an event"}${f.eventDate ? ` on ${f.eventDate}` : ""}.`)} target="_blank" rel="noopener" className="btn btn-gold mt-7">
          <MessageCircle className="h-5 w-5" /> Continue on WhatsApp
        </a>
      </motion.div>
    );

  return (
    <form onSubmit={send} className={cn("grid gap-3 sm:grid-cols-2", dark && "on-dark")}>
      <input required minLength={2} placeholder="Your name *" value={f.name} onChange={set("name")} className="field" autoComplete="name" />
      <input required type="tel" inputMode="tel" placeholder="Phone / WhatsApp *" value={f.phone} onChange={set("phone")} className="field" autoComplete="tel" />
      <input type="email" placeholder="Email" value={f.email} onChange={set("email")} className="field sm:col-span-2" autoComplete="email" />
      <select value={f.eventType} onChange={set("eventType")} className="field">
        <option value="">Type of event</option>
        {quoteForm.eventTypes.map((t) => <option key={t}>{t}</option>)}
      </select>
      <input type="date" value={f.eventDate} onChange={set("eventDate")} className={cn("field", dark && "[color-scheme:dark]")} aria-label="Event date" />
      <select value={f.guests} onChange={set("guests")} className="field">
        <option value="">Guests</option>
        {quoteForm.guestRanges.map((t) => <option key={t}>{t}</option>)}
      </select>
      <select value={f.budget} onChange={set("budget")} className="field">
        <option value="">Budget</option>
        {quoteForm.budgets.map((t) => <option key={t}>{t}</option>)}
      </select>
      <textarea rows={4} placeholder="Tell us about your dream event…" value={f.message} onChange={set("message")} className="field resize-none sm:col-span-2" />
      <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} className="hidden" aria-hidden />
      {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}
      <button disabled={status === "sending"} className="btn btn-gold !py-4 text-base sm:col-span-2">
        {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
        Request my free consultation <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
