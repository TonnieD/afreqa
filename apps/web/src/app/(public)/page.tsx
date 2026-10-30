import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Ticket,
  ArrowUpRight,
  Calendar,
  MapPin,
  Sparkles,
  Music,
  ShieldCheck,
  Zap,
  Radio,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { db } from "@afreqa/core";
import { CountdownTimer } from "@/components/festival/CountdownTimer";
import { TicketPhaseStrip } from "@/components/festival/TicketPhaseStrip";
import { SubscribeSection } from "@/components/festival/SubscribeSection";

// Fallback seed data in case database is freshly booting
const FALLBACK_EVENT = {
  id: "evt-resonance-001",
  title: "Afreqa: Resonance",
  slug: "resonance",
  tagline: "Where African Electronic Frequencies Meet Festival Fantasy",
  date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  venueName: "The Carnivore Grounds / Waterfront Karen",
  venueAddress: "Nairobi, Kenya",
  doorsOpen: "18:00 EAT",
  description:
    "Step into Nairobi's premier electronic music sanctuary. Twelve hours of transcendent sound, futuristic stage architecture, and euphoric rhythms uniting Africa's brightest electronic pioneers.",
};

interface PhaseItem {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  status: "ON_SALE" | "SOLD_OUT" | "UPCOMING";
  description?: string | null;
}

const FALLBACK_PHASES: PhaseItem[] = [
  {
    id: "p1",
    name: "Early Bird",
    price: 1500,
    currency: "KES",
    status: "SOLD_OUT",
    description: "Limited inaugural allocation",
  },
  {
    id: "p2",
    name: "Phase 1 General",
    price: 2000,
    currency: "KES",
    status: "ON_SALE",
    description: "Full event admission + festival access",
  },
  {
    id: "p3",
    name: "VIP Stage Deck",
    price: 3500,
    currency: "KES",
    status: "ON_SALE",
    description: "Elevated stage deck, express queue & private bar",
  },
  {
    id: "p4",
    name: "Gate Release",
    price: 4000,
    currency: "KES",
    status: "UPCOMING",
    description: "Available only if capacity permits",
  },
];

const FICTIONAL_DJS = [
  {
    name: "DJ Nova Rift",
    genre: "Afro-Tech & Melodic Techno",
    time: "02:00 – 04:00",
    image: "/brand/logo.jpg",
    bio: "Pioneering hypnotic polyrhythms fused with heavy analog synthesizer basslines.",
  },
  {
    name: "Kazi Pulse",
    genre: "Deep Melodic House",
    time: "00:00 – 02:00",
    image: "/brand/logo.jpg",
    bio: "Atmospheric, euphoric chord progressions that lift midnight festival crowds.",
  },
  {
    name: "Zuri Bass",
    genre: "Amapiano / EDM Fusion",
    time: "22:00 – 00:00",
    image: "/brand/logo.jpg",
    bio: "High-octane log-drums woven with mainstage festival energy.",
  },
  {
    name: "Solar Soundwave",
    genre: "Progressive & Tribal House",
    time: "20:00 – 22:00",
    image: "/brand/logo.jpg",
    bio: "Warm sunset grooves transitioning Nairobi into the dark electronic realm.",
  },
];

