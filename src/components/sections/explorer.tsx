"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Loader2, MessageCircle, Search, Send } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { submitLead, useSite } from "@/components/site/SiteProvider";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { cn, waLink } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- Services: tabbed explorer ---------- */
type Svc = { slug: string; title: string; icon: string; kicker: string; tagline: string; summary: string; image: string; subs: { slug: string; title: string; summary: string }[] };

export function ServiceExplorer({ services }: { services: Svc[] }) {
  const [active, setActive] = useState(0);
  const s = services[active];
  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr] lg:gap-12">
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:sticky lg:top-28 lg:mx-0 lg:block lg:space-y-1.5 lg:self-start lg:overflow-visible lg:px-0">
        {services.map((x, i) => (
          <button
            key={x.slug}
            onClick={() => setActive(i)}
            className={cn(
              "group flex shrink-0 items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-all duration-500 lg:w-full",
              i === active ? "bg-forest-800 text-white shadow-[0_20px_40px_-20px_rgba(0,38,23,0.6)]" : "bg-white text-ink ring-1 ring-ink/8 hover:ring-ink/20 lg:bg-transparent lg:ring-0 lg:hover:bg-white",
            )}
          >
            <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl transition", i === active ? "bg-gold-400 text-forest-900" : "bg-forest-800/5 text-forest-700")}>
              <Icon name={x.icon} className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block whitespace-nowrap font-display text-[15.5px] font-medium">{x.title}</span>
              <span className={cn("hidden text-xs lg:block", i === active ? "text-white/55" : "text-muted")}>{x.subs.length} services</span>
            </span>
            <span className={cn("ml-auto hidden font-mono text-[11px] lg:block", i === active ? "text-gold-300" : "text-ink/30")}>{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={s.slug} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.55, ease }} className="overflow-hidden rounded-[28px] bg-white ring-1 ring-ink/5">
          <div className="relative aspect-[16/8] overflow-hidden">
            <Img src={s.image} alt={s.title} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-300">{s.kicker}</p>
              <h3 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-5xl">{s.title}</h3>
            </div>
          </div>
          <div className="p-6 sm:p-9">
            <p className="font-display text-xl leading-snug text-forest-800 sm:text-2xl">{s.tagline}</p>
            <p className="mt-3 text-muted">{s.summary}</p>
            <div className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-ink/8 sm:grid-cols-2">
              {s.subs.map((x, j) => (
                <Link key={x.slug} href={`/services/${s.slug}/${x.slug}`} className="group flex items-start gap-4 bg-white p-5 transition hover:bg-cream">
                  <span className="mt-1 font-mono text-[11px] text-gold-600">{String(j + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2 font-semibold">
                      {x.title}
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/25 transition group-hover:text-gold-600" />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{x.summary}</span>
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/services/${s.slug}`} className="btn btn-dark">
                Explore {s.title} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/inquire?service=${encodeURIComponent(s.title)}`} className="btn btn-ghost text-forest-800">
                Inquire
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------- Portfolio: filter by occasion ---------- */
type Proj = { id: string; slug: string; title: string; occasion: string; location: string; year: string; cover: string; summary: string };

export function PortfolioIndex({ projects }: { projects: Proj[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.occasion).filter(Boolean)))], [projects]);
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? projects : projects.filter((p) => p.occasion === cat);
  return (
    <>
      <div className="no-scrollbar -mx-5 mb-12 flex items-center gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cn("chip shrink-0", cat === c ? "border-forest-800 bg-forest-800 text-white" : "border-ink/15 text-ink/70 hover:border-ink/40")}>
            {c}
            <span className="opacity-50">{c === "All" ? projects.length : projects.filter((p) => p.occasion === c).length}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="grid gap-x-6 gap-y-14 md:grid-cols-12">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => {
            const pattern = ["md:col-span-7", "md:col-span-5 md:mt-24", "md:col-span-5", "md:col-span-7 md:-mt-16"][i % 4];
            return (
              <motion.div layout key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.7, ease }} className={pattern}>
                <Link href={`/portfolio/${p.slug}`} className="group block">
                  <div className={cn("relative overflow-hidden rounded-[24px] bg-sand", i % 4 === 0 || i % 4 === 3 ? "aspect-[5/4]" : "aspect-[4/5]")}>
                    <Img src={p.cover} alt={p.title} fill sizes="(min-width:768px) 55vw, 100vw" className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.05]" />
                    <div className="absolute inset-0 bg-forest-950/0 transition duration-700 group-hover:bg-forest-950/30" />
                    <span className="absolute bottom-5 right-5 grid h-14 w-14 scale-75 place-items-center rounded-full bg-gold-400 text-forest-900 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100">
                      <ArrowUpRight className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-6">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-700">{p.occasion}</p>
                      <h3 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">{p.title}</h3>
                      <p className="mt-2 max-w-md text-[15px] text-muted">{p.summary}</p>
                    </div>
                    <span className="shrink-0 font-mono text-sm text-ink/40">{p.year}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

/* ---------- FAQ with search + tabs ---------- */
type Q = { id: string; question: string; answer: string; category: string };

export function FaqSearch({ items }: { items: Q[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((f) => f.category || "General")))], [items]);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const shown = items.filter((f) => (cat === "All" || f.category === cat) && (f.question + f.answer).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions…" className="field pl-11" />
        </label>
        <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:block lg:space-y-1 lg:px-0">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("flex shrink-0 items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition lg:w-full", cat === c ? "bg-forest-800 text-white" : "bg-white text-ink/65 ring-1 ring-ink/8 hover:text-ink lg:bg-transparent lg:ring-0")}>
              {c}
              <span className="opacity-50">{c === "All" ? items.length : items.filter((f) => f.category === c).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        {shown.length === 0 && <p className="rounded-2xl bg-white p-8 text-muted">No questions match “{q}”. Call or WhatsApp us — we're happy to help.</p>}
        <div className="space-y-3">
          {shown.map((f) => {
            const isOpen = open === f.id;
            return (
              <motion.div layout key={f.id} className={cn("overflow-hidden rounded-2xl bg-white ring-1 transition", isOpen ? "ring-gold-400/60 shadow-[0_20px_50px_-30px_rgba(0,38,23,0.4)]" : "ring-ink/6")}>
                <button onClick={() => setOpen(isOpen ? null : f.id)} className="flex w-full items-center gap-5 p-5 text-left sm:p-6" aria-expanded={isOpen}>
                  <span className="hidden rounded-full bg-cream px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-gold-700 sm:block">{f.category}</span>
                  <span className="flex-1 font-display text-lg font-medium tracking-tight">{f.question}</span>
                  <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full text-lg transition duration-500", isOpen ? "rotate-45 bg-gold-400 text-forest-900" : "bg-cream")}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.4, ease }}>
                      <p className="px-5 pb-6 text-[15.5px] leading-relaxed text-muted sm:px-6 sm:pl-[118px]">{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- Full inquiry form (/inquire) ---------- */
export function InquiryForm({
  services,
  successTitle,
  successText,
  defaultService = "",
  defaultEvent = "",
}: {
  services: string[];
  successTitle: string;
  successText: string;
  defaultService?: string;
  defaultEvent?: string;
}) {
  const { quoteForm, site } = useSite();
  const [f, setF] = useState({ company: "", name: "", phone: "", email: "", eventType: defaultEvent, eventDate: "", guests: "", location: "", budget: "", message: "", website: "" });
  const [picked, setPicked] = useState<string[]>(defaultService ? [defaultService] : []);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const waText = [
    `Hello Lynn Luxe, I'd like to plan an event.`,
    `Name: ${f.name}${f.company ? ` (${f.company})` : ""}`,
    `Phone: ${f.phone}`,
    f.eventType && `Occasion: ${f.eventType}`,
    f.eventDate && `Date: ${f.eventDate}`,
    f.guests && `Guests: ${f.guests}`,
    f.location && `Location: ${f.location}`,
    f.budget && `Budget: ${f.budget}`,
    picked.length > 0 && `Services: ${picked.join(", ")}`,
    f.message && `Notes: ${f.message}`,
  ].filter(Boolean).join("\n");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await submitLead({
        ...f,
        services: picked.join(", "),
        message: [f.company && `Company: ${f.company}`, f.location && `Location: ${f.location}`, f.message].filter(Boolean).join("\n"),
        source: "inquire-page",
      });
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError((err as Error).message);
      setStatus("idle");
    }
  }

  if (status === "done")
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] bg-white p-8 ring-1 ring-ink/5 sm:p-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="grid h-16 w-16 place-items-center rounded-full bg-gold-400 text-forest-900">
          <Check className="h-8 w-8" strokeWidth={2.5} />
        </motion.div>
        <h2 className="mt-6 font-display text-4xl font-medium tracking-tight">{successTitle}</h2>
        <p className="mt-3 max-w-lg text-lg text-muted">{successText}</p>
        <a href={waLink(site.whatsapp, waText)} target="_blank" rel="noopener" className="btn btn-gold mt-8 !px-8 !py-4">
          <MessageCircle className="h-5 w-5" /> Send on WhatsApp
        </a>
      </motion.div>
    );

  const Section = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
    <fieldset className="rounded-[24px] bg-white p-6 ring-1 ring-ink/5 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-forest-800 font-mono text-xs text-gold-300">{n}</span>
        <h2 className="font-display text-xl font-medium tracking-tight">{title}</h2>
      </div>
      {children}
    </fieldset>
  );

  return (
    <form onSubmit={send} className="space-y-4">
      {Section({
        n: "1",
        title: "About you",
        children: (
          <div className="grid gap-3 sm:grid-cols-2">
            <input required minLength={2} placeholder="Your name *" value={f.name} onChange={set("name")} className="field" autoComplete="name" />
            <input required type="tel" inputMode="tel" placeholder="Phone / WhatsApp *" value={f.phone} onChange={set("phone")} className="field" autoComplete="tel" />
            <input type="email" placeholder="Email" value={f.email} onChange={set("email")} className="field" autoComplete="email" />
            <input placeholder="Company (for corporate events)" value={f.company} onChange={set("company")} className="field" autoComplete="organization" />
          </div>
        ),
      })}
      {Section({
        n: "2",
        title: "The occasion",
        children: (
          <>
            <div className="flex flex-wrap gap-2">
              {quoteForm.eventTypes.map((t) => (
                <button key={t} type="button" onClick={() => setF({ ...f, eventType: t })} className={cn("chip", f.eventType === t ? "border-forest-800 bg-forest-800 text-white" : "border-ink/12 text-ink/75 hover:border-ink/35")}>
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <input type="date" value={f.eventDate} onChange={set("eventDate")} className="field" aria-label="Event date" />
              <input placeholder="Location / venue (if known)" value={f.location} onChange={set("location")} className="field" />
              <select value={f.guests} onChange={set("guests")} className="field">
                <option value="">Expected guests</option>
                {quoteForm.guestRanges.map((g) => <option key={g}>{g}</option>)}
              </select>
              <select value={f.budget} onChange={set("budget")} className="field">
                <option value="">Approximate budget</option>
                {quoteForm.budgets.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          </>
        ),
      })}
      {Section({
        n: "3",
        title: "What you need",
        children: (
          <div className="grid gap-2 sm:grid-cols-2">
            {services.map((s) => {
              const on = picked.includes(s);
              return (
                <button key={s} type="button" onClick={() => setPicked(on ? picked.filter((x) => x !== s) : [...picked, s])} className={cn("flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition", on ? "border-gold-500 bg-gold-50" : "border-ink/10 hover:border-ink/30")}>
                  <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-md border transition", on ? "border-forest-800 bg-forest-800 text-gold-300" : "border-ink/25")}>{on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}</span>
                  {s}
                </button>
              );
            })}
          </div>
        ),
      })}
      {Section({
        n: "4",
        title: "Tell us about your event",
        children: <textarea rows={5} placeholder="Theme ideas, must-haves, inspiration, questions…" value={f.message} onChange={set("message")} className="field resize-none" />,
      })}
      <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} className="hidden" aria-hidden />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-col gap-4 rounded-[24px] bg-forest-800 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="max-w-sm text-sm text-white/65">Your details go straight to our team. Next, you can send them on WhatsApp in one tap.</p>
        <button disabled={status === "sending" || !f.eventType} className="btn btn-gold !px-8 !py-4 disabled:opacity-60">
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {f.eventType ? "Send inquiry" : "Choose an occasion first"}
        </button>
      </div>
    </form>
  );
}
