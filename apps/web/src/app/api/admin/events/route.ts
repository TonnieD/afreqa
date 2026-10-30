import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
      ticketPhases,
    } = body;

    if (!title || !slug || !date || !venueName) {
      return NextResponse.json(
        { error: "Title, slug, date, and venue name are required." },
        { status: 400 }
      );
    }

    const cleanedSlug = slug.toLowerCase().trim();

    const event = await db.event.create({
      data: {
        title,
        slug: cleanedSlug,
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
        status: (status as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "PUBLISHED",
        ticketPhases: Array.isArray(ticketPhases) && ticketPhases.length > 0
          ? {
              create: ticketPhases.map((tp: { name: string; priceKes?: number | string | null; status?: string; externalUrl?: string | null }, idx: number) => ({
                name: tp.name,
                priceKes: tp.priceKes !== undefined && tp.priceKes !== null && tp.priceKes !== "" ? Number(tp.priceKes) : null,
                status: (tp.status as "UPCOMING" | "ON_SALE" | "SOLD_OUT") || "UPCOMING",
                externalUrl: tp.externalUrl || null,
                sortOrder: idx,
              })),
            }
          : undefined,
      },
      include: {
        ticketPhases: true,
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

    // Invalidate client-side page caches immediately
    try {
      revalidatePath("/");
      revalidatePath("/events");
      revalidatePath(`/events/${event.slug}`);
    } catch {
      // safe fallback in dev/test
    }

    return NextResponse.json(event, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create event";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

