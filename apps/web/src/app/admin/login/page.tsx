"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, ShieldAlert } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.mustChangePassword) {
        router.push("/admin/change-password");
      } else {
        router.push("/admin");
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-afreqa-stage/90 border border-afreqa-chrome-high/15 p-8 backdrop-blur-xl shadow-2xl shadow-afreqa-shadow">
      {reason === "inactivity" && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="leading-snug">
            Your session was locked and terminated after 30 minutes of inactivity for system security. Please re-authenticate.
          </span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-afreqa-silver mb-1.5">
            Staff Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-afreqa-silver-mid absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@afreqa.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-afreqa-silver mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-afreqa-silver-mid absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-afreqa-teal via-cyan-400 to-afreqa-violet text-afreqa-shadow font-extrabold text-xs uppercase tracking-widest shadow-glow-teal hover:opacity-90 transition disabled:opacity-50"
        >
          <span>{loading ? "Authenticating..." : "Authorize Access"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-afreqa-chrome-high/10 text-center flex items-center justify-center gap-1.5 text-[11px] text-afreqa-silver-mid font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-afreqa-teal" />
        <span>Argon2id Hash • Append-Only Audit Trail</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-afreqa-shadow flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-afreqa-teal/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-afreqa-violet/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-afreqa-chrome-high/30 mx-auto mb-4 shadow-glow-teal">
            <Image
              src="/brand/logo.jpg"
              alt="Afreqa Emblem"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high tracking-wider uppercase">
            Afreqa Operations
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-afreqa-silver-mid mt-1">
            Secure Staff & Admin Portal
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-xs text-afreqa-silver-mid font-mono">Loading authentication portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
