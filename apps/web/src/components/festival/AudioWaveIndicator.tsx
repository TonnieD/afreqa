"use client";

import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AudioWaveIndicator() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <button
      onClick={() => setIsPlaying(!isPlaying)}
      title={isPlaying ? "Mute ambient frequency" : "Play ambient festival frequency"}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel hover:border-amber-500/40 transition-all text-xs font-mono text-zinc-300 hover:text-white group"
      aria-label="Toggle ambient soundwaves"
    >
      <div className="flex items-end gap-[3px] h-3.5 w-4.5">
        <span
          className={`w-[2.5px] bg-amber-400 rounded-full transition-all duration-300 ${
            isPlaying ? "h-3.5 animate-pulse" : "h-1 group-hover:h-2"
          }`}
        />
        <span
          className={`w-[2.5px] bg-amber-500 rounded-full transition-all duration-300 ${
            isPlaying ? "h-2.5 animate-pulse" : "h-2 group-hover:h-3"
          }`}
          style={{ animationDelay: "150ms" }}
        />
        <span
          className={`w-[2.5px] bg-amber-300 rounded-full transition-all duration-300 ${
            isPlaying ? "h-3 animate-pulse" : "h-1.5 group-hover:h-2.5"
          }`}
          style={{ animationDelay: "300ms" }}
        />
        <span
          className={`w-[2.5px] bg-white rounded-full transition-all duration-300 ${
            isPlaying ? "h-2 animate-pulse" : "h-1 group-hover:h-2"
          }`}
          style={{ animationDelay: "450ms" }}
        />
      </div>
      <span className="hidden sm:inline tracking-wider uppercase text-[11px]">
        {isPlaying ? "Live Sound" : "Sound"}
      </span>
      {isPlaying ? (
        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
      )}
    </button>
  );
}

