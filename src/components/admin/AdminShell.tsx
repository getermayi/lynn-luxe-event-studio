"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen, CalendarHeart, Gem, KeyRound, ExternalLink, FileText, HelpCircle, Image as ImageIcon, Images, Inbox, LayoutDashboard,
  LogOut, MapPin, Menu, MessageSquareQuote, Sparkles, X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ToastProvider } from "./ui";

const groups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/leads", label: "Leads", icon: Inbox },
    ],
  },
  {
    label: "Website content",
    items: [
      { href: "/admin/content", label: "Pages & settings", icon: FileText },
      { href: "/admin/services", label: "Services", icon: Sparkles },
      { href: "/admin/events", label: "Event types", icon: CalendarHeart },
      { href: "/admin/projects", label: "Portfolio", icon: Gem },
      { href: "/admin/posts", label: "Journal", icon: BookOpen },
      { href: "/admin/venues", label: "Venues", icon: MapPin },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
      { href: "/admin/media", label: "Media library", icon: ImageIcon },
    ],
  },
  {
    label: "Settings",
    items: [{ href: "/admin/account", label: "Account & backup", icon: KeyRound }],
  },
];

export function AdminShell({ children, newLeads }: { children: React.ReactNode; newLeads: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  const nav = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-3 px-3 py-2">
        <img src="/brand/monogram.png" alt="" className="h-9" />
        <span>
          <span className="block font-display text-[15px] font-semibold text-white">Lynn Luxe</span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-gold-300">Admin</span>
        </span>
      </Link>
      <nav className="mt-8 flex-1 space-y-7 overflow-y-auto">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">{g.label}</p>
            <div className="mt-2 space-y-0.5">
              {g.items.map((it) => {
                const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition",
                      active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <it.icon className={cn("h-[18px] w-[18px]", active && "text-gold-300")} />
                    {it.label}
                    {it.href === "/admin/leads" && newLeads > 0 && (
                      <span className="ml-auto rounded-full bg-gold-400 px-2 py-0.5 text-[11px] font-bold text-forest-900">{newLeads}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-6 space-y-1 border-t border-white/10 pt-4">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-white/60 hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-[18px] w-[18px]" /> View website
        </a>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-white/60 hover:bg-white/5 hover:text-white">
          <LogOut className="h-[18px] w-[18px]" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-svh bg-[#f6f3ed] text-ink">
        <aside className="fixed inset-y-0 left-0 hidden w-64 bg-forest-900 p-4 lg:block">{nav}</aside>

        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink/10 bg-white/90 px-4 backdrop-blur lg:hidden">
          <Link href="/admin" className="flex items-center gap-2 font-display font-semibold">
            <img src="/brand/monogram.png" alt="" className="h-8 rounded bg-forest-900 p-1" /> Lynn Luxe Admin
          </Link>
          <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-xl border border-ink/10">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button aria-label="Close" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40" />
              <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="absolute inset-y-0 left-0 w-72 bg-forest-900 p-4">
                <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-4 rounded-lg p-2 text-white/60">
                  <X className="h-5 w-5" />
                </button>
                {nav}
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="px-4 py-8 sm:px-8 lg:ml-64 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
