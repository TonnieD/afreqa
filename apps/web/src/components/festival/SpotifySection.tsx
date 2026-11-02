"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Music,
  Radio,
  Headphones,
  Play,
  ArrowUpRight,
  Share2,
  Sparkles,
  ExternalLink,
  Flame,
  Volume2,
  Clock,
  Disc,
} from "lucide-react";
import { PLAYLISTS, LIVE_PLAYLISTS, type Playlist } from "@/lib/spotify";

export { PLAYLISTS, LIVE_PLAYLISTS, type Playlist };

export function SpotifySection() {
  const [filterMode, setFilterMode] = useState<"all" | "live">("all");
  const [activePlaylist, setActivePlaylist] = useState<Playlist>(PLAYLISTS[0]);
  const [copied, setCopied] = useState(false);

  const displayedPlaylists =
    filterMode === "live" ? LIVE_PLAYLISTS : PLAYLISTS;

  const handleShare = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="spotify" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-28">
      <div className="rounded-3xl glass-panel p-6 sm:p-10 lg:p-12 relative overflow-hidden border border-white/10 shadow-2xl">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <Headphones className="w-3.5 h-3.5" />
              <span>Official Soundwaves & Fanbase Order</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-chrome tracking-tight">
              CURATED SPOTIFY PLAYLISTS
            </h2>
            <p className="mt-2 text-zinc-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Ordered strictly by dancefloor popularity and fanbase size: #1 Progressive EDM (Tomorrowland anthems), #2 Big Room, #3 African Tech, #4 Techno, #5 Hardstyle, #6 Drum &amp; Bass, and #7 Dubstep.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Toggle */}
            <div className="inline-flex items-center p-1 rounded-full bg-black/60 border border-white/10 text-xs font-mono">
              <button
                onClick={() => setFilterMode("all")}
                className={`px-3.5 py-1.5 rounded-full transition ${
                  filterMode === "all"
                    ? "bg-emerald-500 text-black font-bold shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All 7 Pillars ({PLAYLISTS.length})
              </button>
              <button
                onClick={() => setFilterMode("live")}
                className={`px-3.5 py-1.5 rounded-full transition ${
                  filterMode === "live"
                    ? "bg-emerald-500 text-black font-bold shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Live on Spotify ({LIVE_PLAYLISTS.length})
              </button>
            </div>

            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#1DB954]/20 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.217.354-.678.468-1.033.253-2.83-1.73-6.395-2.121-10.592-1.162-.405.093-.812-.162-.904-.567-.093-.404.162-.812.567-.905 4.588-1.048 8.528-.601 11.71 1.349.354.215.467.676.252 1.032zm1.467-3.264c-.273.444-.855.586-1.299.313-3.24-1.993-8.178-2.57-12.01-1.405-.494.15-1.023-.13-1.173-.623-.15-.494.13-1.023.623-1.173 4.382-1.33 9.816-.689 13.546 1.6 443.272.585.855.313 1.298zm.135-3.398C15.222 8.35 8.825 8.14 5.137 9.26c-.595.18-1.226-.16-1.407-.756-.18-.596.16-1.226.756-1.407 4.238-1.286 11.306-1.047 15.772 1.604.536.319.712 1.018.393 1.554-.319.535-1.018.712-1.551.394z"/>
              </svg>
              <span>Follow on Spotify</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Playlist Grid & Embedded Player */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Playlist selector tabs */}
          <div className="lg:col-span-5 space-y-3.5 max-h-[720px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
              <span>Select Sound Pillar</span>
              <span className="text-[11px] text-zinc-500">Ordered by Fanbase</span>
            </div>

            {displayedPlaylists.map((pl, idx) => {
              const isSelected = pl.id === activePlaylist.id;
              const isLive = pl.status === "live";

              return (
                <button
                  key={pl.id}
                  onClick={() => setActivePlaylist(pl)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all border ${
                    isSelected
                      ? "bg-[#141721] border-[#1DB954]/50 shadow-xl shadow-[#1DB954]/10 scale-[1.01]"
                      : "bg-black/40 border-white/5 hover:border-white/15 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                          {pl.fanbaseRank.split("•")[0].trim()}
                        </span>
                        {isLive ? (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                            Live on Spotify
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                            Resident Drop
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-base sm:text-lg text-white">
                        {pl.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {pl.tagline}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 text-zinc-400 flex-shrink-0 mt-1">
                      <Play
                        className={`w-4 h-4 ${
                          isSelected ? "text-emerald-400 fill-current" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span className="text-zinc-400 font-medium">{pl.tracksCount}</span>
                    <span>{pl.bpm || pl.curator}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Embedded Spotify Player / Curating Card */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-black/60 border border-white/10 p-4 sm:p-6 shadow-xl">
            {/* Active Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1DB954]/20 border border-[#1DB954]/30 flex items-center justify-center text-[#1DB954]">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-base sm:text-lg text-white">
                      {activePlaylist.title}
                    </h4>
                  </div>
                  <p className="text-xs font-mono text-zinc-400">
                    {activePlaylist.curator} • {activePlaylist.fanbaseRank}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(activePlaylist.spotifyUrl)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition-colors"
                  title="Copy playlist link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied!" : "Share"}</span>
                </button>

                {activePlaylist.status === "live" && (
                  <a
                    href={activePlaylist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
                    title="Open in Spotify App"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Embedded Spotify Player or Resident Curation Showcase Card */}
            {activePlaylist.status === "live" ? (
              <div className="my-4 rounded-xl overflow-hidden bg-black/80 border border-white/10 shadow-inner">
                <iframe
                  title={activePlaylist.title}
                  src={`https://open.spotify.com/embed/${activePlaylist.spotifyUri}?utm_source=generator&theme=0`}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full rounded-xl"
                />
              </div>
            ) : (
              <div className="my-4 rounded-xl overflow-hidden bg-gradient-to-br from-[#0e141a] via-[#10131d] to-[#0c0d12] border border-amber-500/30 p-6 sm:p-8 flex flex-col justify-between min-h-[352px] shadow-inner space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                      Resident Curation Drop • Coming to Spotify
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {activePlaylist.bpm}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                      {activePlaylist.title}
                    </h3>
                    <p className="mt-1 text-xs font-mono text-emerald-400 font-semibold">
                      {activePlaylist.genre}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {activePlaylist.tagline}
                  </p>

                  {activePlaylist.soundReferences && (
                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono space-y-1">
                      <span className="text-amber-400 font-bold uppercase tracking-wider block">
                        Sonic Blueprint & Key References:
                      </span>
                      <p className="text-zinc-300">
                        {activePlaylist.soundReferences}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <span className="text-zinc-400">
                    Are you a producer or DJ with an authentic African Tech, D&B or Dubstep track?
                  </span>
                  <Link
                    href="/contact?subject=ARTIST_SUBMISSION"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition active:scale-95"
                  >
                    <span>Submit Demo / Track</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Bottom Footer Info */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{activePlaylist.fanbaseRank}</span>
              </span>
              <a
                href="/contact?subject=BOOKING"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Submit a track or DJ mix →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
