import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Heart,
  Shield,
  Music,
  ArrowUpRight,
  Instagram,
  Radio,
  Flame,
  Volume2,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

export const metadata = {
  title: "About AFREQA | Nairobi's Tomorrowland Experience & Rave Culture",
  description:
    "Discover AFREQA Nairobi: A Tomorrowland XP. Kenya's premier festival movement playing high-velocity Hardstyle, Progressive EDM, Big Room, Hard Techno, and Afro-Tech. Learn about our 3 official social media channels, sonic manifesto, and rave ethos.",
};

const SOCIAL_PROFILES = [
  {
    platform: "Instagram",
    handle: "@afreqa_",
    url: "https://instagram.com/afreqa_",
    role: "The Visual Chronicle & Edition Portal",
    badge: "Official Gallery & Drops",
    color: "from-pink-500/20 via-purple-500/20 to-amber-500/20",
    border: "border-pink-500/30",
    textColor: "text-pink-400",
    description:
      "Our primary visual portal. Follow for high-definition festival photography, cinematic after-movies from editions like the Tomorrowland Halloween XP and New Year's Eve Festival, stage production reveals, official artist B2B announcements, and instant HustleSasa ticket tier launches.",
    stats: "Photos • After-Movies • Lineups • Tickets",
    action: "Follow on Instagram",
  },
  {
    platform: "TikTok",
    handle: "@afreqa_",
    url: "https://tiktok.com/@afreqa_",
    role: "The Raw Kinetic Pulse & Raver POV",
    badge: "High-BPM Energy & Fits",
    color: "from-cyan-500/20 via-blue-500/20 to-purple-500/20",
    border: "border-cyan-500/30",
    textColor: "text-cyan-400",
    description:
      "The unfiltered heartbeat of Nairobi rave culture. Watch 150–160 BPM bass drop reactions, viral crowd energy, festival fit checks & creative Halloween costume showcases, behind-the-decks DJ perspectives, and high-velocity dancefloor moments captured live from the front row.",
    stats: "Drops • Rave Fits • Stage POVs • Crowd Virals",
    action: "Watch on TikTok",
  },
  {
    platform: "X (Twitter)",
    handle: "@afreqa_",
    url: "https://x.com/afreqa_",
    role: "The Real-Time Frequency Wire",
    badge: "Live Bulletins & Track IDs",
    color: "from-white/10 via-zinc-500/10 to-amber-500/10",
    border: "border-white/20",
    textColor: "text-white",
    description:
      "The instant festival wire for time-sensitive announcements. Catch live timetable releases, stage schedule adjustments, gate advisories, secret B2B lineup surprises, track IDs from peak-hour sets, and direct real-time dialogue with Nairobi's electronic music community.",
    stats: "Timetables • Track IDs • Gate Alerts • Community",
    action: "Connect on X",
  },
];

