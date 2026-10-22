"use client";

import { animate, motion, useInView, useMotionValue, useScroll, useTransform, type Variants } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </M>
  );
}

const parent: Variants = { show: { transition: { staggerChildren: 0.08 } } };
const child: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={child}>
      {children}
    </motion.div>
  );
}

/** Word-by-word masked reveal for headlines. */
export function SplitText({
  text,
  className,
  delay = 0,
  highlight,
  immediate = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  highlight?: string;
  immediate?: boolean;
}) {
  const words = text.split(" ");
  const hl = new Set((highlight ?? "").toLowerCase().split(" ").filter(Boolean));
  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true } };
  return (
    <motion.span
      className={className}
      initial="hidden"
      {...trigger}
      variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className={`inline-block ${hl.has(w.toLowerCase().replace(/[^\w]/g, "")) || hl.has(w.toLowerCase()) ? "gold-text" : ""}`}
            variants={{
              hidden: { y: "110%", rotate: 4 },
              show: { y: "0%", rotate: 0, transition: { duration: 1, ease } },
            }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function Counter({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration: to > 100 ? 2.2 : 1.4, ease });
    const unsub = mv.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("en-IN") + suffix;
    });
    return () => {
      c.stop();
      unsub();
    };
  }, [inView, to, suffix, mv]);
  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

/** Gentle parallax on scroll for images. */
export function Parallax({ children, className, amount = 60 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y }} className="absolute inset-[-80px_0]">
        {children}
      </motion.div>
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-500"
    />
  );
}
