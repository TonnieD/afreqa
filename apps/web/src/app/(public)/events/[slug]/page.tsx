import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  ArrowUpRight,
  Download,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import { db } from "@afreqa/core";
import { CountdownTimer } from "@/components/festival/CountdownTimer";
import { TicketPhaseStrip } from "@/components/festival/TicketPhaseStrip";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { slug } = await params;
  try {
    const event = await db.event.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      select: { title: true, tagline: true, description: true },
    });
    if (event) {
      return {
        title: event.title,
        description: event.tagline || event.description?.slice(0, 160),
      };
    }
  } catch {
    // fallback
  }

  return {
    title: "Afreqa: Resonance",
    description: "Where African Electronic Frequencies Meet Festival Fantasy in Nairobi.",
  };
}

interface EventDetail {
  id: string;
  title: string;
  slug: string;
  tagline?: string | null;
  date: Date | string;
  venueName: string;
  venueAddress?: string | null;
  doorsOpen?: string | null;
  agePolicy?: string | null;
  description?: string | null;
  ticketPhases: Array<{
    id: string;
    name: string;
    priceKes?: number | null;
    status: string;
  }>;
  lineup: Array<{
    id: string;
    stageName?: string | null;
    setStartTime?: string | null;
    setEndTime?: string | null;
    artist: {
      name: string;
      genres: string[];
      bio?: string | null;
      photoUrl?: string | null;
    };
  }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;

  let event: EventDetail | null = null;

