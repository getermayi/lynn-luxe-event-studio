import type { Metadata } from "next";
import { GalleryGrid } from "@/components/sections/interactive";
import { CtaBand, PageHero } from "@/components/sections/sections";
import { getGallery, getSetting } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Wedding stages, floral décor, tablescapes, lighting and venues — a portfolio of looks by Lynn Luxe Event Studio.",
};

export default async function GalleryPage() {
  const [gallery, home, site] = await Promise.all([getGallery(), getSetting("home"), getSetting("site")]);
  return (
    <>
      <PageHero kicker={home.gallerySection.kicker} title={home.gallerySection.title} text={home.gallerySection.text} image="/images/decor-florals.jpg" crumbs={[{ href: "/gallery", label: "Gallery" }]} />
      <section className="section bg-ivory">
        <div className="container-x">
          <GalleryGrid items={gallery} />
        </div>
      </section>
      <CtaBand cta={home.cta} site={site} />
    </>
  );
}
