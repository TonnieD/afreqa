import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, recordAuditLog, hasPermission } from "@afreqa/core";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "artists:write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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

    const updated = await db.artist.update({
      where: { id },
      data: {
        name,
        slug: slug ? slug.toLowerCase().trim() : undefined,
        bio,
        photoUrl,
        photoBlur,
        genres: Array.isArray(genres) ? genres : undefined,
        instagramUrl,
        soundcloudUrl,
        spotifyUrl,
        isFictional: isFictional !== undefined ? Boolean(isFictional) : undefined,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "ARTIST_UPDATE",
      resource: "Artist",
      resourceId: id,
      payload: { name: updated.name },
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update artist";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "artists:write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const artist = await db.artist.delete({ where: { id } });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "ARTIST_DELETE",
      resource: "Artist",
      resourceId: id,
      payload: { name: artist.name },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete artist";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

