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
        <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-br from-afreqa-shadow via-afreqa-midnight to-afreqa-stage border border-afreqa-teal/30 shadow-glow-teal">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-afreqa-teal/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-afreqa-violet/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-afreqa-teal/15 border border-afreqa-teal/40 text-afreqa-teal text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inner Circle Access</span>
            </div>

            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-afreqa-chrome-high tracking-tight">
              Unlock Nairobi&apos;s Electronic Movement
            </h3>

            <p className="text-sm sm:text-base text-afreqa-silver leading-relaxed">
              Join thousands of electronic dancers who receive private presale links, unreleased festival sets, and exclusive invitations to secret stage takeovers.
            </p>

            {success ? (
              <div className="p-6 rounded-2xl bg-afreqa-shadow/80 border border-afreqa-teal/40 text-center animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-afreqa-teal mx-auto mb-2" />
                <h4 className="font-bold text-lg text-afreqa-chrome-high">Transmission Dispatched</h4>
                <p className="text-xs text-afreqa-silver mt-1">
                  We&apos;ve sent a verification link to <span className="text-afreqa-teal font-mono">{email}</span>. Click it to activate your frequency!
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
                    className="flex-1 px-5 py-3.5 rounded-full bg-afreqa-shadow/90 border border-afreqa-chrome-high/20 text-afreqa-chrome-high placeholder-afreqa-silver/40 text-sm focus:outline-none focus:border-afreqa-teal transition"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-afreqa-teal hover:bg-afreqa-teal/90 text-afreqa-shadow font-extrabold text-xs uppercase tracking-wider transition shadow-glow-teal disabled:opacity-50"
                  >
                    <span>{loading ? "Connecting..." : "Join Frequency"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-afreqa-silver-mid font-mono">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-afreqa-teal" />
                    <span>KDPA 2019 Compliant</span>
                  </span>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="text-afreqa-teal hover:underline"
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

