"use client";

import React, { useState } from "react";
import { Flame, Radio, Sparkles, ArrowUpRight, Share2, Disc3, Gauge, Music2 } from "lucide-react";
import { TRACK_OF_THE_WEEK } from "@/lib/spotify";

export function TrackOfTheWeek() {
  const [copied, setCopied] = useState(false);
  const track = TRACK_OF_THE_WEEK;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(track.spotifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-10 lg:p-12 relative overflow-hidden border border-amber-500/30 shadow-2xl bg-gradient-to-br from-[#0c0d13] via-[#121622] to-[#0c0d13]">
      {/* Ambient warm stage glow */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>AFREQA TRACK OF THE WEEK</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-zinc-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            {track.weekNumber}
          </span>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition"
            title="Copy track link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Track Breakdown & Spotify Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
        {/* Left: Track Information & Curator Analysis */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <Disc3 className="w-4 h-4 animate-spin [animation-duration:8s]" />
              {track.genre}
            </span>
            <h3 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
              {track.title}
            </h3>
            <p className="text-base sm:text-lg text-zinc-300 font-medium">
              By <span className="text-white font-bold">{track.artist}</span>
              {track.remixOrMix && (
                <span className="text-zinc-400 text-sm ml-2">({track.remixOrMix})</span>
              )}
            </p>
          </div>

          {/* Technical Audio Specs Pill Strip */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-zinc-300">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>{track.bpm} BPM</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-zinc-300">
              <Music2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Key: {track.key}</span>
            </div>
            {track.label && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-zinc-400">
                <span>Label: {track.label}</span>
              </div>
            )}
          </div>

          {/* Curator Analysis Note */}
          <div className="rounded-2xl bg-black/40 border border-white/10 p-5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="text-amber-400 font-bold uppercase tracking-wider">
                Sound Assessment
              </span>
              <span>{track.curator}</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              &ldquo;{track.curatorNote}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#1DB954]/20 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.217.354-.678.468-1.033.253-2.83-1.73-6.395-2.121-10.592-1.162-.405.093-.812-.162-.904-.567-.093-.404.162-.812.567-.905 4.588-1.048 8.528-.601 11.71 1.349.354.215.467.676.252 1.032zm1.467-3.264c-.273.444-.855.586-1.299.313-3.24-1.993-8.178-2.57-12.01-1.405-.494.15-1.023-.13-1.173-.623-.15-.494.13-1.023.623-1.173 4.382-1.33 9.816-.689 13.546 1.6 443.272.585.855.313 1.298zm.135-3.398C15.222 8.35 8.825 8.14 5.137 9.26c-.595.18-1.226-.16-1.407-.756-.18-.596.16-1.226.756-1.407 4.238-1.286 11.306-1.047 15.772 1.604.536.319.712 1.018.393 1.554-.319.535-1.018.712-1.551.394z" />
              </svg>
              <span>Play on Spotify</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right: Spotify Embedded Track Player */}
        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl p-2">
          <iframe
            title={`${track.title} - ${track.artist}`}
            src={`https://open.spotify.com/embed/track/${track.spotifyTrackId}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