export default async function HomePage() {
  let event = FALLBACK_EVENT;
  let phases = FALLBACK_PHASES;

  try {
    const dbEvent = await db.event.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { date: "asc" },
      include: {
        ticketPhases: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (dbEvent) {
      event = {
        id: dbEvent.id,
        title: dbEvent.title,
        slug: dbEvent.slug,
        tagline: dbEvent.tagline || FALLBACK_EVENT.tagline,
        date: dbEvent.date.toISOString(),
        venueName: dbEvent.venueName,
        venueAddress: dbEvent.venueAddress || FALLBACK_EVENT.venueAddress,
        doorsOpen: dbEvent.doorsOpen || FALLBACK_EVENT.doorsOpen,
        description: dbEvent.description || FALLBACK_EVENT.description,
      };

      if (dbEvent.ticketPhases.length > 0) {
        phases = dbEvent.ticketPhases.map((tp) => ({
          id: tp.id,
          name: tp.name,
          price: tp.priceKes,
          currency: "KES",
          status: tp.status as "ON_SALE" | "SOLD_OUT" | "UPCOMING",
          description: null,
        }));
      }
    }
  } catch {
    // Fall back to seeded mock data
  }

  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-24">
      {/* 1. CINEMATIC HERO SECTION WITH LIVE EVENT COVER */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-16 pb-20 overflow-hidden">
        {/* Authentic Live Crowd & Stage Cover Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/images/afreqa-live-crowd.jpg"
            alt="Afreqa Live Festival Crowd & Stage"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.75] contrast-[1.10]"
          />
          {/* Deep Filmic Scrims for Strong Headline Contrast while keeping crowd vivid */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/75 via-[#070709]/35 to-[#070709]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#070709_90%)] opacity-70" />
          
          {/* Warm Stage Tungsten Ambient Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Content Container (Layered above Cover Image) */}
        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-md text-amber-400 text-xs font-mono font-bold tracking-widest uppercase mb-8 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Nairobi Electronic Movement • Official Gathering</span>
          </div>

          {/* Afreqa Emblem */}
          <div className="relative mb-6 group cursor-default">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full p-1 bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl">
              <div className="relative w-full h-full rounded-full overflow-hidden border border-white/30">
                <Image
                  src="/brand/logo.jpg"
                  alt="Afreqa Festival Emblem"
                  fill
                  priority
                  sizes="112px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white max-w-5xl leading-[1.05] drop-shadow-md">
            FEEL THE <span className="text-festival-gradient">FREQUENCY</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-light drop-shadow">
            Nairobi&apos;s home for electronic dance music. Where African percussive rhythms meet futuristic sound and monumental stage architecture.
          </p>

          {/* Next Edition Meta Bar */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md font-mono text-xs text-zinc-300">
            <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              {event.title}
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              {new Date(event.date).toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {event.venueName}
            </span>
          </div>

          {/* Live Countdown to Next Gathering */}
          <div className="mt-8 mb-8">
            <CountdownTimer targetDate={event.date} eventTitle={event.title} />
          </div>

          {/* Hero CTA cluster */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <Link
              href={`/go/tickets/${event.slug}?placement=hero`}
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
            >
              <Ticket className="w-5 h-5 text-black" />
              <span>Get Tickets via HustleSasa</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="#spotlight"
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base tracking-wide backdrop-blur-md transition-all active:scale-95"
            >
              <span>Explore Lineup & Venue</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. NEXT GATHERING SPOTLIGHT */}
      <section id="spotlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-28">
        <div className="rounded-3xl glass-panel p-6 sm:p-10 lg:p-12 relative overflow-hidden border border-white/10 shadow-2xl">
          {/* Subtle Warm Stage Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-afreqa-amber/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-2">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Next Official Edition</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-chrome">
                {event.title}
              </h2>
              <p className="mt-2 text-zinc-400 max-w-xl text-sm sm:text-base leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Event Meta Badges */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-300">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{new Date(event.date).toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span>{event.venueName}</span>
              </div>
            </div>
          </div>

          {/* Ticket Phase Tracker Strip */}
          <div className="py-10">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-6 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>Official Ticket Tiers (HustleSasa Live Inventory)</span>
            </h3>
            <TicketPhaseStrip phases={phases} eventSlug={event.slug} />
          </div>

          {/* Lineup Spotlight Grid */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-white">
                  Sonic Architects
                </h3>
                <p className="text-xs font-mono text-zinc-500 mt-0.5">
                  [Sample Showcase Lineup • Real Afreqa Artists Announced Soon]
                </p>
              </div>
              <Link
                href={`/events/${event.slug}`}
                className="text-xs font-mono text-amber-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FICTIONAL_DJS.map((dj) => (
                <div
                  key={dj.name}
                  className="rounded-2xl glass-panel p-5 border border-white/10 hover:border-amber-500/40 transition-all duration-300 group hover:-translate-y-1.5"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/40">
                    <Image
                      src={dj.image}
                      alt={dj.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                      {dj.time}
                    </div>
                  </div>
                  <h4 className="font-display font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    {dj.name}
                  </h4>
                  <p className="text-xs font-mono text-amber-400/90 mt-0.5">
                    {dj.genre}
                  </p>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {dj.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE AFREQA EXPERIENCE (4 PILLARS) */}
      <section id="experience" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold tracking-widest text-amber-400 uppercase">
            The Frequency Standard
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-chrome mt-2">
            Tomorrowland Fantasy. African Soul.
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Every Afreqa edition is designed as an all-encompassing sensorial ritual, fusing monumental stage production with Nairobi&apos;s unmatched electronic groove.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Atmospheric Stage Architecture
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Custom-engineered light installations, synchronized stage visuals, and atmospheric haze designed to transport dancers into a futuristic dreamscape.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Deep Sub-Bass Clarity
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Precision-tuned acoustic engineering so every Afro-Tech polyrhythm and melodic bass drop resonates directly in your chest with zero harsh distortion.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Safe & Unified Dancefloor
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Strict zero-tolerance harassment policies, professional venue security, on-site medics, and an ethos where everyone dances freely as one tribe.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="rounded-2xl glass-panel p-6 border border-white/10 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              African Percussive Soul
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Championing Kenya, South Africa, and East Africa&apos;s electronic producers. From tribal rhythms to modern progressive synthesis.
            </p>
          </div>
        </div>
      </section>

      {/* 4. AUDIENCE CAPTURE & INNER CIRCLE */}
      <SubscribeSection />

      {/* 5. WHATSAPP & COMMUNITY CALLOUT (CHEAPEST FIRST) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-r from-afreqa-midnight to-afreqa-stage border border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Direct WhatsApp Channel</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Never Miss A Secret Drop
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Join the official Afreqa WhatsApp broadcast community for instant ticket drop links, secret after-parties, and exclusive artist announcements.
            </p>
          </div>

          <a
            href="https://chat.whatsapp.com/sample-afreqa-community"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2.5 px-7 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-black" />
            <span>Join WhatsApp Community</span>
            <ArrowUpRight className="w-4 h-4 text-black" />
          </a>
        </div>
      </section>

      {/* 6. QUICK FAQ TEASER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <span className="font-mono text-xs font-bold tracking-widest text-amber-400 uppercase">
            Essentials
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-chrome mt-1">
            Gate & Admission FAQ
          </h2>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl glass-panel p-5 border border-white/10">
            <h4 className="font-display font-bold text-base text-white">
              What is the minimum age to attend?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              Afreqa is strictly 18+. Government-issued physical ID (National ID, Passport, or Valid Driver’s License) will be verified at gate entry. Digital photocopies are not accepted.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-5 border border-white/10">
            <h4 className="font-display font-bold text-base text-white">
              Where can I buy official tickets?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              Official tickets are sold exclusively through our verified HustleSasa store. Tickets come with a cryptographic QR code scanned at the turnstiles. Never buy tickets from unauthorized third-party brokers.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-5 border border-white/10">
            <h4 className="font-display font-bold text-base text-white">
              Are pass-outs (re-entry) allowed?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              For security reasons, pass-outs are strictly not permitted. Once your ticket QR code is scanned and you exit the festival perimeter, re-entry requires a new valid ticket.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-white transition-colors font-semibold"
          >
            <span>View All Prohibited Items, Parking & Venue Guidelines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
