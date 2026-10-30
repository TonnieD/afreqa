import Link from "next/link";
import Image from "next/image";
import { requireAuth } from "@/lib/auth";
import { db } from "@afreqa/core";
import { Plus, Calendar, MapPin, Ticket, ExternalLink, Edit2 } from "lucide-react";

export default async function AdminEventsPage() {
  await requireAuth("events:read");

  let events: Array<{
    id: string;
    title: string;
    slug: string;
    date: Date;
    venueName: string;
    status: string;
    posterUrl: string | null;
    ticketPhases: Array<{ id: string; name: string; status: string; priceKes: number | null }>;
    _count: { clickEvents: number };
  }> = [];

  try {
    events = await db.event.findMany({
      orderBy: { date: "desc" },
      include: {
        ticketPhases: { orderBy: { sortOrder: "asc" } },
        _count: { select: { clickEvents: true } },
      },
    });
  } catch {
    // If DB offline
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-afreqa-chrome-high/10">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
            Events & Editions
          </h1>
          <p className="text-xs text-afreqa-silver-mid mt-1 font-mono">
            Manage festival editions, venue guidelines, and hybrid ticketing phases
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-afreqa-teal text-afreqa-shadow font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-glow-teal shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Events Table / Card List */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Calendar className="w-12 h-12 text-afreqa-silver-mid mx-auto mb-3 opacity-50" />
            <h3 className="font-bold text-base text-afreqa-chrome-high">No Events Found</h3>
            <p className="text-xs text-afreqa-silver-mid mt-1 mb-6">
              Create your first festival edition to showcase tickets and lineups.
            </p>
            <Link
              href="/admin/events/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-afreqa-teal text-afreqa-shadow font-extrabold text-xs uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-afreqa-chrome-high/10 text-afreqa-silver-mid uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Event</th>
                  <th className="py-3.5 px-4">Date & Venue</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Ticket Phases</th>
                  <th className="py-3.5 px-4">Leads Generated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-afreqa-chrome-high/5">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-white/5 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-afreqa-shadow shrink-0 border border-white/10">
                          {event.posterUrl ? (
                            <Image
                              src={event.posterUrl}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-afreqa-silver-mid text-[10px] font-mono">
                              No Art
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-afreqa-chrome-high">
                            {event.title}
                          </div>
                          <div className="text-[11px] text-afreqa-silver-mid font-mono">
                            /{event.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-afreqa-silver">
                      <div className="flex items-center gap-1.5 font-medium text-afreqa-chrome-high">
                        <Calendar className="w-3.5 h-3.5 text-afreqa-teal" />
                        <span>{new Date(event.date).toLocaleDateString([], { dateStyle: "medium" })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-afreqa-silver-mid text-[11px] mt-0.5">
                        <MapPin className="w-3 h-3 text-afreqa-silver-mid" />
                        <span className="truncate max-w-[200px]">{event.venueName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          event.status === "PUBLISHED"
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                            : event.status === "DRAFT"
                            ? "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                            : "bg-white/10 border border-white/20 text-afreqa-silver-mid"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {event.ticketPhases.map((tp) => (
                          <span
                            key={tp.id}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                              tp.status === "ON_SALE"
                                ? "bg-afreqa-teal/10 border-afreqa-teal/40 text-afreqa-teal font-bold"
                                : tp.status === "SOLD_OUT"
                                ? "bg-red-500/10 border-red-500/30 text-red-400"
                                : "bg-white/5 border-white/10 text-afreqa-silver-mid"
                            }`}
                          >
                            {tp.name} {tp.priceKes ? `(KES ${tp.priceKes.toLocaleString()})` : ""}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-afreqa-chrome-high">
                      <div className="flex items-center gap-1">
                        <Ticket className="w-3.5 h-3.5 text-afreqa-violet" />
                        <span>{event._count.clickEvents} clicks</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/events/${event.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-afreqa-silver hover:text-afreqa-chrome-high transition"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-afreqa-teal/15 hover:bg-afreqa-teal/25 text-afreqa-teal font-medium transition"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

