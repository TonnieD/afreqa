import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, recordAuditLog, hasPermission } from "@afreqa/core";

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "events:read")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await db.event.findMany({
    orderBy: { date: "desc" },
    include: {
      ticketPhases: { orderBy: { sortOrder: "asc" } },
      lineup: { include: { artist: true }, orderBy: { sortOrder: "asc" } },
      _count: { select: { clickEvents: true } },
    },
  });

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "events:write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      tagline,
      description,
      posterUrl,
      posterBlur,
      date,
      doorsOpen,
      doorsClose,
      venueName,
      venueAddress,
      googleMapsUrl,
      transportInfo,
      agePolicy,
      refundPolicy,
      externalTicketUrl,
      status,
    } = body;

    if (!title || !slug || !date || !venueName) {
      return NextResponse.json(
        { error: "Title, slug, date, and venue name are required." },
        { status: 400 }
      );
    }

    const event = await db.event.create({
      data: {
        title,
        slug: slug.toLowerCase().trim(),
        tagline,
        description: description || "",
        posterUrl,
        posterBlur,
        date: new Date(date),
        doorsOpen,
        doorsClose,
        venueName,
        venueAddress,
        googleMapsUrl,
        transportInfo,
        agePolicy: agePolicy || "Strictly 18+ with valid government ID",
        refundPolicy,
        externalTicketUrl,
        status: status || "DRAFT",
      },
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "EVENT_CREATE",
      resource: "Event",
      resourceId: event.id,
      payload: { title: event.title, slug: event.slug, status: event.status },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create event";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

