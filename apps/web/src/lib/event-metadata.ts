export interface EventMetadata {
  cleanDescription: string;
  lineupDroppingSoon: boolean;
  photosUrl: string | null;
  rawPhotosUrl: string | null;
  hasPhotos: boolean;
  hasTableBooking: boolean;
  tableBookingContact: string | null;
  phaseDescriptions: Record<string, string>;
}

/**
 * Extracts and cleans metadata flags embedded in event descriptions:
 * - Lineup Dropping Soon: <!-- LINEUP_DROPPING_SOON -->
 * - Photos Link: <!-- PHOTOS_URL: https://... -->
 * - Table Booking: <!-- TABLE_BOOKING: +254... -->
 * - Phase Descriptions: <!-- PHASE_DESCRIPTIONS: {"Early Bird":"..."} -->
 *
 * Rules:
 * 1. If an event has not happened yet (is in the future), night photos are removed.
 * 2. Photos section only appears when a link to photos has been explicitly added.
 * 3. Table booking is removed unless explicitly specified.
 * 4. Phase descriptions sync directly between the admin editor and public ticket tiers.
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
      phaseDescriptions: {},
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
  const tableBookingContact = tableMatch && tableMatch[1]?.trim() ? tableMatch[1].trim() : "tables@afreqa.com";

  // Phase Descriptions
  const phaseDescMatch = rawDescription.match(/<!--\s*PHASE_DESCRIPTIONS:\s*(.*?)\s*-->/);
  let phaseDescriptions: Record<string, string> = {};
  if (phaseDescMatch && phaseDescMatch[1]) {
    try {
      const parsed = JSON.parse(phaseDescMatch[1]);
      if (typeof parsed === "object" && parsed !== null) {
        phaseDescriptions = parsed;
      }
    } catch {
      // JSON parsing fallback
    }
  }

  const cleanDescription = rawDescription
    .replace(/<!--\s*LINEUP_DROPPING_SOON\s*-->/g, "")
    .replace(/<!--\s*PHOTOS_URL:.*?\s*-->/g, "")
    .replace(/<!--\s*TABLE_BOOKING.*?-->/g, "")
    .replace(/<!--\s*PHASE_DESCRIPTIONS:.*?\s*-->/g, "")
    .trim();

  return {
    cleanDescription,
    lineupDroppingSoon,
    photosUrl,
    rawPhotosUrl,
    hasPhotos: !!photosUrl,
    hasTableBooking,
    tableBookingContact: hasTableBooking ? tableBookingContact : null,
    phaseDescriptions,
  };
}

export function buildEventDescription(params: {
  description: string;
  lineupDroppingSoon?: boolean;
  photosUrl?: string | null;
  tableBookingSpecified?: boolean;
  tableBookingContact?: string | null;
  phaseDescriptions?: Record<string, string> | null;
}): string {
  let result = params.description
    .replace(/<!--\s*LINEUP_DROPPING_SOON\s*-->/g, "")
    .replace(/<!--\s*PHOTOS_URL:.*?\s*-->/g, "")
    .replace(/<!--\s*TABLE_BOOKING.*?-->/g, "")
    .replace(/<!--\s*PHASE_DESCRIPTIONS:.*?\s*-->/g, "")
    .trim();

  if (params.lineupDroppingSoon) {
    result += "\n\n<!-- LINEUP_DROPPING_SOON -->";
  }

  if (params.photosUrl && params.photosUrl.trim()) {
    result += `\n\n<!-- PHOTOS_URL: ${params.photosUrl.trim()} -->`;
  }

  if (params.tableBookingSpecified) {
    const contact = (params.tableBookingContact && params.tableBookingContact.trim()) || "tables@afreqa.com";
    result += `\n\n<!-- TABLE_BOOKING: ${contact} -->`;
  }

  if (params.phaseDescriptions && Object.keys(params.phaseDescriptions).length > 0) {
    result += `\n\n<!-- PHASE_DESCRIPTIONS: ${JSON.stringify(params.phaseDescriptions)} -->`;
  }

  return result;
}
