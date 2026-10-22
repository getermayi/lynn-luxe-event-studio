import { ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryGrid, LeadForm } from "@/components/sections/interactive";
import { CheckList, CtaBand, PageHero, SectionHead } from "@/components/sections/sections";
import { QuoteButton } from "@/components/site/Floating";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { db } from "@/lib/db";
import { getEvents, getGallery, getServices, getSetting } from "@/lib/content";
import { strList, waLink } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

const getEvent = (slug: string) => db.eventType.findFirst({ where: { slug, published: true } });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = await getEvent((await params).slug);
  if (!e) return {};
  return { title: `${e.title} Planning`, description: e.summary, openGraph: { images: [e.image] } };
}

const singular = (t: string) => (t.endsWith("s") ? t.slice(0, -1) : t);

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const [e, events, services, gallery, home, site] = await Promise.all([
    getEvent(slug),
    getEvents(),
    getServices(),
    getGallery(),
    getSetting("home"),
    getSetting("site"),
  ]);
  if (!e) notFound();
  const included = services.filter((s) => strList(e.included).includes(s.slug));
  const others = events.filter((x) => x.id !== e.id);
  const photos = gallery.filter((g) => g.category.toLowerCase().startsWith(singular(e.title).toLowerCase().slice(0, 5))).slice(0, 6);
  const eventType = singular(e.title);

  return (
    <>
      <PageHero kicker={e.tagline} title={`${e.title}, beautifully planned.`} text={e.summary} image={e.image} crumbs={[{ href: "/events", label: "Events" }, { href: `/events/${e.slug}`, label: e.title }]}>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <QuoteButton className="btn btn-gold !px-8 !py-4" preset={{ eventType, source: `event:${e.slug}` }}>
            Plan my {eventType.toLowerCase()} <ArrowRight className="h-4 w-4" />
          </QuoteButton>
          <a href={waLink(site.whatsapp, `Hi Lynn Luxe! I'm planning a ${eventType.toLowerCase()}.`)} target="_blank" rel="noopener" className="btn btn-ghost-light !px-8 !py-4">
            <MessageCircle className="h-5 w-5" /> WhatsApp us
          </a>
        </div>
      </PageHero>

      <section className="section bg-ivory">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="kicker">Your {eventType.toLowerCase()}</p>
            <p className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight sm:text-[2.1rem]">{e.description}</p>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-medium tracking-tight">What we take care of</h2>
            </Reveal>
            <div className="mt-6">
              <CheckList items={strList(e.highlights)} />
            </div>
          </div>
        </div>
      </section>

      {included.length > 0 && (
        <section className="section bg-cream">
          <div className="container-x">
            <SectionHead kicker="Services for this event" title={`Everything your ${eventType.toLowerCase()} needs`} />
            <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {included.map((s) => (
                <StaggerItem key={s.id}>
                  <Link href={`/services/${s.slug}`} className="group card-lift flex h-full gap-5 rounded-[22px] bg-white p-5 ring-1 ring-ink/5 hover:shadow-xl">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                      <Img src={s.image} alt="" fill sizes="96px" className="object-cover" />
                    </div>
                    <div>
                      <Icon name={s.icon} className="h-5 w-5 text-gold-600" />
                      <p className="mt-2 font-display text-lg font-medium">{s.title}</p>
                      <p className="mt-1 text-sm text-muted">{s.subServices.length} services →</p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section className="section bg-ivory">
          <div className="container-x">
            <SectionHead kicker="Inspiration" title="Looks we love" />
            <div className="mt-12">
              <GalleryGrid items={photos} filters={false} />
            </div>
          </div>
        </section>
      )}

      <section className="on-dark section bg-forest-900 text-white">
        <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <SectionHead kicker="Free consultation" title={`Let's plan your ${eventType.toLowerCase()}.`} text="Share a few details. We'll call you back with ideas and a clear, itemised quote." />
            <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[24px] lg:block">
              <Img src={e.image} alt="" fill sizes="40vw" className="object-cover" />
            </div>
          </div>
          <Reveal>
            <LeadForm dark source={`event-page:${e.slug}`} defaultEvent={eventType} />
          </Reveal>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x">
          <SectionHead kicker="More celebrations" title="Other events we create" />
          <Stagger className="mt-10 flex flex-wrap gap-3">
            {others.map((o) => (
              <StaggerItem key={o.id}>
                <Link href={`/events/${o.slug}`} className="chip border-ink/15 !px-5 !py-2.5 !text-[15px] hover:border-gold-500 hover:bg-white">
                  {o.title} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand cta={home.cta} site={site} preset={{ eventType }} />
    </>
  );
}
