import React from "react";
import Script from "next/script";
import { db, warnIfDemoFlagsInProduction } from "@afreqa/core";
import { Header } from "@/components/festival/Header";
import { Footer } from "@/components/festival/Footer";
import { LaserBeams } from "@/components/festival/LaserBeams";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  warnIfDemoFlagsInProduction();
  const showDemoBanner = process.env.DEMO_BANNER === "true";
  const showUnverifiedNotice = process.env.DEMO_CONTENT_UNVERIFIED === "true";
  const allowlistActive = Boolean(process.env.EMAIL_ALLOWLIST?.trim());

  let ticketHref = "/go/tickets/store";
  try {
    const nextEvent = await db.event.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { date: "desc" },
      select: { slug: true },
    });
    if (nextEvent?.slug) {
      ticketHref = `/go/tickets/${nextEvent.slug}`;
    }
  } catch {
    // Fallback to /go/tickets/store if DB unavailable
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-afreqa-shadow text-afreqa-chrome-high selection:bg-pink-600 selection:text-white">
      <LaserBeams />
      {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
        <Script
          src={process.env.NEXT_PUBLIC_UMAMI_URL || "http://localhost:3002/script.js"}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}
      {(showDemoBanner || showUnverifiedNotice) && (
        <div className="relative z-[60] bg-gradient-to-r from-purple-900/95 via-pink-900/95 to-purple-900/95 border-b border-pink-500/40 px-4 py-1.5 text-center text-[11px] font-mono text-pink-100 space-y-0.5">
          {showDemoBanner && (
            <div>
              <span className="font-bold uppercase tracking-wider text-pink-300 mr-2">
                Preview / Demo Environment
              </span>
              <span>
                Staging showcase for decision-maker review.{" "}
                {allowlistActive
                  ? "Verification emails only go to allow-listed addresses."
                  : "Outgoing demo email restrictions may apply."}
              </span>
            </div>
          )}
          {showUnverifiedNotice && (
            <div className="text-[10px] text-amber-200/95">
              <span className="font-bold uppercase tracking-wider mr-1.5">[Unconfirmed Demo Content]</span>
              <span>
                Sample event titles, DJ names, venues, and phone numbers are placeholders pending confirmation with Afreqa.
              </span>
            </div>
          )}
        </div>
      )}
      <Header ticketHref={ticketHref} />
      <main className="flex-1 relative z-10 pt-20">
        {children}
      </main>
      <Footer ticketHref={ticketHref} />
    </div>
  );
}
