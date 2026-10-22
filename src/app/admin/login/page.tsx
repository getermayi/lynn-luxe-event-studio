"use client";

import { Loader2, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (res.ok) {
      router.push(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } else {
      setError((await res.json().catch(() => ({}))).error || "Login failed");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="on-dark mt-10 space-y-3">
      <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" autoComplete="username" />
      <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" autoComplete="current-password" />
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button disabled={busy} className="btn btn-gold w-full">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Sign in
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="grain relative grid min-h-svh place-items-center overflow-hidden bg-forest-900 px-5 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-400/15 blur-[100px]" />
      <div className="relative w-full max-w-sm">
        <img src="/brand/logo.png" alt="Lynn Luxe Event Studio" className="mx-auto w-48" />
        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-gold-300">Admin dashboard</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
