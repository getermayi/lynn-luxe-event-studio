import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Reveal, SplitText } from "@/components/ui/motion";
import type { PostRow, ProjectRow } from "@/lib/content";
import { cn } from "@/lib/utils";

/* ---------- Light (cream) editorial page header ---------- */
export function LightHero({
  kicker,
  title,
  text,
  crumbs = [],
  aside,
  children,
  className,
}: {
  kicker?: string;
  title: string;
  text?: string;
  crumbs?: { href: string; label: string }[];
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-cream pb-16 pt-36 sm:pb-20 sm:pt-44", className)}>
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-gold-300/25 blur-[120px]" />
      <div className="container-x relative">
        {crumbs.length > 0 && (
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-[13px] text-ink/45">
              <Link href="/" className="hover:text-ink">Home</Link>
              {crumbs.map((c) => (
                <span key={c.href} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Link href={c.href} className="hover:text-ink">{c.label}</Link>
                </span>
              ))}
            </nav>
          </Reveal>
        )}
        <div className={cn("grid gap-12", aside && "lg:grid-cols-[1.25fr_0.75fr] lg:items-end")}>
          <div>
            {kicker && (
              <Reveal>
                <p className="kicker">{kicker}</p>
              </Reveal>
            )}
            <h1 className="h-display mt-6 text-[2.8rem] text-forest-900 sm:text-6xl lg:text-[5.2rem]">
              <SplitText text={title} immediate delay={0.1} />
            </h1>
            {text && (
              <Reveal delay={0.3}>
                <p className="lead mt-7 max-w-2xl">{text}</p>
              </Reveal>
            )}
            {children && <Reveal delay={0.45}>{children}</Reveal>}
          </div>
          {aside && <Reveal delay={0.35}>{aside}</Reveal>}
        </div>
      </div>
    </section>
  );
}

/* ---------- Portfolio card ---------- */
export function ProjectCard({ p, size = "md", index }: { p: ProjectRow; size?: "lg" | "md"; index?: number }) {
  return (
    <Link href={`/portfolio/${p.slug}`} className="group block">
      <div className={cn("relative overflow-hidden rounded-[24px] bg-forest-800", size === "lg" ? "aspect-[4/5] sm:aspect-[16/11]" : "aspect-[4/5]")}>
        <Img src={p.cover} alt={p.title} fill sizes={size === "lg" ? "(min-width:1024px) 60vw, 100vw" : "(min-width:1024px) 40vw, 100vw"} className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/10 to-transparent" />
        <div className="absolute left-5 top-5 flex gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-forest-800 backdrop-blur">{p.occasion}</span>
        </div>
        <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-gold-400 text-forest-900 opacity-0 transition duration-500 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-7">
          <div>
            {index !== undefined && <p className="font-mono text-[11px] tracking-[0.2em] text-gold-300">{String(index + 1).padStart(2, "0")}</p>}
            <h3 className={cn("mt-1 font-display font-medium tracking-tight", size === "lg" ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl")}>{p.title}</h3>
            <p className="mt-1.5 text-sm text-white/65">{[p.location, p.year].filter(Boolean).join(" · ")}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ---------- Journal card ---------- */
export function PostCard({ p, wide }: { p: PostRow; wide?: boolean }) {
  return (
    <Link href={`/journal/${p.slug}`} className={cn("group block", wide && "grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center")}>
      <div className={cn("relative overflow-hidden rounded-[22px] bg-sand", wide ? "aspect-[16/10]" : "aspect-[4/3]")}>
        <Img src={p.cover} alt={p.title} fill sizes={wide ? "(min-width:1024px) 60vw, 100vw" : "(min-width:1024px) 33vw, 100vw"} className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-105" />
      </div>
      <div className={wide ? "" : "mt-5"}>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-700">
          {p.category} · {readTime(p.body)} min read
        </p>
        <h3 className={cn("mt-3 font-display font-medium leading-tight tracking-tight transition group-hover:text-gold-700", wide ? "text-3xl sm:text-[2.6rem]" : "text-xl sm:text-2xl")}>{p.title}</h3>
        <p className={cn("mt-3 text-muted", wide ? "text-lg leading-relaxed" : "line-clamp-2 text-[15px]")}>{p.excerpt}</p>
        {wide && <span className="mt-6 inline-flex items-center gap-2 font-semibold text-forest-800">Read the article <ArrowUpRight className="h-4 w-4" /></span>}
      </div>
    </Link>
  );
}

export const readTime = (body: string) => Math.max(1, Math.round(body.split(/\s+/).length / 200));

export const formatDate = (d: string) => {
  const t = new Date(d);
  return isNaN(t.getTime()) ? d : t.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

/* ---------- Tiny markdown renderer for journal articles ---------- */
export function Prose({ body }: { body: string }) {
  const blocks = body.replace(/\r/g, "").split(/\n{2,}/);
  return (
    <div className="space-y-6 text-[17px] leading-[1.8] text-ink/80 sm:text-lg">
      {blocks.map((b, i) => {
        const lines = b.split("\n").filter(Boolean);
        const out: React.ReactNode[] = [];
        let list: string[] = [];
        const flush = (k: string) => {
          if (list.length) out.push(<ul key={k} className="space-y-2.5 pl-1">{list.map((li, j) => <li key={j} className="flex gap-3"><span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />{inline(li)}</li>)}</ul>);
          list = [];
        };
        lines.forEach((l, j) => {
          if (l.startsWith("## ")) {
            flush(`l${j}`);
            out.push(<h2 key={j} className="pt-6 font-display text-[1.75rem] font-medium leading-tight tracking-tight text-ink sm:text-3xl">{l.slice(3)}</h2>);
          } else if (l.startsWith("- ")) list.push(l.slice(2));
          else {
            flush(`l${j}`);
            out.push(<p key={j}>{inline(l)}</p>);
          }
        });
        flush("end");
        return <div key={i} className="space-y-5">{out}</div>;
      })}
    </div>
  );
}

function inline(t: string) {
  return t.split(/(\*\*[^*]+\*\*)/g).map((s, i) => (s.startsWith("**") ? <strong key={i} className="font-semibold text-ink">{s.slice(2, -2)}</strong> : s));
}
