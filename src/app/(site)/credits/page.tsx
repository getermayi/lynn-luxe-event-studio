import type { Metadata } from "next";
import { getSetting } from "@/lib/content";

export const metadata: Metadata = { title: "Photo credits", robots: { index: false } };

export default async function CreditsPage() {
  const credits = await getSetting("credits");
  return (
    <>
      <div className="h-[100px] bg-forest-900" />
      <section className="section bg-ivory">
        <div className="container-x max-w-3xl">
          <p className="kicker">Credits</p>
          <h1 className="h-section mt-5">{credits.title}</h1>
          <p className="lead mt-5">{credits.text}</p>
          <ul className="mt-10 space-y-3 text-[15px] text-muted">
            {credits.items.map((c) => (
              <li key={c} className="border-b border-ink/10 pb-3">{c}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
