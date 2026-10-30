"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { SubscribeModal } from "@/components/forms/SubscribeModal";

export function SubscribeSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "homepage_section",
          interests: ["festivals", "early-bird"],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-br from-black/80 via-afreqa-midnight to-afreqa-stage border border-white/10 shadow-2xl">
          {/* Subtle Ambient Warm Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inner Circle Access</span>
            </div>

            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Unlock Nairobi&apos;s Electronic Movement
            </h3>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Join electronic dancers across Nairobi who receive private presale allocations, secret stage takeover notices, and exclusive festival updates.
            </p>

            {success ? (
              <div className="p-6 rounded-2xl bg-black/60 border border-amber-500/30 text-center animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h4 className="font-bold text-lg text-white">Transmission Dispatched</h4>
                <p className="text-xs text-zinc-300 mt-1">
                  We&apos;ve sent a verification link to <span className="text-amber-400 font-mono">{email}</span>. Click it to confirm your frequency!
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="space-y-3">
                {error && (
                  <p className="text-xs text-red-400 font-mono">{error}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-5 py-3.5 rounded-full bg-black/70 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    <span>{loading ? "Connecting..." : "Join Frequency"}</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>KDPA 2019 Compliant</span>
                  </span>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="text-amber-400 hover:underline"
                  >
                    Custom Preferences (WhatsApp & Genres)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <SubscribeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultSource="homepage_modal"
      />
    </>
  );
}