  try {
    event = await db.event.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: {
        ticketPhases: { orderBy: { sortOrder: "asc" } },
        lineup: {
          orderBy: { sortOrder: "asc" },
          include: { artist: true },
        },
      },
    });
  } catch {
    // DB error fallback
  }

  // Showcase fallback data if event slug matches resonance or DB is not seeded
  if (!event && (slug === "resonance" || slug === "evt-resonance-001")) {
    event = {
      id: "evt-resonance-001",
      title: "Afreqa: Resonance",
      slug: "resonance",
      tagline: "Where African Electronic Frequencies Meet Festival Fantasy",
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      venueName: "The Carnivore Grounds / Waterfront Karen",
      venueAddress: "Nairobi, Kenya",
      doorsOpen: "18:00 EAT",
      agePolicy: "Strict 18+ Government ID Required",
      description:
        "Afreqa returns with our flagship outdoor festival experience: Resonance. Over twelve continuous hours, experience cutting-edge stage production, mind-altering laser architecture, and hypnotic electronic soundwaves from Nairobi and beyond.",
      ticketPhases: [
        { id: "p1", name: "Early Bird", priceKes: 1500, status: "SOLD_OUT" },
        { id: "p2", name: "Phase 1", priceKes: 2000, status: "ON_SALE" },
        { id: "p3", name: "VIP Deck", priceKes: 3500, status: "ON_SALE" },
        { id: "p4", name: "Gate Release", priceKes: 4000, status: "UPCOMING" },
      ],
      lineup: [
        {
          id: "l1",
          stageName: "Main Stage",
          setStartTime: "02:00",
          setEndTime: "04:00",
          artist: {
            name: "DJ Nova Rift",
            genres: ["Afro-Tech", "Melodic Techno"],
            bio: "Hypnotic synth lines woven with heavy polyrhythms.",
            photoUrl: "/brand/logo.jpg",
          },
        },
        {
          id: "l2",
          stageName: "Main Stage",
          setStartTime: "00:00",
          setEndTime: "02:00",
          artist: {
            name: "Kazi Pulse",
            genres: ["Deep Melodic House"],
            bio: "Atmospheric, euphoric chord progressions for midnight transcendence.",
            photoUrl: "/brand/logo.jpg",
          },
        },
        {
          id: "l3",
          stageName: "Main Stage",
          setStartTime: "22:00",
          setEndTime: "00:00",
          artist: {
            name: "Zuri Bass",
            genres: ["Amapiano / EDM Fusion"],
            bio: "Heavy log-drums fused with high-octane mainstage kicks.",
            photoUrl: "/brand/logo.jpg",
          },
        },
        {
          id: "l4",
          stageName: "Main Stage",
          setStartTime: "20:00",
          setEndTime: "22:00",
          artist: {
            name: "Solar Soundwave",
            genres: ["Progressive Tribal House"],
            bio: "Sunset beats bridging daylight into nocturnal festival ritual.",
            photoUrl: "/brand/logo.jpg",
          },
        },
      ],
    };
  }

  if (!event) {
    notFound();
  }

  const phaseStripData = (event.ticketPhases || []).map((tp) => ({
    id: tp.id,
    name: tp.name,
    price: tp.priceKes,
    currency: "KES",
    status: tp.status as "ON_SALE" | "SOLD_OUT" | "UPCOMING",
  }));

  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${event.venueName}, ${event.venueAddress || "Nairobi, Kenya"}`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. HERO HEADER */}
      <div className="rounded-3xl bg-[#0f1117]/90 backdrop-blur-md p-6 sm:p-12 relative overflow-hidden border border-white/10 shadow-2xl">
        {/* Background crowd image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/afreqa-live-crowd.jpg"
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-25 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-[#0f1117]/80 to-transparent" />
        </div>

        {/* Warm Stage Embers */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-400 border border-amber-400/30 text-xs font-mono font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
            <span>Official Festival Gathering</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-6xl text-white tracking-tight">
            {event.title}
          </h1>

          {event.tagline && (
            <p className="mt-3 text-base sm:text-xl text-zinc-300 font-normal">
              {event.tagline}
            </p>
          )}

          {/* Meta strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 font-mono text-xs sm:text-sm text-zinc-300">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{new Date(event.date).toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Doors: {event.doorsOpen || "18:00 EAT"}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span>{event.venueName}</span>
            </span>
          </div>

          {/* Countdown */}
          <div className="my-8 w-full max-w-md">
            <CountdownTimer targetDate={new Date(event.date).toISOString()} eventTitle={event.title} />
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/go/tickets/${event.slug}?placement=event_detail`}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>Get Tickets via HustleSasa</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <a
              href={`/events/${event.slug}/calendar.ics`}
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-semibold uppercase tracking-wider transition-all"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Add to Calendar (.ics)</span>
            </a>

            <a
              href={mapSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-semibold uppercase tracking-wider transition-all"
            >
              <Navigation className="w-4 h-4 text-zinc-400" />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. TICKET PHASES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-afreqa-chrome-high">
              Admission Tiers & Inventory
            </h2>
            <p className="text-xs font-mono text-afreqa-silver-mid mt-0.5">
              Live status synchronized with HustleSasa ticketing inventory
            </p>
          </div>
        </div>
        <TicketPhaseStrip phases={phaseStripData} eventSlug={event.slug} />
      </section>

      {/* 3. LINEUP & SET TIMES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-afreqa-chrome-high">
              Festival Lineup & Set Times
            </h2>
            <p className="text-xs font-mono text-afreqa-silver-mid mt-0.5">
              [Showcase Lineup: Strictly fictional sample artists for demo purposes]
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(event.lineup || []).map((slot) => (
            <div
              key={slot.id}
              className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md p-6 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-amber-400/40 transition-all"
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                <Image
                  src={slot.artist?.photoUrl || "/brand/logo.jpg"}
                  alt={slot.artist?.name || "Artist"}
                  fill
                  sizes="96px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 text-amber-400 border border-amber-400/30">
                    {slot.stageName || "Main Stage"}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {slot.setStartTime} – {slot.setEndTime}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-white group-hover:text-amber-400 transition-colors">
                  {slot.artist?.name}
                </h3>

                <p className="text-xs font-mono text-amber-400/90">
                  {(slot.artist?.genres || []).join(" • ")}
                </p>

                {slot.artist?.bio && (
                  <p className="text-xs text-zinc-300 pt-1 leading-relaxed line-clamp-2">
                    {slot.artist.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. VENUE & GATE POLICIES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Venue Info */}
        <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-8 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-bold tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Venue & Transport</span>
          </div>
          <h3 className="font-display font-extrabold text-2xl text-white">
            {event.venueName}
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed font-normal">
            Located at {event.venueAddress || "Nairobi, Kenya"}. Ample secure parking is available on-site with dedicated security guards. We strongly recommend using rideshare options (Uber / Bolt) with our designated drop-off and pickup portal.
          </p>
          <div className="pt-2">
            <a
              href={mapSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:underline font-semibold"
            >
              <span>Open in Google Maps Navigation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Gate Policy Checklist */}
        <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-8 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-bold tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Essential Gate Protocol</span>
          </div>
          <h3 className="font-display font-extrabold text-2xl text-white">
            Admission Requirements
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300 font-normal">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Strict 18+ Age Limit:</strong> Original physical ID, passport, or driving license required.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>No Pass-Outs:</strong> Re-entry is not permitted once scanned inside.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Prohibited Items:</strong> No outside food, drinks, weapons, or illegal substances. Full security pat-down and metal detection at turnstiles.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
