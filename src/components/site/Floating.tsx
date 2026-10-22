"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, telLink, waLink } from "@/lib/utils";
import { useSite, type QuotePreset } from "./SiteProvider";

export function QuoteButton({
  children,
  className,
  preset,
}: {
  children: React.ReactNode;
  className?: string;
  preset?: QuotePreset;
}) {
  const { openQuote } = useSite();
  return (
    <button type="button" onClick={() => openQuote(preset)} className={className}>
      {children}
    </button>
  );
}

function useScrolledPast(px: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const on = () => setPast(window.scrollY > px);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [px]);
  return past;
}

/** Desktop: floating WhatsApp button. Mobile: sticky Call · WhatsApp · Quote bar. */
export function FloatingActions() {
  const { site, openQuote } = useSite();
  const past = useScrolledPast(400);
  const [tip, setTip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTip(true), 9000);
    const h = setTimeout(() => setTip(false), 16000);
    return () => {
      clearTimeout(t);
      clearTimeout(h);
    };
  }, []);

  const wa = waLink(site.whatsapp, site.whatsappMessage);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[55] hidden items-center gap-3 md:flex">
        <AnimatePresence>
          {tip && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12 }}
              className="rounded-2xl rounded-br-sm bg-white px-4 py-3 text-sm text-ink shadow-xl ring-1 ring-black/5"
            >
              <p className="font-semibold">Planning something special? ✨</p>
              <p className="text-muted">Chat with our planner on WhatsApp.</p>
            </motion.div>
          )}
        </AnimatePresence>
        <a
          href={wa}
          target="_blank"
          rel="noopener"
          aria-label="Chat on WhatsApp"
          className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition hover:scale-105"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
          <MessageCircle className="relative h-6 w-6" />
        </a>
      </div>

      <motion.div
        initial={false}
        animate={{ y: past ? 0 : 110 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-[55] border-t border-white/10 bg-forest-900/95 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5 backdrop-blur-xl md:hidden"
      >
        <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-2">
          <a href={telLink(site.phone)} className={cn("flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium text-white/80 active:bg-white/5")}>
            <Phone className="h-5 w-5 text-gold-300" /> Call
          </a>
          <a href={wa} target="_blank" rel="noopener" className="flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium text-white/80 active:bg-white/5">
            <MessageCircle className="h-5 w-5 text-[#25D366]" /> WhatsApp
          </a>
          <button onClick={() => openQuote({ source: "mobile-bar" })} className="btn btn-gold !rounded-xl !py-0 text-sm">
            <Sparkles className="h-4 w-4" /> Free quote
          </button>
        </div>
      </motion.div>
    </>
  );
}
