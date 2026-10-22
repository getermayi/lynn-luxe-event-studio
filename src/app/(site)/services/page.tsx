import { ArrowRight, Check, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LightHero } from "@/components/sections/editorial";
import { ServiceExplorer } from "@/components/sections/explorer";
import { FaqList } from "@/components/sections/interactive";
import { CtaBand, SectionHead } from "@/components/sections/sections";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { getFaqs, getServices, getSetting } from "@/lib/content";
import { cn, waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Event Planning, Wedding & Catering Services",
  description: "Event planning, venues & German Hangars, décor & styling, furniture, sound & light, catering and invitations — 40+ event services in Arunachal Pradesh.",
};

export default async function ServicesPage() {
  const [services, page, packages, faqs, home, site] = await Promise.all([
    getServices(),
    getSetting("servicesPage"),
    getSetting("packages"),
    getFaqs(),
    getSetting("home"),
    getSetting("site"),
  ]);
  const total = services.reduce((n, s) => n + s.subServices.length, 0);

  return (
    <>
      <LightHero
        kicker={page.kicker}
        title={page.title}
        text={page.text}
        crumbs={[{ href: "/services", label: "Services" }]}
        aside={
          <ol className="divide-y divide-ink/10 border-y border-ink/10">
            {services.map((s, i) => (
              <li key={s.slug}>
                <a href="#explore" className="group flex items-center gap-4 py-3 text-[15px]">
                  <span className="font-mono text-[11px] text-gold-600">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 font-medium transition group-hover:translate-x-1">{s.title}</span>
                  <span className="text-xs text-muted">{s.subServices.length}</span>
                </a>
              </li>
            ))}
          </ol>
        }
      >
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
          <div>
            <p className="font-display text-4xl font-medium text-forest-800">{services.length}</p>
            <p className="text-sm text-muted">departments</p>
          </div>
          <div>
            <p className="font-display text-4xl font-medium text-forest-800">{total}</p>
            <p className="text-sm text-muted">individual services</p>
          </div>
          <div>
            <p className="font-display text-4xl font-medium text-forest-800">1</p>
            <p className="text-sm text-muted">point of contact</p>
          </div>
        </div>
      </LightHero>

      <section id="explore" className="section scroll-mt-20 bg-ivory">
        <div className="container-x">
          <ServiceExplorer
            services={services.map((s) => ({
              slug: s.slug,
              title: s.title,
              icon: s.icon,
              kicker: s.kicker,
              tagline: s.tagline,
              summary: s.summary,
              image: s.image,
              subs: s.subServices.map((x) => ({ slug: x.slug, title: x.title, summary: x.summary })),
            }))}
          />
        </div>
      </section>

      <section id="packages" className="on-dark section scroll-mt-20 relative overflow-hidden bg-forest-900 text-white">
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-gold-400/10 blur-[120px]" />
        <div className="container-x relative">
          <SectionHead kicker={page.packagesKicker} title={page.packagesTitle} text={page.packagesText} />
          <Stagger className="mt-14 grid gap-4 lg:grid-cols-3">
            {packages.map((p) => (
              <StaggerItem key={p.name} className={cn("relative flex flex-col rounded-[26px] p-7 sm:p-9", p.highlighted ? "bg-gold-400 text-forest-900" : "bg-white/[0.04] ring-1 ring-white/10")}>
                {p.highlighted && <span className="absolute right-6 top-6 rounded-full bg-forest-900 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-300">Most chosen</span>}
                <p className={cn("font-mono text-[11px] uppercase tracking-[0.2em]", p.highlighted ? "text-forest-900/60" : "text-gold-300")}>{p.tagline}</p>
                <h3 className="mt-4 font-display text-3xl font-medium tracking-tight">{p.name}</h3>
                <p className={cn("mt-2 text-sm", p.highlighted ? "text-forest-900/70" : "text-white/55")}>Best for: {p.bestFor}</p>
                <ul className="mt-7 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[15px]">
                      <Check className={cn("mt-0.5 h-4 w-4 shrink-0", p.highlighted ? "text-forest-800" : "text-gold-300")} strokeWidth={2.5} /> {f}
                    </li>
                  ))}
                </ul>
                <p className={cn("mt-8 border-t pt-5 text-sm", p.highlighted ? "border-forest-900/15" : "border-white/10 text-white/55")}>Price: tailored quote after a free call</p>
                <Link href={`/inquire?service=${encodeURIComponent(p.name)}`} className={cn("btn mt-5 w-full", p.highlighted ? "btn-dark" : "btn-gold")}>
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHead kicker="Not sure where to begin?" title="Tell us the occasion. We'll recommend the right support." />
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
              <Link href="/inquire" className="btn btn-dark">Start an inquiry <ArrowRight className="h-4 w-4" /></Link>
              <a href={waLink(site.whatsapp, site.whatsappMessage)} target="_blank" rel="noopener" className="btn btn-ghost text-forest-800">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Reveal>
          </div>
          <FaqList items={faqs.filter((f) => ["Services", "Pricing"].includes(f.category)).concat(faqs.filter((f) => !["Services", "Pricing"].includes(f.category))).slice(0, 5)} />
        </div>
      </section>

      <CtaBand cta={home.cta} site={site} />
    </>
  );
}
