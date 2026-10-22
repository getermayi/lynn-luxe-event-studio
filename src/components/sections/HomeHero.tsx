"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSite } from "@/components/site/SiteProvider";
import { Img } from "@/components/ui/Img";
import { SplitText } from "@/components/ui/motion";
import type { Settings } from "@/lib/defaults";

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeHero({ hero }: { hero: Settings["home"]["hero"] }) {
  const { openQuote } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const images = hero.images.length ? hero.images : ["/images/hook-chandelier.jpg"];
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % images.length), 6500);
    return () => clearInterval(t);
  }, [images.length]);

  const lines = hero.titleLines;
  let delay = 0.2;

  return (
    <section ref={ref} className="on-dark grain relative flex min-h-[100svh] items-end overflow-hidden bg-forest-950 text-white">
      <motion.div style={{ y }} className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6, ease: "easeInOut" }, scale: { duration: 8, ease: "linear" } }}
          >
            <Img src={images[slide]} alt="" fill priority={slide === 0} sizes="100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/50 to-forest-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(0,20,12,0.85),transparent_60%)]" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="container-x relative z-[2] pb-16 pt-40 sm:pb-20 lg:pb-24">
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="kicker">
          {hero.kicker}
        </motion.p>

        <h1 className="h-display mt-6 text-[2.75rem] sm:text-7xl lg:text-[6.4rem]">
          {lines.map((line, i) => {
            const d = delay;
            delay += line.split(" ").length * 0.06 + 0.05;
            const last = i === lines.length - 1;
            return (
              <span key={i} className="block">
                <SplitText text={line} immediate delay={d} highlight={last ? line : undefined} className={!last && i === 1 ? "text-white/55" : undefined} />
              </span>
            );
          })}
        </h1>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: delay + 0.1, ease }} className="lead max-w-xl">
            {hero.subtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: delay + 0.25, ease }} className="flex flex-col gap-3 sm:flex-row">
            <button onClick={() => openQuote({ source: "hero" })} className="btn btn-gold !px-8 !py-4 text-base">
              {hero.primaryCta} <ArrowRight className="h-4 w-4" />
            </button>
            <Link href="/portfolio" className="btn btn-ghost-light !px-8 !py-4 text-base">
              {hero.secondaryCta}
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: delay + 0.5 }} className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {hero.chips.map((c) => (
              <button key={c} onClick={() => openQuote({ eventType: c === "Corporate" ? "Corporate Event" : c === "Private" ? "Private Event" : c === "Destination" ? "Destination Event" : c.replace(/s$/, ""), source: "hero-chip" })} className="chip shrink-0 border-white/15 text-white/75 hover:border-gold-400 hover:text-gold-200">
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-white/45">{hero.note}</p>
            <a href="#intro" aria-label="Scroll down" className="hidden h-11 w-11 shrink-0 animate-float place-items-center rounded-full border border-white/20 sm:grid">
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {images.length > 1 && (
          <div className="absolute bottom-6 right-5 hidden gap-1.5 lg:right-12 xl:flex">
            {images.map((_, i) => (
              <span key={i} className="relative h-[2px] w-10 overflow-hidden bg-white/20">
                {i === slide && <motion.span className="absolute inset-0 origin-left bg-gold-400" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 6.5, ease: "linear" }} />}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
