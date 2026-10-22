"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.4 });
    lenis.current = l;
    (window as unknown as { lenis?: Lenis }).lenis = l;
    let id = requestAnimationFrame(function raf(t) {
      l.raf(t);
      id = requestAnimationFrame(raf);
    });
    // Anchor links glide instead of jump
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a || a.getAttribute("href") === "#") return;
      const el = document.querySelector(a.getAttribute("href")!);
      if (el) {
        e.preventDefault();
        l.scrollTo(el as HTMLElement, { offset: -90 });
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("click", onClick);
      l.destroy();
    };
  }, []);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
