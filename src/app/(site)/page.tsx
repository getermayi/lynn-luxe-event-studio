import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PostCard, ProjectCard } from "@/components/sections/editorial";
import { HomeHero } from "@/components/sections/HomeHero";
import { FaqList, Testimonials } from "@/components/sections/interactive";
import { CtaBand, EventRail, Marquee, Process, SectionHead, ServiceGrid, SplitFeature, Stats, VenueShowcase } from "@/components/sections/sections";
import { Img } from "@/components/ui/Img";
import { Reveal, SplitText } from "@/components/ui/motion";
import { getEvents, getFaqs, getPosts, getProjects, getServices, getSetting, getTestimonials, getVenues } from "@/lib/content";
import { strList } from "@/lib/utils";

export default async function HomePage() {
  const [home, site, services, events, venues, projects, posts, testimonials, faqs] = await Promise.all([
    getSetting("home"),
    getSetting("site"),
    getServices(),
    getEvents(),
    getVenues(),
    getProjects(),
    getPosts(),
    getTestimonials(),
    getFaqs(),
  ]);
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const recent = projects.filter((p) => p.id !== featured?.id).slice(0, 2);

  return (
    <>
      <HomeHero hero={home.hero} />

      <section className="border-b border-ink/10 bg-ivory text-forest-800">
        <Marquee items={home.marquee} />
      </section>

      <section id="intro" className="section bg-ivory">
        <div className="container-x">
          <SplitFeature kicker={home.intro.kicker} title={home.intro.title} text={home.intro.text} image={home.intro.image} points={home.intro.points}>
            <Link href="/about" className="btn btn-dark">
              More about us <ArrowRight className="h-4 w-4" />
            </Link>
          </SplitFeature>
          <div className="mt-20 sm:mt-28">
            <Stats stats={home.stats} />
          </div>
        </div>
      </section>

      {/* Featured celebration — full-bleed case study teaser */}
      {featured && (
        <section className="on-dark relative overflow-hidden bg-forest-950 text-white">
          <div className="grid lg:grid-cols-[1.25fr_1fr]">
            <Link href={`/portfolio/${featured.slug}`} className="group relative block min-h-[420px] overflow-hidden lg:min-h-[640px]">
              <Img src={featured.cover} alt={featured.title} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover transition-transform duration-[1.8s] ease-[var(--ease-luxe)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-forest-950/60" />
            </Link>
            <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-20">
              <Reveal><p className="kicker">{home.featuredSection.kicker}</p></Reveal>
              <h2 className="h-display mt-6 text-5xl sm:text-7xl"><SplitText text={featured.title} /></h2>
              <Reveal delay={0.15}>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-white/50">{[featured.occasion, featured.location, featured.year].filter(Boolean).join(" · ")}</p>
                <p className="lead mt-6">{featured.summary}</p>
              </Reveal>
              {strList(featured.palette).length > 0 && (
                <Reveal delay={0.2} className="mt-8 flex gap-2">
                  {strList(featured.palette).map((c) => <span key={c} className="h-9 w-9 rounded-full ring-2 ring-white/15" style={{ background: c }} />)}
                </Reveal>
              )}
              <Reveal delay={0.25}>
                <Link href={`/portfolio/${featured.slug}`} className="btn btn-gold mt-10">{home.featuredSection.cta} <ArrowRight className="h-4 w-4" /></Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <section className="section bg-cream">
        <div className="container-x">
          <SectionHead
            kicker={home.servicesSection.kicker}
            title={home.servicesSection.title}
            text={home.servicesSection.text}
            action={<Link href="/services" className="btn btn-ghost text-forest-800">Explore services <ArrowRight className="h-4 w-4" /></Link>}
          />
          <div className="mt-14">
            <ServiceGrid services={services} />
          </div>
        </div>
      </section>

      <Process data={home.process} />

      {recent.length > 0 && (
        <section className="section bg-ivory">
          <div className="container-x">
            <SectionHead
              kicker={home.portfolioSection.kicker}
              title={home.portfolioSection.title}
              text={home.portfolioSection.text}
              action={<Link href="/portfolio" className="btn btn-ghost text-forest-800">See the full portfolio <ArrowUpRight className="h-4 w-4" /></Link>}
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {recent.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1}><ProjectCard p={p} index={i + 1} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-cream">
        <div className="container-x">
          <SectionHead
            kicker={home.eventsSection.kicker}
            title={home.eventsSection.title}
            text={home.eventsSection.text}
            action={<Link href="/events" className="btn btn-ghost text-forest-800">All occasions <ArrowRight className="h-4 w-4" /></Link>}
          />
          <div className="mt-14">
            <EventRail events={events} />
          </div>
        </div>
      </section>

      {venues.length > 0 && (
        <section className="section bg-ivory">
          <div className="container-x">
            <SectionHead kicker={home.venueSection.kicker} title={home.venueSection.title} text={home.venueSection.text} />
            <div className="mt-14">
              <VenueShowcase venues={venues} />
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section bg-cream">
          <div className="container-x">
            <SectionHead kicker={home.testimonialsSection.kicker} title={home.testimonialsSection.title} center />
            <div className="mt-12"><Testimonials items={testimonials} /></div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="section bg-cream">
          <div className="container-x">
            <SectionHead
              kicker={home.journalSection.kicker}
              title={home.journalSection.title}
              action={<Link href="/journal" className="btn btn-ghost text-forest-800">Read the journal <ArrowRight className="h-4 w-4" /></Link>}
            />
            <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((p) => <Reveal key={p.id}><PostCard p={p} /></Reveal>)}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="section bg-ivory">
          <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionHead kicker={home.faqSection.kicker} title={home.faqSection.title} text={home.faqSection.text} />
              <Link href="/faq" className="mt-8 inline-flex items-center gap-2 font-semibold text-gold-700 hover:text-forest-800">See all questions <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <FaqList items={faqs.slice(0, 5)} />
          </div>
        </section>
      )}

      <CtaBand cta={home.cta} site={site} />
    </>
  );
}
