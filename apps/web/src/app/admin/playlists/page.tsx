import { requireAuth } from "@/lib/auth";
import { db } from "@afreqa/core";
import { PlaylistsManager } from "@/components/admin/PlaylistsManager";
import { PLAYLISTS, type Playlist } from "@/lib/spotify";

export const metadata = {
  title: "Spotify Playlists | Afreqa Operations",
};

export default async function AdminPlaylistsPage() {
  await requireAuth("events:read");

  let playlists: Playlist[] = PLAYLISTS;
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "spotify.playlists" },
    });
    if (setting?.jsonValue && Array.isArray(setting.jsonValue)) {
      playlists = setting.jsonValue as unknown as Playlist[];
    }
  } catch {
    // If DB is offline
  }

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-afreqa-chrome-high/10">
        <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
          Spotify Playlists & Sound Pillars
        </h1>
        <p className="text-xs text-afreqa-silver-mid mt-1 font-mono">
          Manage, add, reorder, and remove official Spotify playlist embeds featured on the public music and festival hub
        </p>
      </div>

      <PlaylistsManager initialPlaylists={playlists} />
    </div>
  );
}
