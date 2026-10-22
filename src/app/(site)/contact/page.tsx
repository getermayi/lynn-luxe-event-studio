import { ArrowRight, ArrowUpRight, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqList, LeadForm } from "@/components/sections/interactive";
import { SectionHead } from "@/components/sections/sections";
import { Reveal, SplitText, Stagger, StaggerItem } from "@/components/ui/motion";
import { getFaqs, getSetting } from "@/lib/content";
import { telLink, waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Call, WhatsApp or message Lynn Luxe Event Studio in Jollang, Arunachal Pradesh. We usually reply within a day.",
};

export default async function ContactPage() {
  const [contact, site, faqs] = await Promise.all([getSetting("contact"), getSetting("site"), getFaqs()]);
  const channels = [
    { icon: Phone, label: "Call", value: site.phone, note: contact.channels.call, href: telLink(site.phone) },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", note: contact.channels.whatsapp, href: waLink(site.whatsapp, site.whatsappMessage) },
    site.instagram ? { icon: Instagram, label: "Instagram", value: site.instagramHandle, note: contact.channels.instagram, href: site.instagram } : null,
    site.email ? { icon: Mail, label: "Email", value: site.email, note: "We reply within working hours.", href: `mailto:${site.email}` } : null,
    { icon: MapPin, label: "Studio", value: site.address, note: contact.channels.studio, href: "" },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; note: string; href: string }[];

  return (
    <>
      <section className="grain relative overflow-hidden bg-forest-900 pt-32 text-white sm:pt-40">
        <div className="pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-gold-400/15 blur-[130px]" />
        <div className="container-x relative grid gap-14 pb-20 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:pb-28">
          <div className="on-dark">
            <Reveal><p className="kicker">{contact.hero.kicker}</p></Reveal>
            <h1 className="h-display mt-6 text-6xl sm:text-7xl lg:text-[6.5rem]">
              <SplitText text={contact.hero.title} immediate delay={0.1} highlight="planning." />
            </h1>
            <Reveal delay={0.3}><p className="lead mt-7 max-w-lg">{contact.hero.text}</p></Reveal>

            <Stagger className="mt-12 divide-y divide-white/10 border-y border-white/10">
              {channels.map((c) => {
                const Inner = (
                  <>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/[0.06] text-gold-300 ring-1 ring-white/10 transition group-hover:bg-gold-400 group-hover:text-forest-900">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{c.label}</span>
                      <span className="mt-0.5 block font-display text-xl font-medium sm:text-2xl">{c.value}</span>
                      <span className="block text-sm text-white/50">{c.note}</span>
                    </span>
                    {c.href && <ArrowUpRight className="h-5 w-5 text-white/30 transition group-hover:text-gold-300" />}
                  </>
                );
                return (
                  <StaggerItem key={c.label}>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="group flex items-center gap-5 py-5">{Inner}</a>
                    ) : (
                      <div className="group flex items-center gap-5 py-5">{Inner}</div>
                    )}
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>

          <Reveal delay={0.2} className="h-fit rounded-[30px] bg-ivory p-6 text-ink sm:p-10 lg:mt-24">
            <h2 className="font-display text-3xl font-medium tracking-tight">{contact.formTitle}</h2>
            <p className="mt-2 text-muted">
              {contact.formText}{" "}
              <Link href="/inquire" className="font-semibold text-gold-700 underline-offset-4 hover:underline">Full inquiry form →</Link>
            </p>
            <div className="mt-8">
              <LeadForm source="contact-page" />
            </div>
          </Reveal>
        </div>
      </section>

      {site.mapEmbedUrl && (
        <section className="relative h-[420px] bg-sand">
          <iframe src={site.mapEmbedUrl} title="Map" loading="lazy" className="h-full w-full grayscale-[0.5]" referrerPolicy="no-referrer-when-downgrade" />
          <div className="absolute left-5 top-5 max-w-xs rounded-2xl bg-white p-5 shadow-2xl sm:left-10 sm:top-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-700">Our venue</p>
            <p className="mt-1 font-display text-lg font-medium">Open-Air Venue, Papu Nallah</p>
            <p className="mt-1 text-sm text-muted">Naharlagun — 1000+ guests, 200+ parking.</p>
            <Link href="/venues/open-air-venue-papu-nallah" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800">View venue <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="section bg-ivory">
          <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionHead kicker="Before you ask" title="Quick answers." />
              <Link href="/faq" className="mt-8 inline-flex items-center gap-2 font-semibold text-gold-700">All FAQs <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <FaqList items={faqs.slice(0, 5)} />
          </div>
        </section>
      )}
    </>
  );
}
