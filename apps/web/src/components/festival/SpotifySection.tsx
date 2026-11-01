"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Music, Radio, Headphones, Play, ArrowUpRight, Share2, Sparkles, ExternalLink } from "lucide-react";
import { PLAYLISTS, type Playlist } from "@/lib/spotify";

export { PLAYLISTS, type Playlist };

export function SpotifySection() {
  const [activePlaylist, setActivePlaylist] = useState<Playlist>(PLAYLISTS[0]);
  const [copied, setCopied] = useState(false);

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

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <Headphones className="w-3.5 h-3.5" />
              <span>Official Soundwaves</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-chrome tracking-tight">
              CURATED SPOTIFY PLAYLISTS
            </h2>
            <p className="mt-2 text-zinc-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Step into the frequency anywhere, anytime. Stream our official pre-festival warmups, live DJ mixes, and resident selections on Spotify.
            </p>
          </div>

          <div className="flex items-center gap-3">
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
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2">
              Select A Vibe
            </h3>
            {PLAYLISTS.map((pl) => {
              const isSelected = pl.id === activePlaylist.id;
              return (
                <button
                  key={pl.id}
                  onClick={() => setActivePlaylist(pl)}
                  className={`w-full text-left p-5 rounded-2xl transition-all border ${
                    isSelected
                      ? "bg-[#141721] border-[#1DB954]/50 shadow-xl shadow-[#1DB954]/5"
                      : "bg-black/40 border-white/5 hover:border-white/15 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                        {pl.genre}
                      </span>
                      <h4 className="font-display font-bold text-lg text-white mt-1">
                        {pl.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {pl.tagline}
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 text-zinc-400 flex-shrink-0">
                      <Play className={`w-4 h-4 ${isSelected ? "text-emerald-400 fill-current" : ""}`} />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>{pl.tracksCount}</span>
                    <span className="text-zinc-400">{pl.curator}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Embedded Spotify Player Card */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-black/60 border border-white/10 p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1DB954]/20 border border-[#1DB954]/30 flex items-center justify-center text-[#1DB954]">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-white">
                    {activePlaylist.title}
                  </h4>
                  <p className="text-xs font-mono text-zinc-400">
                    Curated by {activePlaylist.curator}
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

                <a
                  href={activePlaylist.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
                  title="Open in Spotify App"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Spotify Embed iFrame */}
            <div className="my-4 rounded-xl overflow-hidden bg-black/80 border border-white/10">
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

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
              <span>🎵 Updates weekly with tracks played by Afreqa resident & guest DJs</span>
              <a
                href="/contact?subject=BOOKING"
                className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
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

