"use client";

import React from "react";
import Image from "next/image";

export function LaserBeams() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {/* Background authentic live crowd & stage image with cinematic scrim */}
      <div className="absolute inset-0">
        <Image
          src="/images/afreqa-live-crowd.jpg"
          alt="Afreqa live crowd atmosphere"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 filter brightness-90 contrast-110"
        />
      </div>

      {/* Atmospheric Vignette & Contrast Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-afreqa-shadow/90 via-afreqa-shadow/50 to-afreqa-shadow" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,#070709_85%)] opacity-75" />

      {/* Organic Warm Stage Lighting Embers (Sampled from real stage photo) */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[400px] bg-afreqa-amber/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] -right-[150px] w-[500px] h-[500px] bg-afreqa-blue/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Analog Grain / Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
    </div>
  );
}

