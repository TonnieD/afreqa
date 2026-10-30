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
                  ? "glass-panel border-afreqa-teal/40 shadow-glow-teal hover:border-afreqa-teal hover:-translate-y-1"
                  : isSoldOut
                  ? "bg-afreqa-shadow/40 border border-afreqa-chrome-high/5 opacity-60"
                  : "glass-panel border-afreqa-chrome-high/10 opacity-80"
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-afreqa-silver">
                  Tier
                </span>
                {isOnSale && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-afreqa-teal/15 text-afreqa-teal border border-afreqa-teal/40 animate-pulse">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ON SALE</span>
                  </span>
                )}
                {isSoldOut && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-afreqa-crimson/20 text-afreqa-chrome-high border border-afreqa-crimson/40">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span>SOLD OUT</span>
                  </span>
                )}
                {isUpcoming && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-afreqa-stage text-afreqa-silver border border-afreqa-chrome-high/10">
                    <Clock className="w-3 h-3" />
                    <span>NEXT RELEASE</span>
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div className="space-y-1 mb-4">
                <h4 className="font-display font-bold text-lg text-afreqa-chrome-high">
                  {phase.name}
                </h4>
                <div className="flex items-baseline gap-1.5">
                  {phase.price ? (
                    <>
                      <span className="font-mono text-xs text-afreqa-silver-mid font-semibold">
                        {phase.currency || "KES"}
                      </span>
                      <span className="font-display font-extrabold text-2xl text-chrome">
                        {phase.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="font-mono text-sm text-afreqa-silver-mid">
                      TBA
                    </span>
                  )}
                </div>
                {phase.description && (
                  <p className="text-xs text-afreqa-silver pt-1">
                    {phase.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div>
                {isOnSale ? (
                  <Link
                    href={`/go/tickets/${eventSlug}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-gradient-to-r from-afreqa-teal to-afreqa-violet hover:from-afreqa-teal/90 hover:to-afreqa-violet/90 text-afreqa-shadow font-bold text-xs uppercase tracking-wider transition-all shadow-glow-teal active:scale-95"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Claim Ticket</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-afreqa-stage/50 text-afreqa-silver-mid text-xs font-mono uppercase tracking-wider cursor-not-allowed border border-afreqa-chrome-high/5"
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
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-afreqa-silver-mid gap-2 px-2">
        <p className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-afreqa-teal" />
          <span>Tickets powered officially by HustleSasa. Strict 18+ ID check at gate.</span>
        </p>
        <p>No paper or physical wristbands sold outside official gate.</p>
      </div>
    </div>
  );
}

