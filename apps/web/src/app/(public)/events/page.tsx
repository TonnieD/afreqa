import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Ticket, ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { db } from "@afreqa/core";

export const metadata = {
  title: "Events & Editions",
  description: "Browse upcoming and past electronic music festival editions by Afreqa in Nairobi, Kenya.",
};

interface EventItem {
  id: string;
  title: string;
  slug: string;
  tagline?: string | null;
  date: Date | string;
  venueName: string;
  venueAddress?: string | null;
  status: string;
  ticketPhases: Array<{
    id: string;
    name: string;
    priceKes?: number | null;
    status: string;
  }>;
}

export default async function EventsPage() {
  let events: EventItem[] = [];

  try {
    events = await db.event.findMany({
      orderBy: { date: "desc" },
      include: {
        ticketPhases: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  } catch {
    // If DB is offline, fall back to mock
  }

  // If no DB events, provide realistic showcase data
  if (events.length === 0) {
    events = [
      {
        id: "evt-01",
        title: "Afreqa: Resonance",
        slug: "resonance",
        tagline: "Where African Electronic Frequencies Meet Festival Fantasy",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        venueName: "The Carnivore Grounds / Waterfront Karen",
        venueAddress: "Nairobi, Kenya",
        status: "PUBLISHED",
        ticketPhases: [
          { id: "p1", name: "Early Bird", priceKes: 1500, status: "SOLD_OUT" },
          { id: "p2", name: "Phase 1", priceKes: 2000, status: "ON_SALE" },
          { id: "p3", name: "VIP Deck", priceKes: 3500, status: "ON_SALE" },
        ],
      },
      {
        id: "evt-02",
        title: "Afreqa Solstice 2025",
        slug: "solstice-2025",
        tagline: "The Summer Solstice Celebration",
        date: new Date("2025-12-20T18:00:00Z"),
        venueName: "Alchemist / Ngong Racecourse",
        venueAddress: "Nairobi, Kenya",
        status: "ARCHIVED",
        ticketPhases: [],
      },
    ];
  }

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now);
  const pastEvents = events.filter((e) => new Date(e.date) < now);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel text-afreqa-teal text-xs font-mono font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Gathering Calendar</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-chrome">
          FESTIVAL EDITIONS
        </h1>
        <p className="mt-4 text-afreqa-silver text-sm sm:text-base leading-relaxed">
          From full-scale outdoor festival spectacles to intimate underground warehouse sessions. Explore upcoming gatherings and relive past sonic rituals.
        </p>
      </div>

      {/* UPCOMING EDITIONS */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-3 h-3 rounded-full bg-afreqa-teal animate-pulse" />
          <h2 className="font-display font-extrabold text-2xl text-afreqa-chrome-high tracking-wide">
            Upcoming Gatherings
          </h2>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="rounded-2xl glass-panel p-12 text-center border border-afreqa-chrome-high/10">
            <p className="text-afreqa-silver">Next edition currently being curated. Join the WhatsApp community for earliest notice.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="rounded-3xl glass-panel p-6 sm:p-8 border border-afreqa-chrome-high/15 hover:border-afreqa-teal/40 transition-all duration-300 shadow-metallic flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-6 border border-afreqa-chrome-high/10">
                    <Image
                      src="/brand/logo.jpg"
                      alt={evt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-bold bg-afreqa-shadow/90 backdrop-blur-md text-afreqa-teal border border-afreqa-teal/30">
                      ON SALE
                    </div>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-afreqa-chrome-high group-hover:text-afreqa-teal transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-sm text-afreqa-silver mt-1.5 font-light">
                    {evt.tagline}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-mono text-afreqa-silver-mid">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-afreqa-teal" />
                      {new Date(evt.date).toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-afreqa-violet" />
                      {evt.venueName}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-afreqa-chrome-high/10 flex items-center justify-between gap-4">
                  <Link
                    href={`/events/${evt.slug}`}
                    className="text-xs font-mono text-afreqa-silver hover:text-afreqa-chrome-high transition-colors"
                  >
                    View Schedule & Lineup →
                  </Link>
                  <Link
                    href={`/go/tickets/${evt.slug}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-afreqa-teal to-afreqa-violet text-afreqa-shadow font-extrabold text-xs uppercase tracking-wider shadow-glow-teal hover:scale-105 transition-all"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Get Tickets</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PAST EDITIONS ARCHIVE */}
      <section id="past" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-3 h-3 rounded-full bg-afreqa-silver-mid" />
          <h2 className="font-display font-extrabold text-2xl text-afreqa-silver tracking-wide">
            Past Chronicles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pastEvents.map((evt) => (
            <div
              key={evt.id}
              className="rounded-2xl glass-panel p-5 border border-afreqa-chrome-high/10 opacity-75 hover:opacity-100 transition-opacity"
            >
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 border border-afreqa-chrome-high/10">
                <Image
                  src="/brand/logo.jpg"
                  alt={evt.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-afreqa-silver-mid uppercase tracking-widest">
                Archived
              </span>
              <h4 className="font-display font-bold text-lg text-afreqa-chrome-high mt-1">
                {evt.title}
              </h4>
              <p className="text-xs font-mono text-afreqa-silver-mid mt-1">
                {new Date(evt.date).toLocaleDateString("en-KE", { month: "short", year: "numeric" })} • {evt.venueName}
              </p>
              <div className="mt-4 pt-3 border-t border-afreqa-chrome-high/5">
                <Link
                  href="/gallery"
                  className="text-xs font-mono text-afreqa-teal hover:text-afreqa-chrome-high transition-colors flex items-center gap-1"
                >
                  <span>Browse Photos & After-Movie</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
