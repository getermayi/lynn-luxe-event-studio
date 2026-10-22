import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, PostCard, Prose, readTime } from "@/components/sections/editorial";
import { Img } from "@/components/ui/Img";
import { Reveal, SplitText } from "@/components/ui/motion";
import { getPost, getPosts, getSetting } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, openGraph: { type: "article", images: [p.cover] } };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [p, posts, site] = await Promise.all([getPost(slug), getPosts(), getSetting("site")]);
  if (!p) notFound();
  const more = posts.filter((x) => x.id !== p.id).slice(0, 3);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    image: p.cover,
    datePublished: p.publishedAt,
    author: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="bg-cream pt-32 sm:pt-40">
        <header className="container-x max-w-4xl text-center">
          <Reveal>
            <Link href={`/journal?c=${encodeURIComponent(p.category)}`} className="kicker justify-center">{p.category}</Link>
          </Reveal>
          <h1 className="h-display mt-6 text-[2.4rem] text-forest-900 sm:text-6xl">
            <SplitText text={p.title} immediate delay={0.1} />
          </h1>
          <Reveal delay={0.3}>
            <p className="mt-6 text-sm text-muted">
              {p.author} · {formatDate(p.publishedAt)} · {readTime(p.body)} min read
            </p>
          </Reveal>
        </header>
        <Reveal delay={0.2} className="container-x mt-12 max-w-6xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[28px]">
            <Img src={p.cover} alt={p.title} fill priority sizes="(min-width:1280px) 1100px, 100vw" className="object-cover" />
          </div>
        </Reveal>

        <div className="container-x grid max-w-6xl gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_260px]">
          <div className="max-w-2xl">
            <p className="mb-10 font-display text-2xl font-medium leading-snug tracking-tight text-forest-800">{p.excerpt}</p>
            <Prose body={p.body} />
          </div>
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="on-dark rounded-[22px] bg-forest-800 p-6 text-white">
              <p className="font-display text-xl font-medium leading-tight">Planning something like this?</p>
              <p className="mt-2 text-sm text-white/60">We reply on WhatsApp, usually within a day.</p>
              <Link href="/inquire" className="btn btn-gold mt-5 w-full">Start an inquiry</Link>
            </div>
            <a href={`https://wa.me/?text=${encodeURIComponent(`${p.title} — ${base}/journal/${p.slug}`)}`} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 rounded-[18px] bg-white p-4 text-sm font-semibold ring-1 ring-ink/8 hover:ring-ink/20">
              <MessageCircle className="h-4 w-4 text-[#25D366]" /> Share on WhatsApp
            </a>
            <Link href="/journal" className="flex items-center justify-center gap-2 p-2 text-sm text-muted hover:text-ink">
              <ArrowLeft className="h-4 w-4" /> All articles
            </Link>
          </aside>
        </div>
      </article>

      {more.length > 0 && (
        <section className="bg-ivory py-20 sm:py-28">
          <div className="container-x">
            <div className="flex items-end justify-between">
              <h2 className="h-section">Keep reading.</h2>
              <Link href="/journal" className="hidden items-center gap-2 font-semibold text-forest-800 sm:flex">Journal <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((x) => <PostCard key={x.id} p={x} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
