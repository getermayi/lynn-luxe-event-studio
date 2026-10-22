import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, Marquee, PageHero } from "@/components/sections/sections";
import { Img } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/motion";
import { getEvents, getSetting } from "@/lib/content";
import { cn, strList } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Occasions We Plan",
  description: "Weddings, birthdays, anniversaries, corporate events, private events and destination celebrations across Arunachal Pradesh.",
};

export default async function EventsPage() {
  const [events, home, site] = await Promise.all([getEvents(), getSetting("home"), getSetting("site")]);
  return (
    <>
      <PageHero kicker={home.eventsSection.kicker} title={home.eventsSection.title} text={home.eventsSection.text} image="/images/stage-floral.jpg" crumbs={[{ href: "/events", label: "Occasions" }]} />
      <section className="border-b border-ink/10 bg-ivory text-forest-800">
        <Marquee items={home.marquee} />
      </section>

      {/* Alternating editorial rows */}
      <section className="bg-ivory py-16 sm:py-24">
        <div className="container-x space-y-20 sm:space-y-32">
          {events.map((e, i) => (
            <div key={e.id} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <Reveal className={cn("relative", i % 2 && "lg:order-2")}>
                <Link href={`/events/${e.slug}`} className="group relative z-10 block aspect-[5/4] overflow-hidden rounded-[30px]">
                  <Img src={e.image} alt={e.title} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-105" />
                </Link>
                <span className={cn("absolute -top-14 z-0 font-display sm:-top-24 text-[7rem] font-medium leading-none text-gold-400/40 sm:text-[10rem]", i % 2 ? "-right-2" : "-left-2")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="kicker">{e.tagline}</p>
                <h2 className="mt-5 font-display text-5xl font-medium tracking-tight sm:text-6xl">{e.title}</h2>
                <p className="lead mt-5">{e.summary}</p>
                <ul className="mt-7 space-y-2.5">
                  {strList(e.highlights).slice(0, 3).map((h) => (
                    <li key={h} className="flex items-center gap-3 text-[15px]"><span className="h-px w-6 bg-gold-500" /> {h}</li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href={`/events/${e.slug}`} className="btn btn-dark">Explore {e.title.toLowerCase()} <ArrowRight className="h-4 w-4" /></Link>
                  <Link href={`/inquire?event=${encodeURIComponent(e.title.replace(/ies$/, "y").replace(/s$/, ""))}`} className="btn btn-ghost text-forest-800">Inquire</Link>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      <CtaBand cta={home.cta} site={site} />
    </>
  );
}
