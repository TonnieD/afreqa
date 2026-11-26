"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If it's a Next.js redirect thrown by requireAuth, re-trigger navigation
    if (error?.digest?.startsWith("NEXT_REDIRECT") || error?.message?.includes("NEXT_REDIRECT")) {
      window.location.reload();
      return;
    }
    console.error("Admin subsystem error boundary triggered:", error);
  }, [error]);

  return (
    <div className="rounded-3xl bg-afreqa-stage/80 border border-red-500/30 p-8 sm:p-12 text-center relative overflow-hidden my-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono font-bold uppercase tracking-widest">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Subsystem Disruption</span>
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-afreqa-chrome-high uppercase tracking-wide">
          Admin View Disrupted
        </h2>

        <p className="text-xs sm:text-sm text-afreqa-silver-mid leading-relaxed">
          An unexpected resonance occurred while rendering this administrative view. Your session and other admin sections remain active.
        </p>

        {error?.message && !error.message.includes("NEXT_REDIRECT") && (
          <div className="p-3.5 bg-black/50 border border-white/10 rounded-2xl text-left text-xs font-mono text-zinc-300 max-h-32 overflow-auto">
            <span className="font-bold text-red-400 block mb-0.5">Diagnostic Notice:</span>
            <span className="text-zinc-300 break-words">{error.message}</span>
            {error.digest && <span className="text-[10px] text-zinc-500 block mt-1">Digest: {error.digest}</span>}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-pink-950/30 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry View</span>
          </button>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-semibold uppercase tracking-wider transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
