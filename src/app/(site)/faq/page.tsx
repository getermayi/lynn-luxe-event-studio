import { MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { LightHero } from "@/components/sections/editorial";
import { FaqSearch } from "@/components/sections/explorer";
import { getFaqs, getSetting } from "@/lib/content";
import { telLink, waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Booking, budgets, services, venues and German Hangars — answers to common questions about planning an event with Lynn Luxe.",
};

export default async function FaqPage() {
  const [faqs, page, site] = await Promise.all([getFaqs(), getSetting("faqPage"), getSetting("site")]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LightHero
        kicker={page.kicker}
        title={page.title}
        text={page.text}
        crumbs={[{ href: "/faq", label: "FAQ" }]}
        aside={
          <div className="space-y-2">
            <a href={telLink(site.phone)} className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink/5 transition hover:ring-gold-400">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest-800 text-gold-300"><Phone className="h-5 w-5" /></span>
              <span><span className="block text-xs text-muted">Call a planner</span><span className="font-semibold">{site.phone}</span></span>
            </a>
            <a href={waLink(site.whatsapp, site.whatsappMessage)} target="_blank" rel="noopener" className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink/5 transition hover:ring-gold-400">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#25D366] text-white"><MessageCircle className="h-5 w-5" /></span>
              <span><span className="block text-xs text-muted">Fastest reply</span><span className="font-semibold">WhatsApp us</span></span>
            </a>
          </div>
        }
      />
      <section className="bg-ivory py-16 sm:py-24">
        <div className="container-x">
          <FaqSearch items={faqs} />
        </div>
      </section>
    </>
  );
}
