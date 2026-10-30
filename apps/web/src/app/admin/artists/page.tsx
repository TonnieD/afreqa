import { requireAuth } from "@/lib/auth";
import { db } from "@afreqa/core";
import { ArtistsManager } from "@/components/admin/ArtistsManager";

export default async function AdminArtistsPage() {
  await requireAuth("artists:read");

  let artists: Array<{
    id: string;
    name: string;
    slug: string;
    bio: string | null;
    photoUrl: string | null;
    genres: string[];
    instagramUrl: string | null;
    soundcloudUrl: string | null;
    spotifyUrl: string | null;
    isFictional: boolean;
    eventSlots: Array<{
      id: string;
      stageName: string | null;
      setStartTime: string | null;
      event: { title: string; date: Date };
    }>;
  }> = [];

  try {
    artists = await db.artist.findMany({
      orderBy: { name: "asc" },
      include: {
        eventSlots: {
          include: { event: { select: { title: true, date: true } } },
        },
      },
    });
  } catch {
    // If DB offline
  }

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-afreqa-chrome-high/10">
        <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
          Artists & DJ Roster
        </h1>
        <p className="text-xs text-afreqa-silver-mid mt-1 font-mono">
          Manage headliners, local DJs, music genres, and stage set allocations
        </p>
      </div>

      <ArtistsManager initialArtists={artists} />
    </div>
  );
}

