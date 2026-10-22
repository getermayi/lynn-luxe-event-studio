import type { Metadata } from "next";
import Link from "next/link";
import { LightHero, PostCard } from "@/components/sections/editorial";
import { CtaBand } from "@/components/sections/sections";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { getPosts, getSetting } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Journal — Event Planning Ideas & Advice",
  description: "Wedding timelines, birthday ideas, venue advice and planning notes from Lynn Luxe Event Studio, Arunachal Pradesh.",
};

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const [{ c }, posts, page, home, site] = await Promise.all([searchParams, getPosts(), getSetting("journalPage"), getSetting("home"), getSetting("site")]);
  const cats = Array.from(new Set(posts.map((p) => p.category)));
  const list = c ? posts.filter((p) => p.category === c) : posts;
  const [lead, ...rest] = c ? [undefined, ...list] : [list.find((p) => p.featured) ?? list[0], ...list.filter((p) => p !== (list.find((x) => x.featured) ?? list[0]))];

  return (
    <>
      <LightHero kicker={page.kicker} title={page.title} text={page.text} crumbs={[{ href: "/journal", label: "Journal" }]}>
        <div className="mt-10 flex flex-wrap gap-2">
          <Link href="/journal" className={cn("chip", !c ? "border-forest-800 bg-forest-800 text-white" : "border-ink/15 text-ink/70 hover:border-ink/40")}>All</Link>
          {cats.map((x) => (
            <Link key={x} href={`/journal?c=${encodeURIComponent(x)}`} className={cn("chip", c === x ? "border-forest-800 bg-forest-800 text-white" : "border-ink/15 text-ink/70 hover:border-ink/40")}>{x}</Link>
          ))}
        </div>
      </LightHero>

      <section className="bg-ivory pb-24 pt-16 sm:pb-32">
        <div className="container-x">
          {lead && (
            <Reveal className="border-b border-ink/10 pb-16">
              <PostCard p={lead} wide />
            </Reveal>
          )}
          {rest.length > 0 && (
            <Stagger className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {rest.filter(Boolean).map((p) => (
                <StaggerItem key={p!.id}><PostCard p={p!} /></StaggerItem>
              ))}
            </Stagger>
          )}
          {list.length === 0 && <p className="text-muted">No articles in this category yet.</p>}
        </div>
      </section>

      <CtaBand cta={home.cta} site={site} />
    </>
  );
}
