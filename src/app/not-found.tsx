import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grain relative grid min-h-svh place-items-center overflow-hidden bg-forest-900 px-6 text-center text-white">
      <div>
        <img src="/brand/monogram.png" alt="" className="mx-auto h-16" />
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-gold-300">Error 404</p>
        <h1 className="mt-4 font-display text-5xl font-medium tracking-tight sm:text-7xl">This page took a day off.</h1>
        <p className="mx-auto mt-5 max-w-md text-white/60">The page you're looking for doesn't exist — but your dream event still can.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-gold">Back to home</Link>
          <Link href="/contact" className="btn btn-ghost-light">Talk to a planner</Link>
        </div>
      </div>
    </main>
  );
}
