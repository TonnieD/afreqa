import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, recordAuditLog, hasPermission } from "@afreqa/core";

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "artists:read")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const artists = await db.artist.findMany({
    orderBy: { name: "asc" },
    include: {
      eventSlots: {
        include: { event: { select: { title: true, date: true } } },
      },
    },
  });

  return NextResponse.json(artists);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "artists:write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      bio,
      photoUrl,
      photoBlur,
      genres,
      instagramUrl,
      soundcloudUrl,
      spotifyUrl,
      isFictional,
    } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Artist name and slug are required." }, { status: 400 });
    }

    const artist = await db.artist.create({
      data: {
        name,
        slug: slug.toLowerCase().trim(),
        bio,
        photoUrl,
        photoBlur,
        genres: Array.isArray(genres) ? genres : [],
        instagramUrl,
        soundcloudUrl,
        spotifyUrl,
        isFictional: Boolean(isFictional),
      },
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "ARTIST_CREATE",
      resource: "Artist",
      resourceId: artist.id,
      payload: { name: artist.name, genres: artist.genres },
    });

    return NextResponse.json(artist, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create artist";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

