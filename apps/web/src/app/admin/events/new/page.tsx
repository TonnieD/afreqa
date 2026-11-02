import { requireAuth } from "@/lib/auth";
import { db } from "@afreqa/core";
import { EventForm } from "@/components/admin/EventForm";

export default async function NewEventPage() {
  await requireAuth("events:write");

  let artists: Array<{
    id: string;
    name: string;
    slug: string;
    genres: string[];
    photoUrl?: string | null;
  }> = [];

  try {
    artists = await db.artist.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        genres: true,
        photoUrl: true,
      },
    });
  } catch {
    // DB offline fallback
  }

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-afreqa-chrome-high/10">
        <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
          Create Festival Edition
        </h1>
        <p className="text-xs text-afreqa-silver-mid mt-1 font-mono">
          Configure title, venue coordinates, poster art, lineup curation, and HustleSasa ticket tiers
        </p>
      </div>

      <EventForm availableArtists={artists} />
    </div>
  );
}
