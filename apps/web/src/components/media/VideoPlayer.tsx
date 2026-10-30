"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  src?: string | null;
  provider?: string | null;
  providerId?: string | null;
  posterUrl?: string | null;
  title?: string;
}

export function VideoPlayer({
  src,
  provider,
  providerId,
  posterUrl,
  title = "Afreqa Festival Video",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // If already clicked play, render active media
  if (isPlaying) {
    if (provider === "youtube" && providerId) {
      return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${providerId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      );
    }

    if (provider === "vimeo" && providerId) {
      return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
          <iframe
            src={`https://player.vimeo.com/video/${providerId}?autoplay=1`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      );
    }

    if (src) {
      return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
          <video
            src={src}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  }

  // Privacy-preserving "Lite" facade
  return (
    <div
      onClick={() => setIsPlaying(true)}
      className="group relative w-full aspect-video rounded-2xl overflow-hidden bg-afreqa-shadow border border-afreqa-chrome-high/15 cursor-pointer shadow-xl transition hover:border-afreqa-teal/50"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsPlaying(true);
        }
      }}
      aria-label={`Play video: ${title}`}
    >
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-afreqa-midnight to-afreqa-stage" />
      )}

      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-300" />

      {/* Cinema Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center backdrop-blur-md group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black text-amber-400 transition duration-300 shadow-xl shadow-amber-500/10">
          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
        </div>
      </div>

      {/* Video caption banner */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between">
        <span className="font-bold text-xs sm:text-sm text-white truncate max-w-md">
          {title}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 px-2 py-0.5 rounded bg-black/60 border border-amber-400/30">
          HD Transcoded
        </span>
      </div>
    </div>
  );
}

