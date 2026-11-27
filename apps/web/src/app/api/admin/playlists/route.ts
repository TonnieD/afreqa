import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/csrf";
import { getSessionUser } from "@/lib/auth";
import { db, hasPermission, recordAuditLog } from "@afreqa/core";
import { PLAYLISTS, type Playlist } from "@/lib/spotify";

export const dynamic = "force-dynamic";

const SETTING_KEY = "spotify.playlists";

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "events:read")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: SETTING_KEY },
    });

    if (setting && setting.jsonValue && Array.isArray(setting.jsonValue)) {
      return NextResponse.json(setting.jsonValue as unknown as Playlist[]);
    }

    return NextResponse.json(PLAYLISTS);
  } catch {
    return NextResponse.json(PLAYLISTS);
  }
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "events:write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, genre, tagline, spotifyUrl, bpm, soundReferences, fanbaseRank, status, curator } = body;

    if (!title || !spotifyUrl) {
      return NextResponse.json({ error: "Title and Spotify URL are required" }, { status: 400 });
    }

    // Parse Spotify URI or ID
    let spotifyUri = "";
    if (spotifyUrl.includes("spotify.com/playlist/")) {
      const match = spotifyUrl.match(/playlist\/([a-zA-Z0-9]+)/);
      spotifyUri = match ? `playlist/${match[1]}` : spotifyUrl;
    } else if (spotifyUrl.startsWith("playlist/") || spotifyUrl.startsWith("spotify:playlist:")) {
      spotifyUri = spotifyUrl.replace("spotify:", "");
    } else {
      spotifyUri = `playlist/${spotifyUrl.trim()}`;
    }

    // Get current playlists
    let currentPlaylists: Playlist[] = PLAYLISTS;
    const setting = await db.siteSetting.findUnique({ where: { key: SETTING_KEY } });
    if (setting?.jsonValue && Array.isArray(setting.jsonValue)) {
      currentPlaylists = setting.jsonValue as unknown as Playlist[];
    }

    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      curator: (curator || "Afreqa Curators").trim(),
      tagline: (tagline || "Official festival curation").trim(),
      genre: (genre || "Electronic Dance Music").trim(),
      spotifyUri,
      spotifyUrl: spotifyUrl.startsWith("http") ? spotifyUrl : `https://open.spotify.com/${spotifyUri}`,
      tracksCount: "Official Curated Tracks",
      fanbaseRank: fanbaseRank || `#${currentPlaylists.length + 1} Sound Pillar`,
      status: status === "curating" ? "curating" : "live",
      bpm: bpm || "128 BPM",
      soundReferences: soundReferences || "",
    };

    const updatedList = [...currentPlaylists, newPlaylist];

    await db.siteSetting.upsert({
      where: { key: SETTING_KEY },
      create: {
        key: SETTING_KEY,
        jsonValue: updatedList as any,
        description: "Official Spotify playlists curated by Afreqa",
      },
      update: {
        jsonValue: updatedList as any,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "SPOTIFY_PLAYLIST_CREATE",
      resource: "SiteSetting",
      resourceId: newPlaylist.id,
      payload: { title: newPlaylist.title },
    });

    return NextResponse.json(newPlaylist);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create playlist";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "events:write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, genre, tagline, spotifyUrl, bpm, soundReferences, fanbaseRank, status, curator, playlists: fullList } = body;

    // If client passes full reordered list
    if (fullList && Array.isArray(fullList)) {
      await db.siteSetting.upsert({
        where: { key: SETTING_KEY },
        create: {
          key: SETTING_KEY,
          jsonValue: fullList as any,
          description: "Official Spotify playlists curated by Afreqa",
        },
        update: {
          jsonValue: fullList as any,
        },
      });
      return NextResponse.json(fullList);
    }

    if (!id) {
      return NextResponse.json({ error: "Playlist ID required" }, { status: 400 });
    }

    let currentPlaylists: Playlist[] = PLAYLISTS;
    const setting = await db.siteSetting.findUnique({ where: { key: SETTING_KEY } });
    if (setting?.jsonValue && Array.isArray(setting.jsonValue)) {
      currentPlaylists = setting.jsonValue as unknown as Playlist[];
    }

    let spotifyUri = undefined;
    if (spotifyUrl) {
      const match = spotifyUrl.match(/playlist\/([a-zA-Z0-9]+)/);
      spotifyUri = match ? `playlist/${match[1]}` : (spotifyUrl.startsWith("playlist/") ? spotifyUrl : `playlist/${spotifyUrl.trim()}`);
    }

    const updatedList = currentPlaylists.map((pl) => {
      if (pl.id !== id) return pl;
      return {
        ...pl,
        title: title !== undefined ? title.trim() : pl.title,
        genre: genre !== undefined ? genre.trim() : pl.genre,
        tagline: tagline !== undefined ? tagline.trim() : pl.tagline,
        curator: curator !== undefined ? curator.trim() : pl.curator,
        spotifyUrl: spotifyUrl !== undefined ? spotifyUrl.trim() : pl.spotifyUrl,
        spotifyUri: spotifyUri !== undefined ? spotifyUri : pl.spotifyUri,
        bpm: bpm !== undefined ? bpm.trim() : pl.bpm,
        soundReferences: soundReferences !== undefined ? soundReferences.trim() : pl.soundReferences,
        fanbaseRank: fanbaseRank !== undefined ? fanbaseRank.trim() : pl.fanbaseRank,
        status: status !== undefined ? status : pl.status,
      };
    });

    await db.siteSetting.upsert({
      where: { key: SETTING_KEY },
      create: {
        key: SETTING_KEY,
        jsonValue: updatedList as any,
      },
      update: {
        jsonValue: updatedList as any,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "SPOTIFY_PLAYLIST_UPDATE",
      resource: "SiteSetting",
      resourceId: id,
    });

    return NextResponse.json(updatedList.find((p) => p.id === id));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update playlist";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "events:write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Playlist ID required" }, { status: 400 });
  }

  try {
    let currentPlaylists: Playlist[] = PLAYLISTS;
    const setting = await db.siteSetting.findUnique({ where: { key: SETTING_KEY } });
    if (setting?.jsonValue && Array.isArray(setting.jsonValue)) {
      currentPlaylists = setting.jsonValue as unknown as Playlist[];
    }

    const updatedList = currentPlaylists.filter((p) => p.id !== id);

    await db.siteSetting.upsert({
      where: { key: SETTING_KEY },
      create: {
        key: SETTING_KEY,
        jsonValue: updatedList as any,
      },
      update: {
        jsonValue: updatedList as any,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "SPOTIFY_PLAYLIST_DELETE",
      resource: "SiteSetting",
      resourceId: id,
    });

    return NextResponse.json({ success: true, count: updatedList.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete playlist";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
