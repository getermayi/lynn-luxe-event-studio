"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn, telLink } from "@/lib/utils";
import { lockScroll, useSite } from "./SiteProvider";

export type NavData = {
  services: { slug: string; title: string; icon: string; tagline: string; subs: { slug: string; title: string }[] }[];
  events: { slug: string; title: string }[];
  venues: { slug: string; title: string }[];
};

const ease = [0.22, 1, 0.36, 1] as const;
const LIGHT_TOPS = [/^\/services\/?$/, /^\/services\/[^/]+\/?$/, /^\/portfolio\/?$/, /^\/about\/?$/, /^\/journal(\/.*)?$/, /^\/inquire\/?$/, /^\/faq\/?$/, /^\/credits\/?$/];

export function Header({ nav }: { nav: NavData }) {
  const { site, openQuote } = useSite();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<null | "services" | "events">(null);
  const [mobile, setMobile] = useState(false);
  const [bar, setBar] = useState(site.announcement.enabled);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setMenu(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    lockScroll(mobile);
  }, [mobile]);

  const links = [
    { href: "/services", label: "Services", menu: "services" as const },
    { href: "/events", label: "Occasions", menu: "events" as const },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/venues", label: "Venues" },
    { href: "/journal", label: "Journal" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  // Pages whose top section is light (cream) — header text turns dark until scrolled.
  const light = !scrolled && !menu && LIGHT_TOPS.some((r) => r.test(pathname));
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <AnimatePresence initial={false}>
        {bar && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="relative z-[61] overflow-hidden bg-gold-400 text-forest-900"
          >
            <div className="container-x flex items-center justify-center gap-3 py-2 pr-10 text-center text-[13px] font-medium">
              <span className="hidden h-1.5 w-1.5 animate-pulse rounded-full bg-forest-800 sm:block" />
              <span>{site.announcement.text}</span>
              <button onClick={() => openQuote({ source: "announcement" })} className="inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline">
                {site.announcement.linkLabel} <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button aria-label="Dismiss" onClick={() => setBar(false)} className="absolute right-3 rounded-full p-1 hover:bg-black/10">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        onMouseLeave={() => setMenu(null)}
        className={cn(
          "sticky top-0 z-[60] -mb-[76px] transition-all duration-500 ease-[var(--ease-luxe)] lg:-mb-[88px]",
          scrolled || menu ? "bg-forest-900/90 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className={cn("container-x flex items-center justify-between transition-all duration-500", scrolled ? "h-[68px] lg:h-[76px]" : "h-[76px] lg:h-[88px]")}>
          <Link href="/" aria-label={site.name} className="relative z-10 shrink-0">
            <img src={site.wordmark} alt={site.name} className={cn("w-auto transition-all duration-500", scrolled ? "h-8 lg:h-9" : "h-9 lg:h-11")} />
          </Link>

          <nav className="hidden items-center lg:flex">
            {links.map((l) => (
              <div key={l.href} onMouseEnter={() => setMenu(l.menu ?? null)}>
                <Link
                  href={l.href}
                  className={cn(
                    "group relative flex items-center gap-1 rounded-full px-3 py-2 text-[14.5px] font-medium transition xl:px-4",
                    active(l.href) ? (light ? "text-gold-700" : "text-gold-300") : light ? "text-ink/75 hover:text-ink" : "text-white/85 hover:text-white",
                  )}
                >
                  {l.label}
                  {l.menu && <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", menu === l.menu && "rotate-180")} />}
                  <span className={cn("absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gold-400 transition-transform duration-500", active(l.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")} />
                </Link>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={telLink(site.phone)} className={cn("hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition 2xl:flex", light ? "text-ink/75" : "text-white/85 hover:text-white")}>
              <Phone className="h-4 w-4 text-gold-300" /> {site.phone}
            </a>
            <Link href="/inquire" className={cn("btn hidden !py-2.5 sm:inline-flex", light ? "btn-dark" : "btn-gold")}>
              Plan your event
            </Link>
            <button onClick={() => setMobile(true)} aria-label="Open menu" className={cn("grid h-11 w-11 place-items-center rounded-full border lg:hidden", light ? "border-ink/15 text-ink" : "border-white/15 text-white")}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop mega menus */}
        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
              className="absolute inset-x-0 top-full hidden border-t border-white/10 bg-forest-900/95 backdrop-blur-xl lg:block"
            >
              <div className="container-x py-10">
                {menu === "services" ? (
                  <div className="grid grid-cols-[1fr_1fr_1fr_300px] gap-x-10 gap-y-9">
                    {nav.services.map((s) => (
                      <div key={s.slug}>
                        <Link href={`/services/${s.slug}`} className="group flex items-center gap-3 text-white">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-gold-300 ring-1 ring-white/10 transition group-hover:bg-gold-400 group-hover:text-forest-900">
                            <Icon name={s.icon} className="h-[18px] w-[18px]" />
                          </span>
                          <span className="font-display text-[17px] font-medium">{s.title}</span>
                        </Link>
                        <ul className="mt-3 space-y-1.5 pl-[52px]">
                          {s.subs.slice(0, 4).map((sub) => (
                            <li key={sub.slug}>
                              <Link href={`/services/${s.slug}/${sub.slug}`} className="text-[13.5px] text-white/55 transition hover:text-gold-200">
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                          {s.subs.length > 4 && (
                            <li>
                              <Link href={`/services/${s.slug}`} className="text-[13px] font-medium text-gold-300 hover:text-gold-200">
                                +{s.subs.length - 4} more →
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                    <MenuCta />
                  </div>
                ) : (
                  <div className="grid grid-cols-[1fr_300px] gap-10">
                    <div className="grid grid-cols-3 gap-3">
                      {nav.events.map((e) => (
                        <Link key={e.slug} href={`/events/${e.slug}`} className="group flex items-center justify-between rounded-2xl border border-white/10 px-5 py-5 text-white transition hover:border-gold-400/50 hover:bg-white/[0.04]">
                          <span className="font-display text-lg font-medium">{e.title}</span>
                          <ArrowUpRight className="h-4 w-4 text-gold-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      ))}
                    </div>
                    <MenuCta />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            data-lenis-prevent
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-[80] overflow-y-auto bg-forest-900 text-white lg:hidden"
          >
            <div className="container-x flex h-[76px] items-center justify-between">
              <img src={site.wordmark} alt={site.name} className="h-9" />
              <button onClick={() => setMobile(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full border border-white/15">
                <X className="h-5 w-5" />
              </button>
            </div>
            <MobileNav nav={nav} links={links} onQuote={() => setMobile(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MenuCta() {
  const { openQuote, site } = useSite();
  return (
    <div className="row-span-2 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-gold-400 to-gold-600 p-7 text-forest-900">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">Free consultation</p>
        <p className="mt-3 font-display text-2xl font-semibold leading-tight">Not sure what you need? Let's plan it together.</p>
      </div>
      <div className="mt-6 space-y-2">
        <button onClick={() => openQuote({ source: "mega-menu" })} className="btn btn-dark w-full">
          Get a free quote
        </button>
        <a href={telLink(site.phone)} className="flex items-center justify-center gap-2 py-2 text-sm font-semibold">
          <Phone className="h-4 w-4" /> {site.phone}
        </a>
      </div>
    </div>
  );
}

function MobileNav({
  nav,
  links,
  onQuote,
}: {
  nav: NavData;
  links: { href: string; label: string; menu?: "services" | "events" }[];
  onQuote: () => void;
}) {
  const { site } = useSite();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="container-x pb-32 pt-6">
      <ul>
        {links.map((l, i) => (
          <motion.li
            key={l.href}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease }}
            className="border-b border-white/10"
          >
            <div className="flex items-center justify-between">
              <Link href={l.href} className="block py-4 font-display text-[2rem] font-medium tracking-tight">
                {l.label}
              </Link>
              {l.menu && (
                <button aria-label={`Show ${l.label}`} onClick={() => setOpen(open === l.menu ? null : l.menu!)} className="grid h-11 w-11 place-items-center rounded-full bg-white/5">
                  <ChevronDown className={cn("h-5 w-5 transition", open === l.menu && "rotate-180")} />
                </button>
              )}
            </div>
            <AnimatePresence>
              {open === l.menu && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="space-y-1 pb-5">
                    {(l.menu === "services" ? nav.services : nav.events).map((s) => (
                      <Link key={s.slug} href={`/${l.menu}/${s.slug}`} className="flex items-center justify-between rounded-xl px-3 py-3 text-white/75 active:bg-white/5">
                        {s.title} <ArrowRight className="h-4 w-4 text-gold-300" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 space-y-3">
        <Link href="/inquire" onClick={onQuote} className="btn btn-gold w-full">
          Plan your event <ArrowRight className="h-4 w-4" />
        </Link>
        <a href={telLink(site.phone)} className="btn btn-ghost-light w-full">
          <Phone className="h-4 w-4" /> {site.phone}
        </a>
        <p className="pt-4 text-center text-sm text-white/45">{site.address}</p>
      </motion.div>
    </div>
  );
}
