"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface UnsubscribePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const resolvedParams = use(searchParams);
  const emailParam = typeof resolvedParams.email === "string" ? resolvedParams.email : "";

  const [email, setEmail] = useState(emailParam);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
      // Auto trigger if email is in URL
      handleUnsubscribe(emailParam);
    }
  }, [emailParam]);

  async function handleUnsubscribe(targetEmail?: string) {
    const toSubmit = targetEmail || email;
    if (!toSubmit || !toSubmit.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscribers/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: toSubmit }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process unsubscribe request.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
      <div className="bg-canvas/80 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-silver text-xs font-mono tracking-widest uppercase mb-4">
            KDPA Data Protection
          </div>
          <h1 className="text-2xl font-black text-chrome uppercase tracking-wide">
            Manage Subscription
          </h1>
          <p className="text-silver/80 text-sm mt-2">
            We are sorry to see you go. Enter your email below to instantly opt out of all Afreqa event notifications and newsletters.
          </p>
        </div>

        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 text-2xl">
              ✓
            </div>
            <h3 className="text-lg font-bold text-chrome mb-2">Unsubscribed Successfully</h3>
            <p className="text-silver/70 text-xs mb-8">
              Your email ({email}) has been removed from active broadcasts. Your preference has been recorded in accordance with the Kenya Data Protection Act.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-chrome font-bold text-xs uppercase tracking-widest transition"
            >
              Return to Homepage
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUnsubscribe();
            }}
            className="space-y-4"
          >
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase text-silver/80 mb-1">
                Your Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dancer@example.com"
                className="w-full px-4 py-3 rounded-xl bg-crowd/80 border border-white/15 text-chrome placeholder-silver/40 text-sm focus:outline-none focus:border-aurora transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-xs uppercase tracking-widest transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Unsubscribe from All Frequencies"}
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-silver/50 hover:text-silver underline transition">
                Changed your mind? Stay subscribed
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

