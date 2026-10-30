import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { db, recordAuditLog, hasPermission } from "@afreqa/core";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "events:read")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const event = await db.event.findUnique({
    where: { id },
    include: {
      ticketPhases: { orderBy: { sortOrder: "asc" } },
      lineup: { include: { artist: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "events:write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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

    const updated = await db.event.update({
      where: { id },
      data: {
        title,
        slug: slug ? slug.toLowerCase().trim() : undefined,
        tagline,
        description,
        posterUrl,
        posterBlur,
        date: date ? new Date(date) : undefined,
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
      },
    });

    // Update ticket phases if supplied
    if (Array.isArray(ticketPhases)) {
      // Delete existing and re-create to keep in sync
      await db.ticketPhase.deleteMany({ where: { eventId: id } });
      if (ticketPhases.length > 0) {
        await db.ticketPhase.createMany({
          data: ticketPhases.map((tp, idx) => ({
            eventId: id,
            name: tp.name,
            priceKes: tp.priceKes !== undefined && tp.priceKes !== null ? Number(tp.priceKes) : null,
            status: tp.status || "UPCOMING",
            externalUrl: tp.externalUrl || null,
            sortOrder: idx,
          })),
        });
      }
    }

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "EVENT_UPDATE",
      resource: "Event",
      resourceId: id,
      payload: { title: updated.title, status: updated.status },
    });

    try {
      revalidatePath("/");
      revalidatePath("/events");
      if (updated.slug) {
        revalidatePath(`/events/${updated.slug}`);
      }
    } catch {
      // safe fallback
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update event";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "events:write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const event = await db.event.delete({
      where: { id },
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "EVENT_DELETE",
      resource: "Event",
      resourceId: id,
      payload: { title: event.title },
    });

    try {
      revalidatePath("/");
      revalidatePath("/events");
      if (event.slug) {
        revalidatePath(`/events/${event.slug}`);
      }
    } catch {
      // safe fallback
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete event";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

