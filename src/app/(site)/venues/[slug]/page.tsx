import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryGrid } from "@/components/sections/interactive";
import { CheckList, CtaBand, PageHero, SectionHead } from "@/components/sections/sections";
import { QuoteButton } from "@/components/site/Floating";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { db } from "@/lib/db";
import { getSetting } from "@/lib/content";
import { objList, strList, waLink } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };
const getVenue = (slug: string) => db.venue.findFirst({ where: { slug, published: true } });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = await getVenue((await params).slug);
  if (!v) return {};
  return { title: v.title, description: v.summary, openGraph: { images: [v.image] } };
}

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;
  const [v, home, site] = await Promise.all([getVenue(slug), getSetting("home"), getSetting("site")]);
  if (!v) notFound();
  const stats = objList<{ value: string; label: string }>(v.stats);
  const steps = objList<{ title: string; text: string }>(v.steps);
  const photos = strList(v.gallery).map((image, i) => ({ id: String(i), image, title: v.title, category: "" }));

  return (
    <>
      <PageHero kicker={v.kicker} title={v.title} text={v.tagline} image={v.image} video={v.video} tall crumbs={[{ href: "/venues", label: "Venues" }, { href: `/venues/${v.slug}`, label: v.title }]}>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <QuoteButton className="btn btn-gold !px-8 !py-4" preset={{ services: v.title, source: `venue:${v.slug}` }}>
            Check availability <ArrowRight className="h-4 w-4" />
          </QuoteButton>
          <a href={waLink(site.whatsapp, `Hi Lynn Luxe! I'd like to know more about ${v.title}.`)} target="_blank" rel="noopener" className="btn btn-ghost-light !px-8 !py-4">
            <MessageCircle className="h-5 w-5" /> Ask on WhatsApp
          </a>
        </div>
      </PageHero>

      {stats.length > 0 && (
        <section className="on-dark bg-forest-900 text-white">
          <Stagger className="container-x grid grid-cols-3 divide-x divide-white/10 py-10 sm:py-14">
            {stats.map((s) => (
              <StaggerItem key={s.label} className="px-3 text-center sm:px-6">
                <p className="gold-text font-display text-3xl font-medium sm:text-6xl">{s.value}</p>
                <p className="mt-2 text-xs text-white/55 sm:text-sm">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <section className="section bg-ivory">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="kicker">Overview</p>
            <p className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight sm:text-[2.1rem]">{v.description}</p>
            {v.location && (
              <p className="mt-8 flex items-start gap-3 text-muted">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" /> {v.location}
              </p>
            )}
            {v.mapUrl && (
              <a href={v.mapUrl} target="_blank" rel="noopener" className="btn btn-dark mt-6">
                Open in Google Maps <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </Reveal>
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-medium tracking-tight">Why it works</h2>
            </Reveal>
            <div className="mt-6">
              <CheckList items={strList(v.features)} />
            </div>
          </div>
        </div>
      </section>

      {steps.length > 0 && (
        <section className="on-dark section bg-forest-800 text-white">
          <div className="container-x">
            <SectionHead kicker="How it works" title="Here's how we build it." />
            <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((s, i) => (
                <StaggerItem key={s.title} className="relative rounded-[22px] bg-white/[0.04] p-6 ring-1 ring-white/10">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-400 font-mono text-sm font-medium text-forest-900">{i + 1}</span>
                  <h3 className="mt-6 font-display text-xl font-medium">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{s.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section className="section bg-cream">
          <div className="container-x">
            <SectionHead kicker="Gallery" title="Take a look around" />
            <div className="mt-12">
              <GalleryGrid items={photos} filters={false} />
            </div>
          </div>
        </section>
      )}

      <CtaBand cta={home.cta} site={site} preset={{ services: v.title }} />
    </>
  );
}
