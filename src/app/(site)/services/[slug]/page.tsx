import { ArrowRight, ArrowUpRight, Check, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/sections/editorial";
import { FaqList } from "@/components/sections/interactive";
import { CtaBand, SectionHead } from "@/components/sections/sections";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { Reveal, SplitText, Stagger, StaggerItem } from "@/components/ui/motion";
import { getEvents, getFaqs, getProjects, getService, getServices, getSetting } from "@/lib/content";
import { strList, telLink, waLink } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getService((await params).slug);
  if (!s) return {};
  return { title: s.seoTitle || s.title, description: s.seoDescription || s.summary, openGraph: { images: [s.image] } };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [s, all, events, projects, faqs, home, site] = await Promise.all([
    getService(slug),
    getServices(),
    getEvents(),
    getProjects(),
    getFaqs(),
    getSetting("home"),
    getSetting("site"),
  ]);
  if (!s) notFound();
  const idx = all.findIndex((x) => x.id === s.id);
  const next = all[(idx + 1) % all.length];
  const related = events.filter((e) => strList(e.included).includes(s.slug));
  const work = projects.filter((p) => strList(p.services).includes(s.slug)).slice(0, 2);
  const tabs = [
    ["overview", "Overview"],
    ["included", `What's included (${s.subServices.length})`],
    ["process", "How it works"],
    ...(work.length ? [["work", "Our work"]] : []),
    ["faq", "FAQ"],
  ];

  return (
    <>
      {/* Split editorial hero */}
      <section className="relative bg-cream pt-28 sm:pt-32">
        <div className="container-x grid gap-10 pb-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16 lg:pb-20">
          <div>
            <Reveal>
              <nav className="flex items-center gap-2 text-[13px] text-ink/45">
                <Link href="/services" className="hover:text-ink">Services</Link> /
                <span className="text-ink/70">{String(idx + 1).padStart(2, "0")}</span>
              </nav>
            </Reveal>
            <Reveal delay={0.05}>
              <span className="mt-8 inline-grid h-14 w-14 place-items-center rounded-2xl bg-forest-800 text-gold-300">
                <Icon name={s.icon} className="h-6 w-6" />
              </span>
            </Reveal>
            <h1 className="h-display mt-7 text-[2.8rem] text-forest-900 sm:text-6xl lg:text-7xl">
              <SplitText text={s.title} immediate delay={0.1} />
            </h1>
            <Reveal delay={0.25}>
              <p className="mt-5 font-display text-xl text-gold-700 sm:text-2xl">{s.tagline}</p>
              <p className="lead mt-4 max-w-xl">{s.summary}</p>
            </Reveal>
            <Reveal delay={0.35} className="mt-9 flex flex-wrap gap-3">
              <Link href={`/inquire?service=${encodeURIComponent(s.title)}`} className="btn btn-dark !px-7 !py-4">
                Inquire about {s.title.toLowerCase()} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={waLink(site.whatsapp, `Hello Lynn Luxe, I'd like to know more about ${s.title}.`)} target="_blank" rel="noopener" className="btn btn-ghost !px-7 !py-4 text-forest-800">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] sm:aspect-[5/5]">
              <Img src={s.image} alt={s.title} fill priority sizes="(min-width:1024px) 45vw, 100vw" className="animate-kenburns object-cover" />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur sm:left-auto sm:w-72">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-700">{s.kicker}</p>
              <ul className="mt-3 space-y-2">
                {strList(s.highlights).map((h) => (
                  <li key={h} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" /> {h}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sticky in-page navigation */}
        <div className="sticky top-[68px] z-30 border-y border-ink/10 bg-cream/90 backdrop-blur-xl lg:top-[76px]">
          <div className="container-x no-scrollbar flex gap-1 overflow-x-auto py-2">
            {tabs.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-ink/65 transition hover:bg-white hover:text-ink">
                {label}
              </a>
            ))}
          </div>
        </div>

      <section id="overview" className="section scroll-mt-32 bg-ivory">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          <Reveal>
            <p className="kicker">Overview</p>
            <p className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight sm:text-[2.2rem]">{s.description}</p>
          </Reveal>
          <Reveal delay={0.1} className="on-dark h-fit rounded-[24px] bg-forest-800 p-7 text-white lg:sticky lg:top-40">
            <p className="kicker">Free consultation</p>
            <p className="mt-4 font-display text-2xl font-medium leading-tight">Get a tailored proposal for {s.title.toLowerCase()}.</p>
            <Link href={`/inquire?service=${encodeURIComponent(s.title)}`} className="btn btn-gold mt-6 w-full">Start an inquiry</Link>
            <a href={telLink(site.phone)} className="mt-3 flex items-center justify-center gap-2 py-2 text-sm text-white/70 hover:text-white">
              <Phone className="h-4 w-4 text-gold-300" /> {site.phone}
            </a>
          </Reveal>
        </div>
      </section>

      <section id="included" className="scroll-mt-32 bg-ivory pb-24 sm:pb-32">
        <div className="container-x">
          <SectionHead kicker={`${s.subServices.length} services inside`} title={`What's included`} />
          <div className="mt-12 border-t border-ink/10">
            {s.subServices.map((x, i) => (
              <Reveal key={x.id}>
                <Link href={`/services/${s.slug}/${x.slug}`} className="group grid items-center gap-5 border-b border-ink/10 py-7 transition-colors hover:bg-white sm:grid-cols-[70px_1fr_1.1fr_160px] sm:px-4">
                  <span className="font-mono text-sm text-gold-600">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl font-medium tracking-tight transition group-hover:text-gold-700 sm:text-[1.7rem]">{x.title}</h3>
                    <p className="mt-1.5 text-[15px] text-muted">{x.summary}</p>
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {strList(x.features).map((f) => (
                      <li key={f} className="rounded-full bg-cream px-3 py-1 text-[13px] text-ink/70">{f}</li>
                    ))}
                  </ul>
                  <div className="relative hidden h-24 overflow-hidden rounded-xl sm:block">
                    <Img src={x.image || s.image} alt="" fill sizes="160px" className="object-cover grayscale-[40%] transition duration-700 group-hover:scale-110 group-hover:grayscale-0" />
                    <span className="absolute inset-0 grid place-items-center bg-forest-900/40 opacity-0 transition group-hover:opacity-100">
                      <ArrowUpRight className="h-6 w-6 text-white" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="on-dark section scroll-mt-32 bg-forest-900 text-white">
        <div className="container-x">
          <SectionHead kicker="How it works" title={`${s.title}, step by step.`} />
          <Stagger className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-gold-400/60 via-gold-400/30 to-transparent md:block" />
            {home.process.steps.map((st, i) => (
              <StaggerItem key={st.title} className="relative">
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gold-400 font-mono text-sm font-medium text-forest-900 ring-8 ring-forest-900">{i + 1}</span>
                <h3 className="mt-6 font-display text-2xl font-medium">{st.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/60">{st.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {work.length > 0 && (
        <section id="work" className="section scroll-mt-32 bg-cream">
          <div className="container-x">
            <SectionHead kicker="Our work" title="Where we've done this." action={<Link href="/portfolio" className="btn btn-ghost text-forest-800">Full portfolio <ArrowRight className="h-4 w-4" /></Link>} />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {work.map((p) => <Reveal key={p.id}><ProjectCard p={p} /></Reveal>)}
            </div>
          </div>
        </section>
      )}

      <section id="faq" className="section scroll-mt-32 bg-ivory">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHead kicker="FAQ" title="Good to know" />
            {related.length > 0 && (
              <Reveal delay={0.1} className="mt-10">
                <p className="text-sm font-semibold text-muted">Popular for</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {related.map((e) => (
                    <Link key={e.id} href={`/events/${e.slug}`} className="chip border-ink/15 hover:border-gold-500">{e.title}</Link>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
          <FaqList items={faqs.slice(0, 5)} />
        </div>
      </section>

      <section className="bg-ivory pb-16">
        <div className="container-x">
          <Link href={`/services/${next.slug}`} className="group flex items-center justify-between gap-6 rounded-[28px] bg-white p-7 ring-1 ring-ink/5 transition hover:ring-gold-400 sm:p-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Next service</p>
              <p className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-5xl">{next.title}</p>
            </div>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-forest-800 text-gold-300 transition group-hover:translate-x-1">
              <ArrowRight className="h-6 w-6" />
            </span>
          </Link>
        </div>
      </section>

      <CtaBand cta={home.cta} site={site} preset={{ services: s.title }} />
    </>
  );
}
