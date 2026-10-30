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
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-12 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-afreqa-violet/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-afreqa-teal/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-afreqa-teal/40 text-afreqa-teal text-xs font-mono font-bold tracking-widest uppercase mb-8 shadow-glow-teal animate-float">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Nairobi Electronic Movement</span>
        </div>

        {/* 3D Chrome Brand Presentation */}
        <div className="relative mb-6 group cursor-default">
          <div className="relative w-32 h-32 sm:w-44 sm:h-44 mx-auto rounded-full p-1 bg-gradient-to-b from-afreqa-chrome-high/40 via-afreqa-teal/30 to-transparent shadow-2xl">
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-afreqa-chrome-high/40 shadow-glow-teal">
              <Image
                src="/brand/logo.jpg"
                alt="Afreqa Festival Emblem"
                fill
                priority
                sizes="(max-width: 768px) 128px, 176px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-chrome max-w-5xl leading-[1.05]">
          FEEL THE <span className="text-festival-gradient">FREQUENCY</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-afreqa-silver max-w-2xl mx-auto leading-relaxed font-light">
          Nairobi&apos;s sanctuary for electronic music lovers. Tomorrowland-inspired fantasy meets raw African percussive rhythms.
        </p>

        {/* Live Countdown to Next Gathering */}
        <div className="mt-10 mb-8">
          <CountdownTimer targetDate={event.date} eventTitle={event.title} />
        </div>

        {/* Hero CTA cluster */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link
            href={`/go/tickets/${event.slug}?placement=hero`}
            className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-afreqa-teal via-afreqa-violet to-afreqa-teal bg-[length:200%_auto] text-afreqa-shadow font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-glow-teal hover:scale-105 transition-all duration-300"
          >
            <Ticket className="w-5 h-5 text-afreqa-shadow" />
            <span>Get Tickets via HustleSasa</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="#spotlight"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-full glass-panel hover:border-afreqa-teal/50 text-afreqa-chrome-high font-semibold text-sm sm:text-base tracking-wide transition-all"
          >
            <span>Explore Lineup & Venue</span>
            <ArrowRight className="w-4 h-4 text-afreqa-teal" />
          </Link>
        </div>
      </section>

      {/* 2. NEXT GATHERING SPOTLIGHT */}
      <section id="spotlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-28">
        <div className="rounded-3xl glass-panel p-6 sm:p-10 lg:p-12 relative overflow-hidden border border-afreqa-chrome-high/15 shadow-metallic">
          {/* Ambient Corner Flare */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-afreqa-teal/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-afreqa-chrome-high/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-afreqa-teal uppercase mb-2">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Next Official Edition</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-chrome">
                {event.title}
              </h2>
              <p className="mt-2 text-afreqa-silver max-w-xl text-sm sm:text-base">
                {event.description}
              </p>
            </div>

            {/* Event Meta Badges */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-afreqa-silver">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/10">
                <Calendar className="w-4 h-4 text-afreqa-teal" />
                <span>{new Date(event.date).toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/10">
                <MapPin className="w-4 h-4 text-afreqa-violet" />
                <span>{event.venueName}</span>
              </div>
            </div>
          </div>

          {/* Ticket Phase Tracker Strip */}
          <div className="py-10">
            <h3 className="font-mono text-xs uppercase tracking-widest text-afreqa-silver font-semibold mb-6 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-afreqa-teal" />
              <span>Official Ticket Tiers (HustleSasa Live Inventory)</span>
            </h3>
            <TicketPhaseStrip phases={phases} eventSlug={event.slug} />
          </div>

          {/* Lineup Spotlight Grid */}
          <div className="pt-8 border-t border-afreqa-chrome-high/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-afreqa-chrome-high">
                  Sonic Architects
                </h3>
                <p className="text-xs font-mono text-afreqa-silver-mid mt-0.5">
                  [Sample Showcase Lineup • Real Afreqa Artists Announced Soon]
                </p>
              </div>
              <Link
                href={`/events/${event.slug}`}
                className="text-xs font-mono text-afreqa-teal hover:text-afreqa-chrome-high flex items-center gap-1 transition-colors"
              >
                <span>Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FICTIONAL_DJS.map((dj) => (
                <div
                  key={dj.name}
                  className="rounded-2xl glass-panel p-5 border border-afreqa-chrome-high/10 hover:border-afreqa-teal/40 transition-all duration-300 group hover:-translate-y-1.5"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 border border-afreqa-chrome-high/10">
                    <Image
                      src={dj.image}
                      alt={dj.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-afreqa-shadow/80 backdrop-blur-md text-afreqa-teal border border-afreqa-teal/30">
                      {dj.time}
                    </div>
                  </div>
                  <h4 className="font-display font-bold text-lg text-afreqa-chrome-high group-hover:text-afreqa-teal transition-colors">
                    {dj.name}
                  </h4>
                  <p className="text-xs font-mono text-afreqa-teal mt-0.5">
                    {dj.genre}
                  </p>
                  <p className="text-xs text-afreqa-silver mt-2 line-clamp-2">
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
          <span className="font-mono text-xs font-bold tracking-widest text-afreqa-teal uppercase">
            The Frequency Standard
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-chrome mt-2">
            Tomorrowland Fantasy. African Soul.
          </h2>
          <p className="mt-4 text-afreqa-silver text-sm sm:text-base leading-relaxed">
            Every Afreqa edition is designed as an all-encompassing sensorial ritual, fusing monumental stage production with Nairobi&apos;s unmatched electronic groove.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="rounded-2xl glass-panel p-6 border border-afreqa-chrome-high/10 hover:border-afreqa-teal/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-afreqa-teal/15 text-afreqa-teal flex items-center justify-center mb-5 border border-afreqa-teal/30 shadow-glow-teal">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-afreqa-chrome-high mb-2">
              Laser & Visual Architecture
            </h3>
            <p className="text-xs sm:text-sm text-afreqa-silver leading-relaxed">
              Custom-engineered light beams, synchronized LED structures, and atmospheric haze designed to transport dancers into a futuristic dreamscape.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl glass-panel p-6 border border-afreqa-chrome-high/10 hover:border-afreqa-violet/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-afreqa-violet/15 text-afreqa-violet flex items-center justify-center mb-5 border border-afreqa-violet/30 shadow-glow-violet">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-afreqa-chrome-high mb-2">
              Deep Sub-Bass Clarity
            </h3>
            <p className="text-xs sm:text-sm text-afreqa-silver leading-relaxed">
              Precision-tuned acoustic engineering so every Afro-Tech polyrhythm and melodic bass drop resonates directly in your chest with zero harsh distortion.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl glass-panel p-6 border border-afreqa-chrome-high/10 hover:border-afreqa-gold/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-afreqa-gold/15 text-afreqa-gold flex items-center justify-center mb-5 border border-afreqa-gold/30 shadow-glow-amber">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-afreqa-chrome-high mb-2">
              Safe & Unified Dancefloor
            </h3>
            <p className="text-xs sm:text-sm text-afreqa-silver leading-relaxed">
              Strict zero-tolerance harassment policies, professional venue security, on-site medics, and an ethos where everyone dances freely as one tribe.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="rounded-2xl glass-panel p-6 border border-afreqa-chrome-high/10 hover:border-afreqa-teal/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-afreqa-teal/15 text-afreqa-teal flex items-center justify-center mb-5 border border-afreqa-teal/30 shadow-glow-teal">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-afreqa-chrome-high mb-2">
              African Percussive Soul
            </h3>
            <p className="text-xs sm:text-sm text-afreqa-silver leading-relaxed">
              Championing Kenya, South Africa, and East Africa&apos;s electronic producers. From tribal rhythms to modern progressive synthesis.
            </p>
          </div>
        </div>
      </section>

      {/* 4. AUDIENCE CAPTURE & INNER CIRCLE */}
      <SubscribeSection />

      {/* 5. WHATSAPP & COMMUNITY CALLOUT (CHEAPEST FIRST) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-r from-afreqa-midnight to-afreqa-stage border border-afreqa-teal/30 shadow-glow-teal text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-afreqa-teal/15 text-afreqa-teal text-xs font-mono font-bold tracking-wider uppercase">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Direct WhatsApp Channel</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-afreqa-chrome-high">
              Never Miss A Secret Drop
            </h3>
            <p className="text-sm text-afreqa-silver leading-relaxed">
              Join the official Afreqa WhatsApp broadcast community for instant ticket drop links, secret after-parties, and exclusive artist announcements.
            </p>
          </div>

          <a
            href="https://chat.whatsapp.com/sample-afreqa-community"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-afreqa-teal hover:bg-afreqa-teal/90 text-afreqa-shadow font-extrabold text-sm uppercase tracking-wider transition-all shadow-glow-teal hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join WhatsApp Community</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 5. QUICK FAQ TEASER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <span className="font-mono text-xs font-bold tracking-widest text-afreqa-teal uppercase">
            Essentials
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-chrome mt-1">
            Gate & Admission FAQ
          </h2>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl glass-panel p-5 border border-afreqa-chrome-high/10">
            <h4 className="font-display font-bold text-base text-afreqa-chrome-high">
              What is the minimum age to attend?
            </h4>
            <p className="text-xs sm:text-sm text-afreqa-silver mt-2 leading-relaxed">
              Afreqa is strictly 18+. Government-issued physical ID (National ID, Passport, or Valid Driver’s License) will be verified at gate entry. Digital photocopies are not accepted.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-5 border border-afreqa-chrome-high/10">
            <h4 className="font-display font-bold text-base text-afreqa-chrome-high">
              Where can I buy official tickets?
            </h4>
            <p className="text-xs sm:text-sm text-afreqa-silver mt-2 leading-relaxed">
              Official tickets are sold exclusively through our verified HustleSasa store. Tickets come with a cryptographic QR code scanned at the turnstiles. Never buy tickets from unauthorized third-party brokers.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-5 border border-afreqa-chrome-high/10">
            <h4 className="font-display font-bold text-base text-afreqa-chrome-high">
              Are pass-outs (re-entry) allowed?
            </h4>
            <p className="text-xs sm:text-sm text-afreqa-silver mt-2 leading-relaxed">
              For security reasons, pass-outs are strictly not permitted. Once your ticket QR code is scanned and you exit the festival perimeter, re-entry requires a new valid ticket.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-afreqa-teal hover:text-afreqa-chrome-high transition-colors font-semibold"
          >
            <span>View All Prohibited Items, Parking & Venue Guidelines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
