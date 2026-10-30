import React from "react";
import Script from "next/script";
import { Header } from "@/components/festival/Header";
import { Footer } from "@/components/festival/Footer";
import { LaserBeams } from "@/components/festival/LaserBeams";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-afreqa-shadow text-afreqa-chrome-high selection:bg-afreqa-teal selection:text-afreqa-shadow">
      <LaserBeams />
      {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
        <Script
          src={process.env.NEXT_PUBLIC_UMAMI_URL || "http://localhost:3002/script.js"}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}
      <Header />
      <main className="flex-1 relative z-10 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}

