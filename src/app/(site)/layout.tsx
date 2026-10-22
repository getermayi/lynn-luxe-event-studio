import { FloatingActions } from "@/components/site/Floating";
import { Footer } from "@/components/site/Footer";
import { Header, type NavData } from "@/components/site/Header";
import { LeadPopup } from "@/components/site/LeadPopup";
import { QuoteModal } from "@/components/site/QuoteModal";
import { SiteProvider } from "@/components/site/SiteProvider";
import { ScrollProgress } from "@/components/ui/motion";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { getEvents, getServices, getSetting, getVenues } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, quoteForm, popup, footer, services, events, venues] = await Promise.all([
    getSetting("site"),
    getSetting("quoteForm"),
    getSetting("popup"),
    getSetting("footer"),
    getServices(),
    getEvents(),
    getVenues(),
  ]);

  const nav: NavData = {
    services: services.map((s) => ({
      slug: s.slug,
      title: s.title,
      icon: s.icon,
      tagline: s.tagline,
      subs: s.subServices.map((x) => ({ slug: x.slug, title: x.title })),
    })),
    events: events.map((e) => ({ slug: e.slug, title: e.title })),
    venues: venues.map((v) => ({ slug: v.slug, title: v.title })),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventPlanner",
    name: site.name,
    slogan: site.tagline,
    telephone: site.phone,
    email: site.email || undefined,
    areaServed: site.serviceArea,
    address: { "@type": "PostalAddress", addressLocality: "Naharlagun", addressRegion: "Arunachal Pradesh", addressCountry: "IN" },
    sameAs: [site.instagram, site.facebook, site.youtube].filter(Boolean),
    image: site.seo.ogImage,
  };

  return (
    <SiteProvider site={site} quoteForm={quoteForm} popup={popup}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SmoothScroll />
      <ScrollProgress />
      <Header nav={nav} />
      <main>{children}</main>
      <Footer site={site} footer={footer} nav={nav} />
      <FloatingActions />
      <QuoteModal />
      <LeadPopup />
    </SiteProvider>
  );
}
