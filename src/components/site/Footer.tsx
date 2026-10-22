import { ArrowRight, Instagram, MapPin, MessageCircle, Phone, Mail, Facebook, Youtube } from "lucide-react";
import Link from "next/link";
import type { Settings } from "@/lib/defaults";
import { telLink, waLink } from "@/lib/utils";
import { QuoteButton } from "./Floating";
import type { NavData } from "./Header";

export function Footer({ site, footer, nav }: { site: Settings["site"]; footer: Settings["footer"]; nav: NavData }) {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark grain relative overflow-hidden bg-forest-950 pb-28 text-white md:pb-10">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-gold-400/10 blur-[120px]" />
      <div className="container-x relative">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/10 py-16 sm:py-20 lg:flex-row lg:items-end">
          <h2 className="max-w-3xl font-display text-4xl font-medium leading-[1.02] tracking-[-0.03em] sm:text-6xl">{footer.ctaTitle}</h2>
          <QuoteButton className="btn btn-gold shrink-0 !px-8 !py-4 text-base" preset={{ source: "footer" }}>
            Plan my event <ArrowRight className="h-4 w-4" />
          </QuoteButton>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <img src={site.logo} alt={site.name} className="w-44" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/55">{footer.blurb}</p>
            <div className="mt-6 flex gap-2">
              {site.instagram && <Social href={site.instagram} label="Instagram"><Instagram className="h-4 w-4" /></Social>}
              {site.facebook && <Social href={site.facebook} label="Facebook"><Facebook className="h-4 w-4" /></Social>}
              {site.youtube && <Social href={site.youtube} label="YouTube"><Youtube className="h-4 w-4" /></Social>}
              <Social href={waLink(site.whatsapp, site.whatsappMessage)} label="WhatsApp"><MessageCircle className="h-4 w-4" /></Social>
            </div>
          </div>

          <Col title="Services">
            {nav.services.map((s) => (
              <FLink key={s.slug} href={`/services/${s.slug}`}>{s.title}</FLink>
            ))}
          </Col>

          <Col title="Explore">
            {nav.events.slice(0, 3).map((e) => (
              <FLink key={e.slug} href={`/events/${e.slug}`}>{e.title}</FLink>
            ))}
            <FLink href="/portfolio">Portfolio</FLink>
            <FLink href="/venues">Venues</FLink>
            <FLink href="/gallery">Gallery</FLink>
            <FLink href="/journal">Journal</FLink>
            <FLink href="/about">About us</FLink>
            <FLink href="/faq">FAQ</FLink>
            <FLink href="/inquire">Plan your event</FLink>
          </Col>

          <Col title="Get in touch">
            <a href={telLink(site.phone)} className="flex items-start gap-3 text-white/75 transition hover:text-gold-200">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /> {site.phone}
            </a>
            {site.email && (
              <a href={`mailto:${site.email}`} className="flex items-start gap-3 text-white/75 transition hover:text-gold-200">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /> {site.email}
              </a>
            )}
            {site.instagram && (
              <a href={site.instagram} target="_blank" rel="noopener" className="flex items-start gap-3 text-white/75 transition hover:text-gold-200">
                <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /> {site.instagramHandle}
              </a>
            )}
            <p className="flex items-start gap-3 text-white/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /> {site.address}
            </p>
          </Col>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. {site.tagline}.</p>
          <div className="flex gap-5">
            <Link href="/credits" className="hover:text-white/70">Photo credits</Link>
            <Link href="/contact" className="hover:text-white/70">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-300">{title}</p>
      <div className="mt-5 flex flex-col gap-3 text-[15px]">{children}</div>
    </div>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="w-fit text-white/65 transition hover:translate-x-1 hover:text-gold-200">
      {children}
    </Link>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-gold-400 hover:bg-gold-400 hover:text-forest-900">
      {children}
    </a>
  );
}
