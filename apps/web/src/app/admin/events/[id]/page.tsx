import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { db } from "@afreqa/core";
import { EventForm } from "@/components/admin/EventForm";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  await requireAuth("events:write");
  const { id } = await params;

  let event = null;
  let artists: Array<{
    id: string;
    name: string;
    slug: string;
    genres: string[];
    photoUrl?: string | null;
  }> = [];

  try {
    const [fetchedEvent, fetchedArtists] = await Promise.all([
      db.event.findUnique({
        where: { id },
        include: {
          ticketPhases: { orderBy: { sortOrder: "asc" } },
          lineup: {
            include: { artist: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      }),
      db.artist.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          genres: true,
          photoUrl: true,
        },
      }),
    ]);

    event = fetchedEvent;
    artists = fetchedArtists;
  } catch {
    // DB error fallback
  }

  if (!event) {
    notFound();
  }

  const initialData = {
    id: event.id,
    title: event.title,
    slug: event.slug,
    tagline: event.tagline,
    description: event.description,
    posterUrl: event.posterUrl,
    date: event.date.toISOString(),
    doorsOpen: event.doorsOpen,
    doorsClose: event.doorsClose,
    venueName: event.venueName,
    venueAddress: event.venueAddress,
    googleMapsUrl: event.googleMapsUrl,
    transportInfo: event.transportInfo,
    agePolicy: event.agePolicy,
    refundPolicy: event.refundPolicy,
    externalTicketUrl: event.externalTicketUrl,
    status: event.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    lineupDroppingSoon: event.description?.includes("<!-- LINEUP_DROPPING_SOON -->") ?? false,
    ticketPhases: event.ticketPhases.map((tp) => ({
      id: tp.id,
      name: tp.name,
      priceKes: tp.priceKes,
      status: tp.status as "UPCOMING" | "ON_SALE" | "SOLD_OUT",
      externalUrl: tp.externalUrl,
    })),
    lineup: (event.lineup || []).map((l) => ({
      id: l.id,
      artistId: l.artistId,
      stageName: l.stageName || "Main Stage",
      setStartTime: l.setStartTime || "",
      setEndTime: l.setEndTime || "",
      sortOrder: l.sortOrder,
      artist: l.artist
        ? {
            id: l.artist.id,
            name: l.artist.name,
            genres: l.artist.genres,
            photoUrl: l.artist.photoUrl,
          }
        : undefined,
    })),
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-afreqa-chrome-high/10">
        <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
          Edit Edition: {event.title}
        </h1>
        <p className="text-xs text-afreqa-silver-mid mt-1 font-mono">
          Update schedules, venue details, lineup programming, or adjust ticket phase pricing
        </p>
      </div>

      <EventForm initialData={initialData} availableArtists={artists} />
    </div>
  );
}
