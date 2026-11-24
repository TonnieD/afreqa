"use client";

import React from "react";

interface ArtistPortraitPlaceholderProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
  showLabel?: boolean;
}

export function ArtistPortraitPlaceholder({
  className = "w-full h-full",
  size = "full",
  showLabel = true,
}: ArtistPortraitPlaceholderProps) {
  const isSmall = size === "sm";

  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#191033] via-[#110924] to-[#090514] relative overflow-hidden select-none border border-white/5 ${className}`}
      aria-label="Portrait silhouette placeholder"
    >
      {/* Ambient purple/violet stage back-mist */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Portrait silhouette cutout: pure anatomic head, neck, and shoulders bust contour WITHOUT facial features */}
      <svg
        viewBox="0 0 100 120"
        className={`text-white/[0.14] fill-current filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-105 ${
          isSmall ? "w-8 h-10" : "w-24 h-28 sm:w-28 sm:h-32"
        }`}
        aria-hidden="true"
      >
        {/* Head silhouette */}
        <ellipse cx="50" cy="38" rx="20" ry="24" />
        {/* Neck */}
        <path d="M43 58 L43 73 L57 73 L57 58 Z" />
        {/* Shoulders & Chest bust silhouette cutout */}
        <path d="M50 68 C38 68 32 75 23 82 C14 91 8 103 6 116 L94 116 C92 103 86 91 77 82 C68 75 62 68 50 68 Z" />
      </svg>

      {showLabel && !isSmall && (
        <span className="relative z-10 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-2 font-medium">
          Portrait Unset
        </span>
      )}
    </div>
  );
}
