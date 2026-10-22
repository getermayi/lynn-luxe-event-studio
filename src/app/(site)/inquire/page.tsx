import { Phone } from "lucide-react";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/sections/explorer";
import { Reveal, SplitText } from "@/components/ui/motion";
import { getSetting } from "@/lib/content";
import { telLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Plan Your Event",
  description: "Tell us about your wedding, birthday or corporate event. We reply on WhatsApp, usually within a day, with a tailored concept and proposal.",
};

export default async function InquirePage({ searchParams }: { searchParams: Promise<{ service?: string; event?: string }> }) {
  const [{ service, event }, page, site] = await Promise.all([searchParams, getSetting("inquire"), getSetting("site")]);
  const services = service && !page.services.includes(service) ? [service, ...page.services] : page.services;

  return (
    <section className="relative min-h-svh bg-cream pb-24 pt-32 sm:pt-40">
      <div className="pointer-events-none absolute -left-40 top-20 h-[460px] w-[460px] rounded-full bg-gold-300/25 blur-[120px]" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <p className="kicker">{page.kicker}</p>
          </Reveal>
          <h1 className="h-display mt-6 text-[2.6rem] text-forest-900 sm:text-6xl">
            <SplitText text={page.title} immediate delay={0.1} />
          </h1>
          <Reveal delay={0.25}>
            <p className="lead mt-6">{page.text}</p>
          </Reveal>
          <Reveal delay={0.35} className="mt-10 rounded-[24px] bg-forest-800 p-7 text-white">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-300">{page.nextTitle}</p>
            <ol className="mt-6 space-y-5">
              {page.nextSteps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-400 font-mono text-sm text-forest-900">{i + 1}</span>
                  <span className="pt-1 text-[15px] leading-relaxed text-white/75">{s}</span>
                </li>
              ))}
            </ol>
            <a href={telLink(site.phone)} className="mt-8 flex items-center gap-2 border-t border-white/10 pt-6 text-sm text-white/70 hover:text-white">
              <Phone className="h-4 w-4 text-gold-300" /> Prefer to talk? {site.phone}
            </a>
          </Reveal>
        </aside>
        <Reveal delay={0.15}>
          <InquiryForm services={services} successTitle={page.successTitle} successText={page.successText} defaultService={service ?? ""} defaultEvent={event ?? ""} />
        </Reveal>
      </div>
    </section>
  );
}
