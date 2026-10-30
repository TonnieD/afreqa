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
    // Log the error for internal diagnostics
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

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-afreqa-teal text-afreqa-shadow font-extrabold text-xs uppercase tracking-wider shadow-glow-teal hover:scale-105 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-panel hover:border-afreqa-teal/50 text-afreqa-chrome-high text-xs font-mono font-semibold uppercase tracking-wider transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

