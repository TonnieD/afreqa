export interface EventMetadata {
  cleanDescription: string;
  lineupDroppingSoon: boolean;
  photosUrl: string | null;
  rawPhotosUrl: string | null;
  hasPhotos: boolean;
  hasTableBooking: boolean;
  tableBookingContact: string | null;
}

/**
 * Extracts and cleans metadata flags embedded in event descriptions:
 * - Lineup Dropping Soon: <!-- LINEUP_DROPPING_SOON -->
 * - Photos Link: <!-- PHOTOS_URL: https://... -->
 * - Table Booking: <!-- TABLE_BOOKING: +254... -->
 *
 * Rules:
 * 1. If an event has not happened yet (is in the future), night photos are removed.
 * 2. Photos section only appears when a link to photos has been explicitly added.
 * 3. Table booking is removed unless explicitly specified.
 */
export function parseEventMetadata(
  rawDescription: string | null | undefined,
  eventDate?: string | Date | null
): EventMetadata {
  if (!rawDescription) {
    return {
      cleanDescription: "",
      lineupDroppingSoon: false,
      photosUrl: null,
      rawPhotosUrl: null,
      hasPhotos: false,
      hasTableBooking: false,
      tableBookingContact: null,
    };
  }

  const isPast = eventDate ? new Date(eventDate).getTime() < Date.now() : false;
  const lineupDroppingSoon = rawDescription.includes("<!-- LINEUP_DROPPING_SOON -->");

  // Photos Link
  const photosMatch = rawDescription.match(/<!--\s*PHOTOS_URL:\s*(.*?)\s*-->/);
  const rawPhotosUrl = photosMatch && photosMatch[1]?.trim() ? photosMatch[1].trim() : null;

  // The photos section should ONLY appear when a link to photos has been added.
  // If an event has not happened yet (future event), photos are never shown.
  const photosUrl = isPast && rawPhotosUrl ? rawPhotosUrl : null;

  // Table Booking: only show if explicitly specified
  const tableMatch = rawDescription.match(/<!--\s*TABLE_BOOKING(?::\s*(.*?))?\s*-->/);
  const hasTableBooking = !!tableMatch;
  const tableBookingContact = tableMatch && tableMatch[1]?.trim() ? tableMatch[1].trim() : "+254 743 836 164";

  const cleanDescription = rawDescription
    .replace(/<!--\s*LINEUP_DROPPING_SOON\s*-->/g, "")
    .replace(/<!--\s*PHOTOS_URL:.*?\s*-->/g, "")
    .replace(/<!--\s*TABLE_BOOKING.*?-->/g, "")
    .trim();

  return {
    cleanDescription,
    lineupDroppingSoon,
    photosUrl,
    rawPhotosUrl,
    hasPhotos: !!photosUrl,
    hasTableBooking,
    tableBookingContact: hasTableBooking ? tableBookingContact : null,
  };
}

export function buildEventDescription(params: {
  description: string;
  lineupDroppingSoon?: boolean;
  photosUrl?: string | null;
  tableBookingSpecified?: boolean;
  tableBookingContact?: string | null;
}): string {
  let result = params.description
    .replace(/<!--\s*LINEUP_DROPPING_SOON\s*-->/g, "")
    .replace(/<!--\s*PHOTOS_URL:.*?\s*-->/g, "")
    .replace(/<!--\s*TABLE_BOOKING.*?-->/g, "")
    .trim();

  if (params.lineupDroppingSoon) {
    result += "\n\n<!-- LINEUP_DROPPING_SOON -->";
  }

  if (params.photosUrl && params.photosUrl.trim()) {
    result += `\n\n<!-- PHOTOS_URL: ${params.photosUrl.trim()} -->`;
  }

  if (params.tableBookingSpecified) {
    const contact = (params.tableBookingContact && params.tableBookingContact.trim()) || "+254 743 836 164";
    result += `\n\n<!-- TABLE_BOOKING: ${contact} -->`;
  }

  return result;
}
