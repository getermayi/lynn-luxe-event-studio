"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Settings } from "@/lib/defaults";

export type QuotePreset = { eventType?: string; services?: string; source?: string };

type Ctx = {
  site: Settings["site"];
  quoteForm: Settings["quoteForm"];
  popup: Settings["popup"];
  quote: QuotePreset | null;
  openQuote: (preset?: QuotePreset) => void;
  closeQuote: () => void;
};

const SiteCtx = createContext<Ctx | null>(null);

export function SiteProvider({
  children,
  site,
  quoteForm,
  popup,
}: {
  children: ReactNode;
  site: Settings["site"];
  quoteForm: Settings["quoteForm"];
  popup: Settings["popup"];
}) {
  const [quote, setQuote] = useState<QuotePreset | null>(null);
  const openQuote = useCallback((preset: QuotePreset = {}) => setQuote(preset), []);
  const closeQuote = useCallback(() => setQuote(null), []);
  return (
    <SiteCtx.Provider value={{ site, quoteForm, popup, quote, openQuote, closeQuote }}>{children}</SiteCtx.Provider>
  );
}

export function useSite() {
  const c = useContext(SiteCtx);
  if (!c) throw new Error("useSite must be used inside SiteProvider");
  return c;
}

/** Pause smooth scrolling while a modal is open. */
export function lockScroll(lock: boolean) {
  const l = (window as unknown as { lenis?: { stop(): void; start(): void } }).lenis;
  if (lock) l?.stop();
  else l?.start();
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

export async function submitLead(data: Record<string, string>) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, page: window.location.pathname }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Could not send — please try WhatsApp.");
  try {
    localStorage.setItem("ll_lead", String(Date.now()));
  } catch {}
  return json;
}
