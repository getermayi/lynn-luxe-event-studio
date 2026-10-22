import { ArrowLeft, ArrowRight, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckList, CtaBand, PageHero, SectionHead } from "@/components/sections/sections";
import { QuoteButton } from "@/components/site/Floating";
import { Img } from "@/components/ui/Img";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { getService, getSetting } from "@/lib/content";
import { strList, telLink, waLink } from "@/lib/utils";

type Props = { params: Promise<{ slug: string; sub: string }> };

async function load(slug: string, sub: string) {
  const s = await getService(slug);
  const x = s?.subServices.find((y) => y.slug === sub);
  return s && x ? { s, x } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sub } = await params;
  const d = await load(slug, sub);
  if (!d) return {};
  return { title: `${d.x.title} — ${d.s.title}`, description: d.x.summary, openGraph: { images: [d.x.image || d.s.image] } };
}

export default async function SubServicePage({ params }: Props) {
  const { slug, sub } = await params;
  const [d, home, site] = await Promise.all([load(slug, sub), getSetting("home"), getSetting("site")]);
  if (!d) notFound();
  const { s, x } = d;
  const idx = s.subServices.findIndex((y) => y.id === x.id);
  const next = s.subServices[(idx + 1) % s.subServices.length];
  const label = `${s.title} › ${x.title}`;

  return (
    <>
      <PageHero
        kicker={s.title}
        title={x.title}
        text={x.summary}
        image={x.image || s.image}
        crumbs={[
          { href: "/services", label: "Services" },
          { href: `/services/${s.slug}`, label: s.title },
          { href: `/services/${s.slug}/${x.slug}`, label: x.title },
        ]}
      />

      <section className="section bg-ivory">
        <div className="container-x grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="kicker">About this service</p>
              <p className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">{x.description || x.summary}</p>
            </Reveal>
            {strList(x.features).length > 0 && (
              <div className="mt-12">
                <Reveal>
                  <h2 className="font-display text-2xl font-medium tracking-tight">What's included</h2>
                </Reveal>
                <div className="mt-6">
                  <CheckList items={strList(x.features)} />
                </div>
              </div>
            )}
            <Reveal className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[26px]">
              <Img src={x.image || s.image} alt={x.title} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal className="on-dark rounded-[26px] bg-forest-800 p-7 text-white sm:p-8">
              <p className="kicker">Free consultation</p>
              <h3 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight">Get a quote for {x.title}</h3>
              <p className="mt-3 text-[15px] text-white/60">Tell us your date and guest count — we'll send ideas and a clear, itemised price.</p>
              <div className="mt-7 space-y-2.5">
                <QuoteButton className="btn btn-gold w-full" preset={{ services: label, source: `sub:${x.slug}` }}>
                  Get my free quote <ArrowRight className="h-4 w-4" />
                </QuoteButton>
                <a href={waLink(site.whatsapp, `Hi Lynn Luxe! I'm interested in ${x.title} (${s.title}).`)} target="_blank" rel="noopener" className="btn btn-ghost-light w-full">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a href={telLink(site.phone)} className="flex items-center justify-center gap-2 py-2 text-sm text-white/70 hover:text-white">
                  <Phone className="h-4 w-4 text-gold-300" /> {site.phone}
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="mt-4 flex items-center justify-between gap-3 rounded-[22px] border border-ink/10 bg-white p-5">
              <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink">
                <ArrowLeft className="h-4 w-4" /> All {s.title}
              </Link>
              {next && next.id !== x.id && (
                <Link href={`/services/${s.slug}/${next.slug}`} className="inline-flex items-center gap-2 text-right text-sm font-semibold text-forest-800 hover:text-gold-700">
                  {next.title} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x">
          <SectionHead kicker={`More in ${s.title}`} title="Pair it with" />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.subServices
              .filter((y) => y.id !== x.id)
              .slice(0, 4)
              .map((y) => (
                <StaggerItem key={y.id}>
                  <Link href={`/services/${s.slug}/${y.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                      <Img src={y.image || s.image} alt={y.title} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                    </div>
                    <p className="mt-4 font-display text-lg font-medium">{y.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{y.summary}</p>
                  </Link>
                </StaggerItem>
              ))}
          </Stagger>
        </div>
      </section>

      <CtaBand cta={home.cta} site={site} preset={{ services: label }} />
    </>
  );
}
