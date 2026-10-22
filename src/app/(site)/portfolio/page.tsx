import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LightHero } from "@/components/sections/editorial";
import { PortfolioIndex } from "@/components/sections/explorer";
import { CtaBand, Marquee } from "@/components/sections/sections";
import { Img } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/motion";
import { getGallery, getProjects, getSetting } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio: Weddings, Birthdays & Corporate Events",
  description: "Recent weddings, private celebrations and corporate occasions by Lynn Luxe Event Studio — each designed from scratch around the people it was for.",
};

export default async function PortfolioPage() {
  const [projects, gallery, page, home, site] = await Promise.all([getProjects(), getGallery(), getSetting("portfolioPage"), getSetting("home"), getSetting("site")]);
  const occasions = Array.from(new Set(projects.map((p) => p.occasion)));

  return (
    <>
      <LightHero
        kicker={page.kicker}
        title={page.title}
        text={page.text}
        crumbs={[{ href: "/portfolio", label: "Portfolio" }]}
        aside={
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink/10">
            <div className="bg-cream p-5">
              <p className="font-display text-4xl font-medium text-forest-800">{projects.length}</p>
              <p className="text-sm text-muted">celebrations featured</p>
            </div>
            <div className="bg-cream p-5">
              <p className="font-display text-4xl font-medium text-forest-800">{occasions.length}</p>
              <p className="text-sm text-muted">types of occasion</p>
            </div>
          </div>
        }
      />

      <section className="bg-ivory pb-24 pt-16 sm:pb-32 sm:pt-20">
        <div className="container-x">
          <PortfolioIndex projects={projects} />
        </div>
      </section>

      <section className="border-y border-ink/10 bg-cream text-forest-800">
        <Marquee items={home.marquee} />
      </section>

      {gallery.length > 0 && (
        <section className="section bg-ivory">
          <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
            <Reveal>
              <p className="kicker">Moodboard</p>
              <h2 className="h-section mt-5">Looks, details & tablescapes.</h2>
              <p className="lead mt-5">Browse the full gallery of stages, florals, lighting and venues, filtered by style.</p>
              <Link href="/gallery" className="btn btn-dark mt-8">Open the gallery <ArrowRight className="h-4 w-4" /></Link>
            </Reveal>
            <Reveal delay={0.1} className="grid grid-cols-3 gap-3">
              {gallery.slice(0, 6).map((g, i) => (
                <div key={g.id} className={`relative overflow-hidden rounded-2xl ${i % 2 ? "aspect-[3/4] translate-y-6" : "aspect-[3/4]"}`}>
                  <Img src={g.image} alt={g.title} fill sizes="220px" className="object-cover" />
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <CtaBand cta={{ ...home.cta, title: "Planning your own celebration?" }} site={site} />
    </>
  );
}