const SONIC_PILLARS = [
  {
    title: "Hardstyle & Uptempo",
    bpm: "150 – 200+ BPM",
    flavor: "Distorted 909 kicks, raw reverse basslines, and euphoric festival screeches",
    reference: "Creeds, Sub Zero Project, Rebelion, Warface",
    description:
      "Pure, unrelenting kinetic velocity. We do not slow down the tempo. Hardstyle and raw uptempo kicks drive our late-night festival hours, demanding full-body commitment from the crowd and engineering peak physical catharsis under the strobe lights.",
    accent: "text-rose-400",
    border: "border-rose-500/30",
    bg: "bg-rose-500/10",
  },
  {
    title: "Progressive EDM & Anthems",
    bpm: "128 – 132 BPM",
    flavor: "Soaring melodic synth leads, emotional builds, and hands-in-the-air stadium drops",
    reference: "Avicii, Martin Garrix, Alesso, Third Party, Swedish House Mafia",
    description:
      "The euphoric emotional core of AFREQA. Drawing directly from the golden era of Tomorrowland mainstages, our selectors engineer massive sing-along crescendos that unite thousands of voices into one harmonic frequency under illuminated stage arches.",
    accent: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
  },
  {
    title: "Big Room & Stadium Electro",
    bpm: "128 – 130 BPM",
    flavor: "Sub-bass brass drops, massive percussion claps, and thunderous drops",
    reference: "Hardwell, Dimitri Vegas & Like Mike, Blasterjaxx, KSHMR",
    description:
      "Stadium-filling architectural electronic music designed for colossal sound rigs. Every drop is crafted to create earth-shaking synchronized jumps across the venue, matching the pyrotechnic bursts and synchronized cryogenic smoke sweeps.",
    accent: "text-amber-300",
    border: "border-amber-400/30",
    bg: "bg-amber-400/10",
  },
  {
    title: "Hard Techno & Industrial Rave",
    bpm: "140 – 155 BPM",
    flavor: "Relentless rolling kicks, screeching 303 acid lines, and dark nocturnal bass",
    reference: "Sara Landry, Nico Moreno, alignment with dark European warehouse sounds",
    description:
      "Nocturnal, hypnotic, and uncompromising. For ravers who crave the dark, industrial edge of electronic music, our hard techno segments turn the dancefloor into an unyielding sonic engine powered by pummeling drums and acid synthesis.",
    accent: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  {
    title: "Afro-Tech & Driving Melodic B2B",
    bpm: "124 – 128 BPM",
    flavor: "Deep percussive polyrhythms, tribal synthesis, and seamless B2B power sets",
    reference: "Coco Kahi, Mike Muema, Nayäkaze, Shock, Ryte, Z4V3",
    description:
      "Nairobi's own organic electronic muscle. Blending hypnotic African percussive rhythms with heavy tech-house basslines and high-tempo synthesis, executed as high-octane back-to-back sets where resident selectors challenge each other to build relentless momentum.",
    accent: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest shadow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>A Tomorrowland XP in Nairobi</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-none uppercase">
          WHAT <span className="text-festival-gradient">AFREQA</span> STANDS FOR
        </h1>

        <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-light">
          We are not a generic &quot;EDM in Africa&quot; experiment or standard club promoter. AFREQA is Nairobi&apos;s dedicated Tomorrowland-scale rave movement, delivering uncompromising high-velocity electronic music and monumental festival fantasy to East Africa.
        </p>
      </div>

      {/* 2. THE THREE SOCIAL PROFILES SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400 tracking-widest">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Digital Channels & Community</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            Follow the Frequency Across 3 Platforms
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            Every AFREQA social channel serves a distinct operational purpose. Connect across all three platforms to stay locked into ticket drops, live sets, and community culture:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SOCIAL_PROFILES.map((prof) => (
            <div
              key={prof.platform}
              className={`rounded-3xl bg-[#0f1117]/85 backdrop-blur-md p-6 sm:p-7 border ${prof.border} flex flex-col justify-between space-y-5 hover:scale-[1.02] transition-all duration-300 shadow-2xl relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-br ${prof.color} rounded-full blur-[70px] pointer-events-none`} />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/60 border ${prof.border} ${prof.textColor} uppercase tracking-wider`}>
                    {prof.badge}
                  </span>
                  <span className="font-mono text-xs text-zinc-400 font-bold">
                    {prof.handle}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-2xl text-white group-hover:text-amber-400 transition-colors">
                    {prof.platform}
                  </h3>
                  <p className="text-xs font-mono text-amber-400/90 mt-0.5 font-bold">
                    {prof.role}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {prof.description}
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-zinc-400">
                  <span className="text-white font-bold">Core Content:</span> {prof.stats}
                </div>
              </div>

              <div className="relative z-10 pt-2 border-t border-white/10">
                <a
                  href={prof.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition group-hover:border-amber-500/40"
                >
                  <span>{prof.action}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp & Spotify Sub-Banner */}
        <div className="rounded-2xl bg-black/60 border border-white/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-zinc-300">
              Also join our official <strong className="text-white">WhatsApp Channel</strong> for private presale ticket codes and stream warmup playlists on <strong className="text-white">Spotify</strong>.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://whatsapp.com/channel/0029VbAYtdlCcW4lOTonkS0h"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 transition font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Channel</span>
            </a>
            <Link
              href="/music"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
            >
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>Spotify Hub</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. WHAT AFREQA PLAYS: THE 5 SONIC PILLARS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400 tracking-widest">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>The Sonic Manifesto</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            What AFREQA Plays
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            No watered-down commercial pop or generic background music. Our sets are engineered for relentless kinetic momentum, high BPMs, and transcendent drops:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SONIC_PILLARS.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`rounded-3xl bg-[#0f1117]/85 backdrop-blur-md p-6 sm:p-8 border ${pillar.border} flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-all shadow-xl`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${pillar.bg} ${pillar.accent} border ${pillar.border}`}>
                    {pillar.bpm}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    Pillar 0{i + 1}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-2xl text-white">
                  {pillar.title}
                </h3>

                <p className="text-xs font-mono text-amber-400/90 leading-snug">
                  {pillar.flavor}
                </p>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light pt-1">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-500">Sound references:</span>{" "}
                <span className="text-zinc-300 font-semibold">{pillar.reference}</span>
              </div>
            </div>
          ))}

          {/* Quick link to listen on Spotify */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-500/15 via-black/80 to-[#0f1117] p-6 sm:p-8 border border-emerald-500/30 flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-widest">
                Listen Online
              </span>
              <h3 className="font-display font-extrabold text-2xl text-white">
                Stream the Official Arsenal
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                We maintain four dedicated Spotify playlists matching our core stages: HARDSTYLE & UPTEMPO, PROGRESSIVE EDM, BIG ROOM, and HARD TECHNO.
              </p>
            </div>

            <Link
              href="/music"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg hover:shadow-emerald-500/25 active:scale-95"
            >
              <span>Explore Spotify Playlists</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHAT AFREQA STANDS FOR: THE RAVE ETHOS */}
      <section className="rounded-3xl glass-panel p-8 sm:p-12 border border-white/10 relative overflow-hidden shadow-2xl space-y-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400 tracking-widest">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>The Tomorrowland Fantasy in Nairobi</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            An Unapologetic Rave Sanctuary
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            AFREQA was created to shatter the boundaries of what a music event in Kenya can be. We do not do sit-down VIP lounges with muted sound. We build full-scale festival spectacles inspired by the mythical atmosphere, synchronized pyrotechnics, and boundless joy of Tomorrowland.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="rounded-2xl bg-black/50 p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Monumental Stage Craft</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              From the industrial railway tracks of Nairobi Railway Museum to the nocturnal intimacy of Alloy Bar & Lounge, our stages feature custom architectural facades, laser arrays, and atmospheric haze.
            </p>
          </div>

          <div className="rounded-2xl bg-black/50 p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Creative Costume & PLUR</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              We champion creative costume dress codes—from our legendary Tomorrowland Halloween XP to New Year&apos;s Eve futurism. The dancefloor is an open canvas of self-expression where everyone belongs.
            </p>
          </div>

          <div className="rounded-2xl bg-black/50 p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">7PM to 6AM Continuous Journey</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              No awkward breaks or early shutdowns. Our nights are curated as continuous sonic narratives—moving from atmospheric warmups at sunset to peak-hour 160 BPM euphoria as the morning sun rises.
            </p>
          </div>
        </div>
      </section>

      {/* 5. VENDORS & PARTNERS PORTALS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-3xl glass-panel p-8 border border-white/10 space-y-4 hover:border-amber-400/30 transition-all shadow-xl">
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
            Merchant Portal
          </span>
          <h3 className="font-display font-black text-2xl text-white">
            Vend at AFREQA
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Bring your food concept, festival fashion, rave accessories, or lifestyle brand into our illuminated festival market village.
          </p>
          <div className="pt-2">
            <Link
              href="/vendors"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-white font-bold transition-colors"
            >
              <span>Explore Vendor Applications</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-3xl glass-panel p-8 border border-white/10 space-y-4 hover:border-amber-400/30 transition-all shadow-xl">
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
            Commercial Alliances
          </span>
          <h3 className="font-display font-black text-2xl text-white">
            Partner With Us
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Mainstage takeovers, experiential brand activations, pouring rights, and VIP corporate festival hospitality packages.
          </p>
          <div className="pt-2">
            <Link
              href="/partners"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-white font-bold transition-colors"
            >
              <span>View Brand Partnerships</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM CTA */}
      <div className="rounded-3xl glass-panel p-8 sm:p-12 text-center space-y-5 border border-white/10 shadow-2xl">
        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Step into the Tomorrowland Experience in Nairobi
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
          Secure tickets for our upcoming festival edition or browse past photo chronicles.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <span>Browse Festival Editions</span>
            <ArrowUpRight className="w-4 h-4 text-black" />
          </Link>
          <a
            href="https://instagram.com/afreqa_"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition border border-white/20 active:scale-95"
          >
            <Instagram className="w-4 h-4 text-pink-400" />
            <span>Follow @afreqa_</span>
          </a>
        </div>
      </div>
    </div>
  );
}
