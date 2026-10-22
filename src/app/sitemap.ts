import type { MetadataRoute } from "next";
import { getEvents, getPosts, getProjects, getServices, getVenues } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [services, events, venues, projects, posts] = await Promise.all([getServices(), getEvents(), getVenues(), getProjects(), getPosts()]);
  const paths = [
    "", "/services", "/events", "/portfolio", "/venues", "/gallery", "/journal", "/about", "/contact", "/faq", "/inquire",
    ...projects.map((p) => `/portfolio/${p.slug}`),
    ...posts.map((p) => `/journal/${p.slug}`),
    ...services.flatMap((s) => [`/services/${s.slug}`, ...s.subServices.map((x) => `/services/${s.slug}/${x.slug}`)]),
    ...events.map((e) => `/events/${e.slug}`),
    ...venues.map((v) => `/venues/${v.slug}`),
  ];
  return paths.map((p) => ({ url: base + p, lastModified: new Date(), priority: p === "" ? 1 : p.split("/").length > 2 ? 0.6 : 0.8 }));
}
