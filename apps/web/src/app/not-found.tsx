import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Radio } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-afreqa-shadow flex flex-col items-center justify-center p-6 text-center relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Background warm stage ember */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto space-y-6">
        <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border border-white/20 shadow-xl p-1">
          <Image
            src="/brand/logo.jpg"
            alt="Afreqa"
            fill
            sizes="96px"
            className="object-cover rounded-full filter grayscale contrast-125"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Error 404 • Signal Lost</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight">
          LOST IN THE FREQUENCY
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
          The coordinates you entered have dissolved into the night sky. Return to the festival mainstage to re-align your pulse.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Mainstage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

