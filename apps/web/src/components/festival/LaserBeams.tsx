"use client";

import React from "react";

export function LaserBeams() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {/* Primary Top Spotlight (Electric Violet to Aurora Teal) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-gradient-to-b from-afreqa-violet/25 via-afreqa-teal/15 to-transparent rounded-full blur-[120px] opacity-75" />

      {/* Stage Left Amber Accent (Warm Stage Light) */}
      <div className="absolute top-[20%] -left-[200px] w-[500px] h-[500px] bg-afreqa-amber/30 rounded-full blur-[140px] opacity-60" />

      {/* Stage Right Cyan/Teal Laser Flare */}
      <div className="absolute top-[35%] -right-[200px] w-[550px] h-[550px] bg-afreqa-teal/20 rounded-full blur-[140px] opacity-65" />

      {/* Deep Ground Obsidian Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-[400px] bg-gradient-to-t from-afreqa-shadow via-afreqa-shadow/80 to-transparent" />

      {/* Laser Ray 1 (Diagonal Light Beam Left) */}
      <div className="hidden lg:block absolute top-0 left-1/4 w-[2px] h-[900px] bg-gradient-to-b from-afreqa-teal/40 via-afreqa-violet/20 to-transparent rotate-[32deg] origin-top blur-[1px] animate-laser-pulse" />

      {/* Laser Ray 2 (Diagonal Light Beam Right) */}
      <div className="hidden lg:block absolute top-0 right-1/4 w-[2px] h-[900px] bg-gradient-to-b from-afreqa-violet/40 via-afreqa-teal/20 to-transparent -rotate-[32deg] origin-top blur-[1px] animate-laser-pulse" style={{ animationDelay: "1.5s" }} />

      {/* Subtle Noise / Stardust overlay via CSS */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(237,236,236,0.04)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
    </div>
  );
}

