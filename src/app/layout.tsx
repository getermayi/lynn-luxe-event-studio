import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { getSetting } from "@/lib/content";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbmono", weight: ["400", "500"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSetting("site");
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(base),
    title: { default: site.seo.title, template: `%s · ${site.shortName}` },
    description: site.seo.description,
    applicationName: site.name,
    icons: { icon: "/brand/icon.png", apple: "/brand/icon.png" },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: site.seo.title,
      description: site.seo.description,
      images: [site.seo.ogImage],
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description, images: [site.seo.ogImage] },
  };
}

export const viewport: Viewport = { themeColor: "#002617", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
