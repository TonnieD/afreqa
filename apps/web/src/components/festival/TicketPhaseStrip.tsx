"use client";

import React from "react";
import Link from "next/link";
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
}

export function TicketPhaseStrip({ phases, eventSlug }: TicketPhaseStripProps) {
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
              className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${
                isOnSale
                  ? "glass-panel border-amber-500/30 shadow-2xl hover:border-amber-400 hover:-translate-y-1"
                  : isSoldOut
                  ? "bg-black/40 border border-white/5 opacity-60"
                  : "glass-panel border-white/10 opacity-80"
              }`}
            >
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
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/40 text-red-300 border border-red-800/40">
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
                  <p className="text-xs text-zinc-400 pt-1">
                    {phase.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div>
                {isOnSale ? (
                  <Link
                    href={`/go/tickets/${eventSlug}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    <Ticket className="w-3.5 h-3.5 text-black" />
                    <span>Claim Ticket</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-black" />
                  </Link>
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

