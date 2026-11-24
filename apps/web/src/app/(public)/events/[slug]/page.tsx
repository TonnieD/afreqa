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
  Radio,
  Sparkles,
  Music,
  Camera,
} from "lucide-react";
import { db } from "@afreqa/core";
import { CountdownTimer } from "@/components/festival/CountdownTimer";
import { TicketPhaseStrip } from "@/components/festival/TicketPhaseStrip";
import { parseEventMetadata } from "@/lib/event-metadata";
import { parseArtistFraming } from "@/lib/artist-framing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    description: "Where Electronic Festival Fantasy Meets Nairobi.",
  };
}

interface EventDetail {
  id: string;
  title: string;
  slug: string;
  tagline?: string | null;
  posterUrl?: string | null;
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
    description?: string | null;
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

  // Showcase fallback data if event slug matches or DB is not seeded
  if (!event && (slug === "tomorrowland-nye" || slug === "nye-festival" || slug === "evt-nye-2026" || slug === "nye-2026")) {
    event = {
      id: "evt-nye-2026",
      title: "Nairobi's Ultimate Tomorrowland New Year's Eve Festival",
      slug: slug,
      tagline: "Nairobi's Ultimate Tomorrowland New Year's Eve Festival • The Grand 2026 Countdown",
      posterUrl: "/images/afreqa-nye-banner.jpg",
      date: new Date("2026-12-31T18:00:00+03:00"),
      venueName: "Parklands Road, Westlands",
      venueAddress: "Westlands, Nairobi, Kenya",
      doorsOpen: "18:00 EAT (6PM – 6AM)",
      agePolicy: "Strict 18+ Government ID Required",
      description:
        "Afreqa presents Nairobi's Ultimate Tomorrowland New Year's Eve Festival. Step into the monumental 2026 midnight countdown with high-velocity electronic dance music, massive stage architecture, and Nairobi's finest soundsystem. Official tickets live on HustleSasa.",
      ticketPhases: [
        { id: "p1", name: "Early Bird Rave Pass", priceKes: 1500, status: "ON_SALE", description: "Standard NYE Festival Admission • 6PM till 6AM" },
        { id: "p2", name: "Advance Ticket", priceKes: 2500, status: "ON_SALE", description: "Guaranteed NYE entry • Fast-track turnstile access" },
        { id: "p3", name: "VIP Festival Pass", priceKes: 5000, status: "ON_SALE", description: "Elevated stage platform • Private bar & premium amenities" },
      ],
      lineup: [
        {
          id: "nye-l1",
          stageName: "Tomorrowland Mainstage",
          setStartTime: "23:30",
          setEndTime: "02:00",
          artist: {
            name: "Afreqa Soundsystem (Grand NYE Countdown)",
            genres: ["Progressive EDM", "Big Room", "Hardstyle"],
            bio: "The official midnight transition set with synchronized pyrotechnics, laser displays, and anthems.",
            photoUrl: "/images/afreqa-nye-banner.jpg",
          },
        },
        {
          id: "nye-l2",
          stageName: "Tomorrowland Mainstage",
          setStartTime: "21:30",
          setEndTime: "23:30",
          artist: {
            name: "Special Guest Headliner",
            genres: ["Melodic Techno", "Techno"],
            bio: "Peak-hour high-tempo techno and progressive basslines.",
            photoUrl: "/images/afreqa-nye-banner.jpg",
          },
        },
        {
          id: "nye-l3",
          stageName: "Sound Garden Stage",
          setStartTime: "19:00",
          setEndTime: "21:30",
          artist: {
            name: "Nairobi Raves Collective",
            genres: ["Uptempo", "Hardstyle"],
            bio: "Setting the frequency as dancers enter the festival grounds.",
            photoUrl: "/images/afreqa-nye-banner.jpg",
          },
        },
      ],
    };
  }

