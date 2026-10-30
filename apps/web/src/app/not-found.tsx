import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Radio } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-afreqa-shadow flex flex-col items-center justify-center p-6 text-center relative overflow-hidden selection:bg-afreqa-teal selection:text-afreqa-shadow">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-afreqa-violet/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto space-y-6">
        <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border border-afreqa-chrome-high/20 shadow-glow-teal p-1">
          <Image
            src="/brand/logo.jpg"
            alt="Afreqa"
            fill
            sizes="96px"
            className="object-cover rounded-full filter grayscale contrast-125"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-afreqa-crimson/30 border border-afreqa-crimson/50 text-red-300 text-xs font-mono font-bold uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Error 404 • Signal Lost</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-chrome tracking-tight">
          LOST IN THE FREQUENCY
        </h1>

        <p className="text-sm sm:text-base text-afreqa-silver leading-relaxed font-light">
          The coordinates you entered have dissolved into the night sky. Return to the festival mainstage to re-align your pulse.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-afreqa-teal to-afreqa-violet text-afreqa-shadow font-extrabold text-sm uppercase tracking-wider shadow-glow-teal hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Mainstage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

