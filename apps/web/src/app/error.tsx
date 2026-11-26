"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If it's a Next.js redirect or not-found, handle gracefully
    if (error?.digest?.startsWith("NEXT_REDIRECT") || error?.message?.includes("NEXT_REDIRECT")) {
      window.location.reload();
      return;
    }
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-afreqa-shadow flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-afreqa-crimson/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/50 border border-red-500/40 text-red-400 text-xs font-mono font-bold uppercase tracking-widest">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Frequency Disruption (500)</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-chrome tracking-tight">
          HARMONIC OVERLOAD
        </h1>

        <p className="text-sm sm:text-base text-afreqa-silver leading-relaxed font-light">
          An unexpected technical resonance occurred while rendering this view. Our stage engineers have been notified.
        </p>

        {error?.message && !error.message.includes("NEXT_REDIRECT") && (
          <div className="p-3.5 bg-black/50 border border-white/10 rounded-2xl text-left text-xs font-mono text-zinc-300 max-h-36 overflow-auto">
            <span className="font-bold text-red-400 block mb-0.5">Diagnostic Notice:</span>
            <span className="text-zinc-300 break-words">{error.message}</span>
            {error.digest && <span className="text-[10px] text-zinc-500 block mt-1">Digest: {error.digest}</span>}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-pink-950/30 active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-semibold uppercase tracking-wider transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
