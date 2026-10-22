import type { Metadata } from "next";
import { CtaBand, PageHero, VenueShowcase } from "@/components/sections/sections";
import { getSetting, getVenues } from "@/lib/content";

export const metadata: Metadata = {
  title: "Venues & German Hangar",
  description: "Our open-air event venue at Papu Nallah, Naharlagun — 1000+ guests, 200+ parking — and pillarless, waterproof German Hangars for any location.",
};

export default async function VenuesPage() {
  const [venues, home, site] = await Promise.all([getVenues(), getSetting("home"), getSetting("site")]);
  return (
    <>
      <PageHero
        kicker={home.venueSection.kicker}
        title={home.venueSection.title}
        text={home.venueSection.text}
        image="/images/venue-wide.jpg"
        video="/video/venue-aerial.mp4"
        crumbs={[{ href: "/venues", label: "Venues" }]}
      />
      <section className="section bg-ivory">
        <div className="container-x">
          <VenueShowcase venues={venues} />
        </div>
      </section>
      <CtaBand cta={home.cta} site={site} />
    </>
  );
}
