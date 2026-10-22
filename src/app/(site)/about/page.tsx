import { ArrowRight, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, Stats } from "@/components/sections/sections";
import { Img } from "@/components/ui/Img";
import { Parallax, Reveal, SplitText, Stagger, StaggerItem } from "@/components/ui/motion";
import { getSetting } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Our Event Planning Studio",
  description: "Lynn Luxe is a design-led event studio based in Jollang, planning and styling celebrations of every scale across Arunachal Pradesh.",
};

export default async function AboutPage() {
  const [about, home, site] = await Promise.all([getSetting("about"), getSetting("home"), getSetting("site")]);
  return (
    <>
      {/* Editorial hero with collage */}
      <section className="relative overflow-hidden bg-cream pb-20 pt-36 sm:pt-44">
        <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Reveal><p className="kicker">{about.hero.kicker}</p></Reveal>
            <h1 className="h-display mt-6 text-[2.8rem] text-forest-900 sm:text-6xl lg:text-[5rem]">
              <SplitText text={about.hero.title} immediate delay={0.1} highlight="good look." />
            </h1>
            <Reveal delay={0.3}><p className="lead mt-7 max-w-xl">{about.hero.text}</p></Reveal>
            <Reveal delay={0.4} className="mt-9 flex items-center gap-4">
              <img src={site.monogram} alt="" className="h-14 w-auto" />
              <div className="text-sm">
                <p className="font-semibold">{site.name}</p>
                <p className="text-muted">{site.tagline}</p>
              </div>
            </Reveal>
          </div>
          <div className="relative h-[460px] sm:h-[560px]">
            <Reveal className="absolute right-0 top-0 h-[78%] w-[72%] overflow-hidden rounded-[30px]">
              <Img src={about.hero.image} alt="" fill priority sizes="40vw" className="object-cover" />
            </Reveal>
            <Reveal delay={0.2} className="absolute bottom-0 left-0 h-[52%] w-[50%] overflow-hidden rounded-[26px] ring-8 ring-cream">
              <Img src={about.philosophy.image} alt="" fill sizes="30vw" className="object-cover" />
            </Reveal>
            <Reveal delay={0.35} className="absolute bottom-10 right-4 rounded-2xl bg-forest-800 px-5 py-4 text-white shadow-2xl">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold-300"><MapPin className="h-3.5 w-3.5" /> Studio</p>
              <p className="mt-1 font-display text-lg">{site.address}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Philosophy manifesto */}
      <section className="on-dark section bg-forest-950 text-white">
        <div className="container-x">
          <Reveal><p className="kicker">{about.philosophy.kicker}</p></Reveal>
          <h2 className="mt-8 max-w-5xl font-display text-3xl font-medium leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            <SplitText text={about.philosophy.title} highlight="design, logistics hospitality." />
          </h2>
          <Reveal delay={0.2}><p className="lead mt-10 max-w-2xl">{about.philosophy.text}</p></Reveal>
        </div>
      </section>

      {/* Three pillars */}
      <section className="bg-forest-950 pb-24 sm:pb-32">
        <Stagger className="container-x grid gap-4 md:grid-cols-3">
          {about.pillars.map((p, i) => (
            <StaggerItem key={p.title} className="group relative h-[420px] overflow-hidden rounded-[26px]">
              <Img src={p.image} alt={p.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="font-mono text-xs text-gold-300">0{i + 1}</p>
                <h3 className="mt-2 font-display text-4xl font-medium">{p.title}</h3>
                <p className="mt-2 text-white/65">{p.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Values — numbered editorial list */}
      <section className="section bg-ivory">
        <div className="container-x grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal><p className="kicker">What we stand for</p></Reveal>
            <h2 className="h-section mt-5"><SplitText text="Three promises, every event." /></h2>
          </div>
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {about.values.map((v, i) => (
              <Reveal key={v.title} className="grid gap-4 py-10 sm:grid-cols-[90px_1fr]">
                <span className="font-display text-6xl font-medium text-gold-400">{i + 1}</span>
                <div>
                  <h3 className="font-display text-3xl font-medium tracking-tight">{v.title}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-muted">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers + areas */}
      <section className="section bg-cream">
        <div className="container-x">
          <Stats stats={home.stats} />
          <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
            <Parallax className="aspect-[16/11] rounded-[28px]" amount={40}>
              <Img src="/images/venue-wide.jpg" alt="Arunachal Pradesh landscape" fill sizes="50vw" className="object-cover" />
            </Parallax>
            <div>
              <Reveal><p className="kicker">Where we work</p></Reveal>
              <h2 className="h-section mt-5"><SplitText text="Statewide, from our studio in Jollang." /></h2>
              <Stagger className="mt-8 flex flex-wrap gap-2">
                {about.areas.map((a) => (
                  <StaggerItem key={a}><span className="chip border-ink/15 bg-white"><MapPin className="h-3.5 w-3.5 text-gold-600" /> {a}</span></StaggerItem>
                ))}
              </Stagger>
              <Reveal delay={0.2}>
                <Link href="/venues" className="btn btn-dark mt-10">See our venues <ArrowRight className="h-4 w-4" /></Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="section bg-ivory">
        <div className="container-x">
          <Reveal><p className="kicker">{home.process.kicker}</p></Reveal>
          <h2 className="h-section mt-5 max-w-3xl"><SplitText text={home.process.title} /></h2>
          <div className="relative mt-16 space-y-6 border-l border-gold-400/50 pl-8 sm:pl-12">
            {home.process.steps.map((s, i) => (
              <Reveal key={s.title} className="relative">
                <span className="absolute -left-[42px] top-1 grid h-5 w-5 place-items-center rounded-full bg-gold-400 ring-8 ring-ivory sm:-left-[58px]" />
                <p className="font-mono text-xs tracking-[0.2em] text-gold-700">STAGE {i + 1}</p>
                <h3 className="mt-2 font-display text-3xl font-medium">{s.title}</h3>
                <p className="mt-2 max-w-xl text-muted">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="on-dark bg-forest-900 py-24 text-center text-white sm:py-32">
        <img src={site.monogram} alt="" className="mx-auto h-16 w-auto" />
        <h2 className="h-display mx-auto mt-10 max-w-4xl px-5 text-5xl sm:text-7xl">
          <SplitText text={about.promise.title} highlight="Celebrate." />
        </h2>
        <Reveal delay={0.2}><p className="lead mx-auto mt-6 max-w-xl px-5">{about.promise.text}</p></Reveal>
      </section>

      <CtaBand cta={home.cta} site={site} />
    </>
  );
}
