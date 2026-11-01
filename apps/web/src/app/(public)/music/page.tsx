import React from "react";
import Link from "next/link";
import { Headphones, Radio, Sparkles, Disc, Flame, ArrowUpRight, ExternalLink, Play } from "lucide-react";
import { SpotifySection } from "@/components/festival/SpotifySection";
import { TrackOfTheWeek } from "@/components/festival/TrackOfTheWeek";
import { PLAYLISTS } from "@/lib/spotify";

export const metadata = {
  title: "Official Playlists & Music | Afreqa Nairobi",
  description:
    "Stream official Afreqa festival warmup playlists, Afro-Tech live sets, and curated electronic dance selections on Spotify.",
};

export default function MusicPage() {
  return (
    <div className="space-y-16 pb-24 pt-8">
      {/* 1. Header Banner */}
      <section className="text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-4">
          <Headphones className="w-3.5 h-3.5" />
          <span>Afreqa Sound Archive</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight">
          SOUNDS OF THE <span className="text-festival-gradient">TRIBE</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
          Immerse yourself in Nairobi&apos;s electronic pulse. From hypnotic Afro-Tech progressions to peak-time rave anthems, stream the curated frequencies anytime on Spotify.
        </p>
      </section>

      {/* 2. Track of the Week Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <TrackOfTheWeek />
      </section>

      {/* 3. Main Spotify Interactive Section */}
      <div className="w-full">
        <SpotifySection />
      </div>

      {/* 4. All Official Playlists Direct Access Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <h2 className="font-display font-bold text-xl text-white uppercase tracking-wide">
              All Official Playlists ({PLAYLISTS.length})
            </h2>
          </div>
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition"
          >
            <span>Open Spotify Web & Mobile App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLAYLISTS.map((pl, idx) => (
            <div
              key={pl.id}
              className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md border border-white/10 p-6 flex flex-col justify-between gap-5 hover:border-emerald-500/30 transition-all shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                    {pl.genre}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    Playlist 0{idx + 1}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  {pl.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {pl.tagline}
                </p>
              </div>

              {/* Individual Spotify Mini Player */}
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/60">
                <iframe
                  title={pl.title}
                  src={`https://open.spotify.com/embed/${pl.spotifyUri}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs font-mono text-zinc-500">
                  {pl.curator}
                </span>
                <a
                  href={pl.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold transition active:scale-95"
                >
                  <span>Open Playlist</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Community Playlist Submission Callout */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-10 relative overflow-hidden bg-gradient-to-r from-[#0d1512] via-[#0f1117] to-[#12111d] border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <Disc className="w-3.5 h-3.5" />
              <span>Are You An Electronic Producer or DJ?</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-white">
              Submit Your Tracks to Afreqa Playlists
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              We spotlight upcoming Kenyan and African electronic talent. Submit your original Afro-House, Melodic Techno, or Amapiano-EDM productions for consideration in our monthly curator drops.
            </p>
          </div>

          <Link
            href="/contact?subject=ARTIST_SUBMISSION"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <span>Submit Track / Demo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
