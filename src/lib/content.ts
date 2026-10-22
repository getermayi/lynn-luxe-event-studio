import { cache } from "react";
import { db } from "./db";
import { defaultSettings, type SettingKey, type Settings } from "./defaults";
import { deepMerge } from "./utils";

export const getSetting = cache(async <K extends SettingKey>(key: K): Promise<Settings[K]> => {
  const row = await db.setting.findUnique({ where: { key } });
  return deepMerge(defaultSettings[key], row?.value);
});

export const getServices = cache(() =>
  db.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { subServices: { where: { published: true }, orderBy: { order: "asc" } } },
  }),
);

export const getService = cache((slug: string) =>
  db.service.findFirst({
    where: { slug, published: true },
    include: { subServices: { where: { published: true }, orderBy: { order: "asc" } } },
  }),
);

export const getEvents = cache(() =>
  db.eventType.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
);

export const getVenues = cache(() =>
  db.venue.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
);

export const getGallery = cache(() =>
  db.galleryItem.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
);

export const getTestimonials = cache(() =>
  db.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
);

export const getFaqs = cache(() =>
  db.faq.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
);

export type ServiceWithSubs = Awaited<ReturnType<typeof getServices>>[number];

export const getProjects = cache(() =>
  db.project.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
);

export const getProject = cache((slug: string) => db.project.findFirst({ where: { slug, published: true } }));

export const getPosts = cache(() =>
  db.post.findMany({ where: { published: true }, orderBy: [{ publishedAt: "desc" }, { order: "asc" }] }),
);

export const getPost = cache((slug: string) => db.post.findFirst({ where: { slug, published: true } }));

export type ProjectRow = Awaited<ReturnType<typeof getProjects>>[number];
export type PostRow = Awaited<ReturnType<typeof getPosts>>[number];
