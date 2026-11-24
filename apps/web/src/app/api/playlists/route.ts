import { NextResponse } from "next/server";
import { db } from "@afreqa/core";
import { PLAYLISTS, type Playlist } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "spotify.playlists" },
    });

    if (setting && setting.jsonValue && Array.isArray(setting.jsonValue)) {
      return NextResponse.json(setting.jsonValue as unknown as Playlist[]);
    }

    return NextResponse.json(PLAYLISTS);
  } catch {
    return NextResponse.json(PLAYLISTS);
  }
}