  if (!event && (slug === "resonance" || slug === "halloween-alloy" || slug === "evt-resonance-001" || slug === "evt-halloween-alloy-001")) {
    event = {
      id: "evt-halloween-alloy-001",
      title: "Afreqa Nairobi: A Tomorrowland Halloween XP",
      slug: slug,
      tagline: "A Tomorrowland Halloween Experience • Alloy Bar & Lounge",
      posterUrl: "/images/afreqa-halloween-alloy.jpg",
      date: new Date("2026-10-24T19:00:00+03:00"),
      venueName: "Alloy Bar & Lounge",
      venueAddress: "Nairobi, Kenya",
      doorsOpen: "19:00 EAT (7PM – 5AM)",
      agePolicy: "Strict 18+ Government ID Required",
      description:
        "Afreqa presents A Tomorrowland Halloween XP at Alloy Bar & Lounge. High-energy electronic dance music, mind-altering production, and monumental B2B sets. Dress Code: Halloween Creative Costumes.\n\n<!-- PHOTOS_URL: https://drive.google.com/drive/folders/1EKHSU4PsGTeNACb7GM6ST-mGbslRuiKA -->",
      ticketPhases: [
        { id: "p1", name: "Rave Pass", priceKes: 1000, status: "ON_SALE" },
        { id: "p2", name: "Advance Ticket", priceKes: 1500, status: "ON_SALE" },
      ],
      lineup: [
        {
          id: "l1",
          stageName: "Alloy Mainstage",
          setStartTime: "02:00",
          setEndTime: "04:00",
          artist: {
            name: "Coco Kahi B2B Mike Muema",
            genres: ["Melodic Techno", "Progressive House"],
            bio: "Headline B2B set weaving hypnotic synthesizer progressions with heavy club kicks.",
            photoUrl: "/images/afreqa-halloween-alloy.jpg",
          },
        },
        {
          id: "l2",
          stageName: "Alloy Mainstage",
          setStartTime: "00:30",
          setEndTime: "02:00",
          artist: {
            name: "Nayäkaze",
            genres: ["Deep Melodic House"],
            bio: "Euphoric chord progressions engineered for midnight transcendence.",
            photoUrl: "/images/afreqa-halloween-alloy.jpg",
          },
        },
        {
          id: "l3",
          stageName: "Alloy Mainstage",
          setStartTime: "23:00",
          setEndTime: "00:30",
          artist: {
            name: "Shock B2B Ryte",
            genres: ["High-Octane Dance"],
            bio: "Fast-tempo rave cuts and driving drops under the laser canopy.",
            photoUrl: "/images/afreqa-halloween-alloy.jpg",
          },
        },
        {
          id: "l4",
          stageName: "Alloy Mainstage",
          setStartTime: "21:30",
          setEndTime: "23:00",
          artist: {
            name: "Z4V3 B2B Alex Gvng Gvng",
            genres: ["Peak-Time EDM", "Electro"],
            bio: "Heavy sub-bass drops fused with mainstage festival energy.",
            photoUrl: "/images/afreqa-halloween-alloy.jpg",
          },
        },
        {
          id: "l5",
          stageName: "Alloy Mainstage",
          setStartTime: "19:00",
          setEndTime: "21:30",
          artist: {
            name: "The Arkitekt & DJ Myth",
            genres: ["Support & Warmup Frequencies"],
            bio: "Setting the night into motion from 7PM as doors open.",
            photoUrl: "/images/afreqa-halloween-alloy.jpg",
          },
        },
      ],
    };
  }

  if (!event) {
    notFound();
  }

  const meta = parseEventMetadata(event.description, event.date);

  const phaseStripData =
    event.ticketPhases && event.ticketPhases.length > 0
      ? event.ticketPhases
          .filter((tp) => meta.hasTableBooking || !/table/i.test(tp.name))
          .map((tp) => ({
            id: tp.id,
            name: tp.name,
            price: tp.priceKes,
            currency: "KES",
            status: tp.status as "ON_SALE" | "SOLD_OUT" | "UPCOMING",
            description: meta.phaseDescriptions[tp.name] || (tp as any).description || null,
          }))
      : [
          {
            id: "p-def",
            name: "General Admission",
            price: 2000,
            currency: "KES",
            status: "ON_SALE" as const,
            description: "Standard Festival Admission • Turnstile access",
          },
        ];

  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${event.venueName}, ${event.venueAddress || "Nairobi, Kenya"}`
  )}`;

  const isLineupDroppingSoon =
    meta.lineupDroppingSoon ||
    !event.lineup ||
    event.lineup.length === 0;

