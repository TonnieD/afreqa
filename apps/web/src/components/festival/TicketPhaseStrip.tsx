"use client";

import React from "react";
import Image from "next/image";
import { Ticket, CheckCircle2, AlertCircle, Clock, ArrowUpRight } from "lucide-react";

export interface TicketPhase {
  id: string;
  name: string;
  price?: number | null;
  currency?: string;
  status: "ON_SALE" | "SOLD_OUT" | "UPCOMING" | "PAUSED";
  description?: string | null;
}

interface TicketPhaseStripProps {
  phases: TicketPhase[];
  eventSlug: string;
  /**
   * Optional stamp image override ("solid" = soldout.png with solid red banner, "outline" = soldout1.png)
   * Defaults to "solid" for maximum contrast & conversion psychology.
   */
  stampVariant?: "solid" | "outline";
}

export function TicketPhaseStrip({ phases, eventSlug, stampVariant = "solid" }: TicketPhaseStripProps) {
  const stampImageSrc = stampVariant === "outline" ? "/images/soldout1.png" : "/images/soldout.png";

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((phase) => {
          const isSoldOut = phase.status === "SOLD_OUT";
          const isOnSale = phase.status === "ON_SALE";
          const isUpcoming = phase.status === "UPCOMING";

          return (
            <div
              key={phase.id}
              className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                isOnSale
                  ? "glass-panel border-amber-500/30 shadow-2xl hover:border-amber-400 hover:-translate-y-1"
                  : isSoldOut
                  ? "bg-black/60 border border-red-500/20 shadow-inner"
                  : "glass-panel border-white/10 opacity-80"
              }`}
            >
              {/* Sold Out 45-degree Slanted Background Watermark Stamp */}
              {isSoldOut && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden select-none"
                >
                  <div
                    className="relative w-44 h-44 sm:w-48 sm:h-48 opacity-25 filter drop-shadow-[0_4px_16px_rgba(220,38,38,0.35)]"
                    style={{ transform: "rotate(-22.5deg)" }}
                  >
                    <Image
                      src={stampImageSrc}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 176px, 192px"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Foreground Card Contents (sits cleanly above the watermark stamp without obscuring phase info) */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                {/* Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                    Tier
                  </span>
                  {isOnSale && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ON SALE</span>
                    </span>
                  )}
                  {isSoldOut && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/60 text-red-300 border border-red-800/40">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      <span>SOLD OUT</span>
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-zinc-400 border border-white/10">
                      <Clock className="w-3 h-3" />
                      <span>NEXT RELEASE</span>
                    </span>
                  )}
                </div>

                {/* Title & Price */}
                <div className="space-y-1 mb-4">
                  <h4 className="font-display font-bold text-lg text-white">
                    {phase.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5">
                    {phase.price ? (
                      <>
                        <span className="font-mono text-xs text-zinc-400 font-semibold">
                          {phase.currency || "KES"}
                        </span>
                        <span className="font-display font-extrabold text-2xl text-white">
                          {phase.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="font-mono text-sm text-zinc-400">
                        TBA
                      </span>
                    )}
                  </div>
                  {phase.description && (
                    <p className="text-xs text-zinc-300/90 pt-1 leading-relaxed font-light">
                      {phase.description}
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <div>
                  {isOnSale ? (
                    <a
                      href={`/go/tickets/${eventSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                    >
                      <Ticket className="w-3.5 h-3.5 text-black" />
                      <span>Get Ticket</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-black" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-white/5 text-zinc-500 text-xs font-mono uppercase tracking-wider cursor-not-allowed border border-white/5"
                    >
                      {isSoldOut ? "Allocations Exhausted" : "Opening Soon"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimers & Security note */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-400 gap-2 px-2">
        <p className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Tickets powered officially by HustleSasa. Strict 18+ ID check at gate.</span>
        </p>
        <p>No paper or physical wristbands sold outside official gate.</p>
      </div>
    </div>
  );
}

