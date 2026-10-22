import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryGrid } from "@/components/sections/interactive";
import { CtaBand } from "@/components/sections/sections";
import { QuoteButton } from "@/components/site/Floating";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { Parallax, Reveal, SplitText, Stagger, StaggerItem } from "@/components/ui/motion";
import { getProject, getProjects, getServices, getSetting } from "@/lib/content";
import { strList } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).slug);
  if (!p) return {};
  return { title: `${p.title} | ${p.occasion}${p.location ? ` in ${p.location}` : ""}`, description: p.summary, openGraph: { images: [p.cover] } };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [p, all, services, home, site] = await Promise.all([getProject(slug), getProjects(), getServices(), getSetting("home"), getSetting("site")]);
  if (!p) notFound();
  const i = all.findIndex((x) => x.id === p.id);
  const next = all[(i + 1) % all.length];
  const used = services.filter((s) => strList(p.services).includes(s.slug));
  const palette = strList(p.palette);
  const photos = strList(p.gallery).map((image, k) => ({ id: String(k), image, title: p.title, category: "" }));
  const chapters = [
    ["The brief", p.brief],
    ["The design", p.design],
    ["The details", p.details],
  ].filter(([, t]) => t);
  const meta = [
    ["Occasion", p.occasion],
    ["Location", p.location],
    ["Year", p.year],
    ["Guests", p.guests],
  ].filter(([, v]) => v);

  return (
    <>
      {/* Full-screen cover */}
      <section className="on-dark relative flex min-h-[100svh] items-end overflow-hidden bg-forest-950 text-white">
        <Parallax className="!absolute inset-0" amount={80}>
          <Img src={p.cover} alt={p.title} fill priority sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/30 to-forest-950/20" />
        <div className="container-x relative z-[2] pb-14 pt-40 sm:pb-20">
          <Reveal>
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Portfolio
            </Link>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="kicker mt-8">{p.occasion}</p>
          </Reveal>
          <h1 className="h-display mt-5 text-6xl sm:text-8xl lg:text-[9rem]">
            <SplitText text={p.title} immediate delay={0.15} />
          </h1>
          <Reveal delay={0.4} className="mt-10 grid grid-cols-2 gap-6 border-t border-white/15 pt-6 sm:grid-cols-4">
            {meta.map(([k, v]) => (
              <div key={k}>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-300">{k}</p>
                <p className="mt-1.5 font-display text-lg">{v}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* The story */}
      <section className="section bg-ivory">
        <div className="container-x grid gap-10 lg:grid-cols-[220px_1fr]">
          <Reveal>
            <p className="kicker">The story</p>
          </Reveal>
          <h2 className="font-display text-3xl font-medium leading-[1.2] tracking-tight sm:text-5xl">
            <SplitText text={p.summary} />
          </h2>
        </div>
      </section>

      {/* Chapters with sticky numbers */}
      {chapters.length > 0 && (
        <section className="bg-ivory pb-24 sm:pb-32">
          <div className="container-x space-y-px overflow-hidden rounded-[28px] bg-ink/10">
            {chapters.map(([title, text], k) => (
              <Reveal key={title} className="grid gap-6 bg-white p-7 sm:grid-cols-[120px_240px_1fr] sm:p-10">
                <span className="font-display text-5xl font-medium text-gold-400">0{k + 1}</span>
                <h3 className="font-display text-2xl font-medium tracking-tight">{title}</h3>
                <p className="text-lg leading-relaxed text-muted">{text}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Palette */}
      {palette.length > 0 && (
        <section className="on-dark bg-forest-900 py-20 text-white sm:py-28">
          <div className="container-x">
            <Reveal>
              <p className="kicker">The palette</p>
            </Reveal>
            <Stagger className="mt-10 grid grid-cols-5 gap-2 sm:gap-4">
              {palette.map((c) => (
                <StaggerItem key={c}>
                  <div className="aspect-[3/5] rounded-2xl ring-1 ring-white/10 sm:aspect-[3/4]" style={{ background: c }} />
                  <p className="mt-3 font-mono text-[11px] uppercase text-white/55">{c}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Gallery */}
      {photos.length > 0 && (
        <section className="section bg-ivory">
          <div className="container-x">
            <Reveal>
              <p className="kicker">Gallery</p>
              <h2 className="h-section mt-5">Moments from the day.</h2>
            </Reveal>
            <div className="mt-12">
              <GalleryGrid items={photos} filters={false} />
            </div>
          </div>
        </section>
      )}

      {/* Quote + services used */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <Reveal>
            {p.quote ? (
              <>
                <Quote className="h-10 w-10 text-gold-500" />
                <p className="mt-6 font-display text-3xl font-medium leading-snug tracking-tight sm:text-4xl">“{p.quote}”</p>
                {p.quoteBy && <p className="mt-6 font-semibold">{p.quoteBy}</p>}
              </>
            ) : (
              <>
                <p className="kicker">Inspired?</p>
                <p className="mt-6 font-display text-3xl font-medium leading-snug tracking-tight sm:text-4xl">Let's design a celebration around your story — from scratch.</p>
                <QuoteButton className="btn btn-dark mt-8" preset={{ services: `Like: ${p.title}`, source: `project:${p.slug}` }}>
                  Plan something similar <ArrowRight className="h-4 w-4" />
                </QuoteButton>
              </>
            )}
          </Reveal>
          {used.length > 0 && (
            <Reveal delay={0.1}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Services on this event</p>
              <div className="mt-5 space-y-2">
                {used.map((s) => (
                  <Link key={s.id} href={`/services/${s.slug}`} className="group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink/5 transition hover:ring-gold-400">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-800 text-gold-300"><Icon name={s.icon} className="h-[18px] w-[18px]" /></span>
                    <span className="flex-1 font-medium">{s.title}</span>
                    <ArrowRight className="h-4 w-4 text-ink/30 transition group-hover:translate-x-1 group-hover:text-gold-600" />
                  </Link>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Next project */}
      {next && next.id !== p.id && (
        <Link href={`/portfolio/${next.slug}`} className="on-dark group relative block overflow-hidden bg-forest-950 text-white">
          <div className="absolute inset-0 opacity-40 transition duration-1000 group-hover:scale-105 group-hover:opacity-60">
            <Img src={next.cover} alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <div className="container-x relative py-24 sm:py-36">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-300">Next event</p>
            <div className="mt-4 flex items-end justify-between gap-6">
              <p className="font-display text-5xl font-medium tracking-tight sm:text-8xl">{next.title}</p>
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gold-400 text-forest-900 transition group-hover:translate-x-2">
                <ArrowRight className="h-7 w-7" />
              </span>
            </div>
            <p className="mt-3 text-white/60">{next.occasion}</p>
          </div>
        </Link>
      )}

      <CtaBand cta={{ ...home.cta, title: "Planning your own celebration?" }} site={site} />
    </>
  );
}