  const cleanDescription = meta.cleanDescription;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. HERO HEADER */}
      <div className="rounded-3xl bg-[#0f1117]/90 backdrop-blur-md p-6 sm:p-12 relative overflow-hidden border border-white/10 shadow-2xl">
        {/* Background crowd / event cover image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={event.posterUrl || "/images/afreqa-live-crowd.jpg"}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-[#0f1117]/85 to-[#0f1117]/60" />
        </div>

        {/* Warm Stage Embers */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-pink-400 border border-pink-500/30 text-xs font-mono font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
            <span>Official Festival Gathering</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-6xl text-white tracking-tight">
            <span className="text-festival-gradient">{event.title}</span>
          </h1>

          {event.tagline && (
            <p className="mt-3 text-base sm:text-xl text-zinc-300 font-normal">
              {event.tagline}
            </p>
          )}

          {/* Meta strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 font-mono text-xs sm:text-sm text-zinc-300">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10">
              <Calendar className="w-4 h-4 text-pink-400" />
              <span>{new Date(event.date).toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10">
              <Clock className="w-4 h-4 text-pink-400" />
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
            <a
              href={`/go/tickets/${event.slug}?placement=event_detail`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-pink-950/30 active:scale-95 transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>Get Tickets via HustleSasa</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={`/events/${event.slug}/calendar.ics`}
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-semibold uppercase tracking-wider transition-all"
            >
              <Download className="w-4 h-4 text-white" />
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

            {meta.hasTableBooking && meta.tableBookingContact && (
              <a
                href={
                  meta.tableBookingContact.includes("@")
                    ? `mailto:${meta.tableBookingContact}`
                    : `/contact?subject=BOOKING`
                }
                className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-pink-400 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <span>✉️ VIP & Tables: {meta.tableBookingContact}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. OFFICIAL POSTER ARTWORK SHOWCASE */}
      {event.posterUrl && (
        <section className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md border border-white/10 p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 lg:col-span-3">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
                <Image
                  src={event.posterUrl}
                  alt={`${event.title} Official Artwork`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
                Official Edition Poster & Visual Identity
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                {event.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
                {cleanDescription || "Official gathering artwork and festival identity. Prepare for high-octane stage production, immersive audio-visuals, and electronic energy."}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={event.posterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-pink-400 font-bold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>View High-Res Poster</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2.5 OFFICIAL PHOTO ARCHIVE SECTION (ONLY WHEN LINK TO PHOTOS HAS BEEN ADDED) */}
      {meta.photosUrl && (
        <section className="rounded-3xl bg-gradient-to-r from-[#0f1117] via-[#141926] to-[#0f1117] border border-pink-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/30 shadow-inner">
              <Camera className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xl text-white">
                  Official Night Photography Vault
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Live Photos
                </span>
              </div>
              <p className="text-xs text-zinc-300 max-w-xl">
                Uncompressed full-resolution festival photography from {event.title}. Browse, download, and relive the night.
              </p>
            </div>
          </div>
          <a
            href={meta.photosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-pink-950/30 transition-all shrink-0 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Open Night Photos Vault</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>
      )}

      {/* 3. TICKET PHASES */}
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

      {/* 3. LINEUP & SET TIMES / DROPPING SOON */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-afreqa-chrome-high">
              Festival Lineup & Programming
            </h2>
            <p className="text-xs font-mono text-afreqa-silver-mid mt-0.5">
              {isLineupDroppingSoon
                ? "Official roster curation in progress"
                : "Curated festival roster & stage schedules"}
            </p>
          </div>
        </div>

        {isLineupDroppingSoon ? (
          <div className="rounded-3xl bg-[#0f1117]/90 border border-pink-500/30 p-8 sm:p-12 relative overflow-hidden text-center shadow-2xl backdrop-blur-md">
            {/* Ambient festival glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-mono font-bold tracking-widest uppercase shadow">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Lineup Dropping Soon</span>
              </div>

              {/* Animated audio frequency waveform bars */}
              <div className="flex items-center justify-center gap-1.5 py-2">
                {[40, 75, 55, 95, 60, 85, 45, 100, 70, 50, 90, 65, 80, 45, 90].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h * 0.4}px` }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-pink-600 to-rose-400 animate-pulse"
                  />
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                  ARTIST ROSTER UNDER CURATION
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  The sonic architects are engineering the official electronic roster and stage set times for {event.title}. Be the first to receive the headliner drop and secret B2B announcements.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://whatsapp.com/channel/0029VbAYtdlCcW4lOTonkS0h"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                >
                  <span>Join WhatsApp Channel For Lineup Reveal</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <a
                  href={`/go/tickets/${event.slug}?placement=lineup-soon`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95"
                >
                  <Ticket className="w-4 h-4 text-pink-400" />
                  <span>Secure Early Pass</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(event.lineup || []).map((slot) => (
              <div
                key={slot.id}
                className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md p-6 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-pink-500/40 transition-all"
              >
                {(() => {
                  const { framing } = parseArtistFraming(slot.artist?.bio);
                  return (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black">
                      <Image
                        src={slot.artist?.photoUrl || "/brand/logo.jpg"}
                        alt={slot.artist?.name || "Artist"}
                        fill
                        sizes="96px"
                        className={`${
                          framing.fit === "contain" ? "object-contain" : "object-cover"
                        } group-hover:scale-105 transition-transform duration-300`}
                        style={{
                          objectPosition: `${framing.focalX}% ${framing.focalY}%`,
                          transform: framing.fit === "cover" ? `scale(${framing.zoom})` : undefined,
                          transformOrigin: `${framing.focalX}% ${framing.focalY}%`,
                        }}
                      />
                    </div>
                  );
                })()}

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 text-pink-400 border border-pink-500/30">
                      {slot.stageName || "Main Stage"}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {slot.setStartTime} – {slot.setEndTime}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white group-hover:text-pink-400 transition-colors">
                    {slot.artist?.name}
                  </h3>

                  <p className="text-xs font-mono text-pink-400/90">
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
        )}
      </section>

      {/* 4. VENUE & GATE POLICIES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Venue Info */}
        <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-8 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider">
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
              className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline font-semibold"
            >
              <span>Open in Google Maps Navigation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Gate Policy Checklist */}
        <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-8 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-pink-400 font-mono text-xs uppercase font-bold tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Essential Gate Protocol</span>
          </div>
          <h3 className="font-display font-extrabold text-2xl text-white">
            Admission Requirements
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300 font-normal">
            <li className="flex items-start gap-2">
              <span className="text-pink-400 font-bold">•</span>
              <span><strong>Strict 18+ Age Limit:</strong> Original physical ID, passport, or driving license required.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 font-bold">•</span>
              <span><strong>No Pass-Outs:</strong> Re-entry is not permitted once scanned inside.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 font-bold">•</span>
              <span><strong>Prohibited Items:</strong> No outside food, drinks, weapons, or illegal substances. Full security pat-down and metal detection at turnstiles.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
