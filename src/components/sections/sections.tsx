import { ArrowRight, ArrowUpRight, Check, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { QuoteButton } from "@/components/site/Floating";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { Counter, Parallax, Reveal, SplitText, Stagger, StaggerItem } from "@/components/ui/motion";
import type { ServiceWithSubs } from "@/lib/content";
import type { Settings } from "@/lib/defaults";
import { cn, objList, waLink } from "@/lib/utils";

/* ---------- Page hero ---------- */
export function PageHero({
  kicker,
  title,
  text,
  image,
  video,
  crumbs = [],
  children,
  tall = false,
}: {
  kicker?: string;
  title: string;
  text?: string;
  image?: string;
  video?: string;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <section className={cn("on-dark grain relative flex items-end overflow-hidden bg-forest-900 text-white", tall ? "min-h-[92svh]" : "min-h-[72svh] sm:min-h-[78svh]")}>
      <div className="absolute inset-0">
        {video ? (
          <video src={video} poster={image} autoPlay muted loop playsInline className="h-full w-full object-cover" />
        ) : (
          image && <Img src={image} alt="" fill priority sizes="100vw" className="animate-kenburns object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/60 to-transparent" />
      </div>
      <div className="container-x relative z-[2] pb-14 pt-36 sm:pb-20 lg:pb-24">
        {crumbs.length > 0 && (
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-white/50">
              <Link href="/" className="hover:text-white">Home</Link>
              {crumbs.map((c) => (
                <span key={c.href} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Link href={c.href} className="hover:text-white">{c.label}</Link>
                </span>
              ))}
            </nav>
          </Reveal>
        )}
        {kicker && (
          <Reveal>
            <p className="kicker">{kicker}</p>
          </Reveal>
        )}
        <h1 className="h-display mt-5 max-w-5xl text-[2.7rem] sm:text-6xl lg:text-[5.4rem]">
          <SplitText text={title} immediate delay={0.15} />
        </h1>
        {text && (
          <Reveal delay={0.35}>
            <p className="lead mt-6 max-w-2xl">{text}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.5}>{children}</Reveal>}
      </div>
    </section>
  );
}

/* ---------- Section heading ---------- */
export function SectionHead({
  kicker,
  title,
  text,
  center,
  action,
  className,
}: {
  kicker?: string;
  title: string;
  text?: string;
  center?: boolean;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", center && "items-center text-center lg:flex-col lg:items-center", className)}>
      <div className={cn("max-w-3xl", center && "mx-auto")}>
        {kicker && (
          <Reveal>
            <p className="kicker">{kicker}</p>
          </Reveal>
        )}
        <h2 className="h-section mt-5">
          <SplitText text={title} />
        </h2>
        {text && (
          <Reveal delay={0.15}>
            <p className={cn("lead mt-5 max-w-2xl", center && "mx-auto")}>{text}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.2}>{action}</Reveal>}
    </div>
  );
}

/* ---------- Service cards ---------- */
export function ServiceGrid({ services }: { services: ServiceWithSubs[] }) {
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {services.map((s, i) => (
        <StaggerItem key={s.id} className={cn(((services.length % 3 === 1 && (i === 0 || i === 4)) || (services.length % 3 === 2 && i === 0)) && "lg:col-span-2")}>
          <Link href={`/services/${s.slug}`} className="group relative block h-[440px] overflow-hidden rounded-[26px] bg-forest-800 text-white sm:h-[480px]">
            <Img src={s.image} alt={s.title} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/45 to-forest-950/5 transition-opacity duration-700 group-hover:from-forest-950/95" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-gold-200 ring-1 ring-white/20 backdrop-blur-md">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="font-mono text-[11px] tracking-[0.2em] text-white/60">
                {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold-300">{s.subServices.length} services</p>
              <h3 className="mt-2 font-display text-[1.75rem] font-medium leading-tight tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/65">{s.tagline}</p>
              <div className="grid grid-rows-[0fr] transition-all duration-700 ease-[var(--ease-luxe)] group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {s.subServices.slice(0, 5).map((x) => (
                      <li key={x.id} className="rounded-full bg-white/10 px-2.5 py-1 text-[12px] text-white/80 backdrop-blur">
                        {x.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
                Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ---------- Event cards (horizontal on mobile) ---------- */
export function EventRail({ events }: { events: { id: string; slug: string; title: string; tagline: string; image: string }[] }) {
  return (
    <Stagger className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
      {events.map((e) => (
        <StaggerItem key={e.id} className="w-[78vw] shrink-0 snap-start sm:w-auto">
          <Link href={`/events/${e.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-sand">
              <Img src={e.image} alt={e.title} fill sizes="(min-width:1024px) 33vw, 80vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
              <span className="absolute right-4 top-4 grid h-11 w-11 -rotate-45 place-items-center rounded-full bg-white/90 text-forest-900 opacity-0 transition duration-500 group-hover:rotate-0 group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-display text-2xl font-medium tracking-tight">{e.title}</h3>
                <p className="mt-1 text-sm text-white/70">{e.tagline}</p>
              </div>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ---------- Stats ---------- */
export function Stats({ stats, dark }: { stats: Settings["home"]["stats"]; dark?: boolean }) {
  return (
    <Stagger className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-[26px] lg:grid-cols-4", dark ? "bg-white/10" : "bg-ink/10")}>
      {stats.map((s) => (
        <StaggerItem key={s.label} className={cn("p-6 sm:p-8", dark ? "bg-forest-900" : "bg-ivory")}>
          <Counter to={Number(s.value) || 0} suffix={s.suffix} className={cn("font-display text-4xl font-medium tracking-tight sm:text-6xl", dark ? "gold-text" : "text-forest-800")} />
          <p className={cn("mt-3 text-sm leading-snug", dark ? "text-white/60" : "text-muted")}>{s.label}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ---------- Marquee ---------- */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={cn("relative flex overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]", className)}>
      <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10 [--marquee-duration:45s]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-3xl font-medium tracking-tight sm:text-5xl">
            {t}
            <span className="text-gold-400">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Process ---------- */
export function Process({ data }: { data: Settings["home"]["process"] }) {
  return (
    <section className="on-dark section relative overflow-hidden bg-forest-800 text-white">
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-gold-400/10 blur-[120px]" />
      <div className="container-x relative">
        <SectionHead kicker={data.kicker} title={data.title} />
        <Stagger className="mt-16 grid gap-px overflow-hidden rounded-[26px] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {data.steps.map((s, i) => (
            <StaggerItem key={s.title} className="group relative bg-forest-800 p-7 transition-colors duration-500 hover:bg-forest-700 sm:p-9">
              <span className="font-mono text-xs tracking-[0.2em] text-gold-300">STEP {String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-10 font-display text-3xl font-medium tracking-tight sm:mt-16">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">{s.text}</p>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gold-400 transition-all duration-700 group-hover:w-full" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- Venue feature ---------- */
type VenueRow = { id: string; slug: string; title: string; kicker: string; tagline: string; summary: string; image: string; stats: unknown; location: string };
export function VenueShowcase({ venues }: { venues: VenueRow[] }) {
  return (
    <div className="space-y-5">
      {venues.map((v, i) => (
        <Reveal key={v.id}>
          <Link href={`/venues/${v.slug}`} className="group grid overflow-hidden rounded-[28px] bg-forest-900 text-white lg:grid-cols-2">
            <div className={cn("relative min-h-[300px] overflow-hidden sm:min-h-[420px]", i % 2 && "lg:order-2")}>
              <Img src={v.image} alt={v.title} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-105" />
            </div>
            <div className="on-dark flex flex-col justify-between gap-10 p-7 sm:p-12">
              <div>
                <p className="kicker">{v.kicker}</p>
                <h3 className="mt-5 font-display text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl">{v.title}</h3>
                <p className="mt-3 font-display text-lg text-gold-200">{v.tagline}</p>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">{v.summary}</p>
              </div>
              <div>
                <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-7">
                  {objList<{ value: string; label: string }>(v.stats).map((s) => (
                    <div key={s.label}>
                      <p className="font-display text-2xl font-medium text-gold-300 sm:text-3xl">{s.value}</p>
                      <p className="mt-1 text-xs text-white/50">{s.label}</p>
                    </div>
                  ))}
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
                  View venue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- Split image + text ---------- */
export function SplitFeature({
  kicker,
  title,
  text,
  image,
  points = [],
  reverse,
  children,
}: {
  kicker?: string;
  title: string;
  text?: string;
  image: string;
  points?: string[];
  reverse?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <Reveal className={cn("relative", reverse && "lg:order-2")}>
        <Parallax className="aspect-[4/5] rounded-[28px] sm:aspect-[5/5]" amount={40}>
          <Img src={image} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </Parallax>
        <div className="absolute -bottom-6 -right-3 hidden animate-float rounded-2xl bg-forest-800 px-5 py-4 text-white shadow-2xl sm:block lg:-right-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-300">Lynn Luxe</p>
          <p className="mt-1 font-display text-lg">Plan · Design · Celebrate</p>
        </div>
      </Reveal>
      <div>
        {kicker && (
          <Reveal>
            <p className="kicker">{kicker}</p>
          </Reveal>
        )}
        <h2 className="h-section mt-5">
          <SplitText text={title} />
        </h2>
        {text && (
          <Reveal delay={0.1}>
            <p className="lead mt-6">{text}</p>
          </Reveal>
        )}
        {points.length > 0 && (
          <Stagger className="mt-8 space-y-3.5">
            {points.map((p) => (
              <StaggerItem key={p} className="flex items-start gap-3.5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-400/20 text-gold-700">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-[15.5px] leading-relaxed">{p}</span>
              </StaggerItem>
            ))}
          </Stagger>
        )}
        {children && <Reveal delay={0.2} className="mt-10">{children}</Reveal>}
      </div>
    </div>
  );
}

/* ---------- Final CTA band ---------- */
export function CtaBand({ cta, site, preset }: { cta: Settings["home"]["cta"]; site: Settings["site"]; preset?: { eventType?: string; services?: string } }) {
  return (
    <section className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="on-dark grain relative overflow-hidden rounded-[32px] bg-forest-900 text-white">
        <div className="absolute inset-0 opacity-45">
          <Img src={cta.image} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/30" />
        <div className="container-x relative z-[2] py-20 sm:py-28 lg:py-36">
          <Reveal>
            <p className="kicker">{cta.kicker}</p>
          </Reveal>
          <h2 className="h-display mt-6 max-w-4xl text-[2.6rem] sm:text-6xl lg:text-[4.6rem]">
            <SplitText text={cta.title} highlight={cta.title.split(" ").slice(-2).join(" ")} />
          </h2>
          <Reveal delay={0.2}>
            <p className="lead mt-6 max-w-xl">{cta.text}</p>
          </Reveal>
          <Reveal delay={0.3} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <QuoteButton className="btn btn-gold !px-8 !py-4 text-base" preset={{ source: "cta-band", ...preset }}>
              Get my free quote <ArrowRight className="h-4 w-4" />
            </QuoteButton>
            <a href={waLink(site.whatsapp, site.whatsappMessage)} target="_blank" rel="noopener" className="btn btn-ghost-light !px-8 !py-4 text-base">
              <MessageCircle className="h-5 w-5" /> WhatsApp us
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Check list ---------- */
export function CheckList({ items, dark }: { items: string[]; dark?: boolean }) {
  return (
    <Stagger className="grid gap-3 sm:grid-cols-2">
      {items.map((p) => (
        <StaggerItem key={p} className={cn("flex items-start gap-3 rounded-2xl p-4", dark ? "bg-white/[0.05] ring-1 ring-white/10" : "bg-white ring-1 ring-ink/5")}>
          <span className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", dark ? "bg-gold-400 text-forest-900" : "bg-forest-800 text-gold-300")}>
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <span className="text-[15px] leading-relaxed">{p}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
