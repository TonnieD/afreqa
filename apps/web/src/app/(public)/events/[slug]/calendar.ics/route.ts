import { NextRequest, NextResponse } from "next/server";
import { db } from "@afreqa/core";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  let eventTitle = "Afreqa: Resonance";
  let eventDesc = "Kenya's Premier Electronic Music Festival";
  let venueName = "The Carnivore Grounds / Waterfront Karen, Nairobi";
  let startTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  let endTime = new Date(startTime.getTime() + 12 * 60 * 60 * 1000);

  try {
    const dbEvent = await db.event.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });
    if (dbEvent) {
      eventTitle = dbEvent.title;
      eventDesc = dbEvent.description || dbEvent.tagline || eventDesc;
      venueName = dbEvent.venueAddress
        ? `${dbEvent.venueName}, ${dbEvent.venueAddress}`
        : dbEvent.venueName;
      startTime = dbEvent.date;
      endTime = new Date(startTime.getTime() + 12 * 60 * 60 * 1000);
    }
  } catch {
    // Fall back to default
  }

  const formatICSDate = (date: Date) => {
    return date
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
  };

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Afreqa Nairobi//Festival Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:afreqa-${slug}@afreqa.com`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startTime)}`,
    `DTEND:${formatICSDate(endTime)}`,
    `SUMMARY:${eventTitle}`,
    `DESCRIPTION:${eventDesc.replace(/\n/g, "\\n")}`,
    `LOCATION:${venueName}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}-afreqa.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
