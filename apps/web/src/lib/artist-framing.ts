export interface ArtistFraming {
  focalY: number; // 0 (top/face) to 100 (bottom), default 20
  focalX: number; // 0 (left) to 100 (right), default 50
  zoom: number;   // 1.0 (default) to 2.0
  fit: "cover" | "contain"; // "cover" with custom focal offset or "contain" to see entire image
  performedEventsCount?: number; // Custom/edited number of events/festivals performed
}

export const DEFAULT_FRAMING: ArtistFraming = {
  focalY: 20, // 20% defaults to face level for portrait/DJ photos
  focalX: 50,
  zoom: 1.0,
  fit: "cover",
  performedEventsCount: 0,
};

export function parseArtistFraming(bio?: string | null): { framing: ArtistFraming; cleanBio: string } {
  if (!bio) {
    return { framing: DEFAULT_FRAMING, cleanBio: "" };
  }

  const match = bio.match(/<!--\s*FRAMING:\s*(\{[\s\S]*?\})\s*-->/);
  if (!match) {
    return { framing: DEFAULT_FRAMING, cleanBio: bio };
  }

  try {
    const parsed = JSON.parse(match[1]);
    const framing: ArtistFraming = {
      focalY: typeof parsed.focalY === "number" ? Math.max(0, Math.min(100, parsed.focalY)) : DEFAULT_FRAMING.focalY,
      focalX: typeof parsed.focalX === "number" ? Math.max(0, Math.min(100, parsed.focalX)) : DEFAULT_FRAMING.focalX,
      zoom: typeof parsed.zoom === "number" ? Math.max(0.8, Math.min(2.5, parsed.zoom)) : DEFAULT_FRAMING.zoom,
      fit: parsed.fit === "contain" ? "contain" : "cover",
      performedEventsCount:
        typeof parsed.performedEventsCount === "number" && !isNaN(parsed.performedEventsCount)
          ? Math.max(0, Math.floor(parsed.performedEventsCount))
          : undefined,
    };
    const cleanBio = bio.replace(match[0], "").trim();
    return { framing, cleanBio };
  } catch {
    return { framing: DEFAULT_FRAMING, cleanBio: bio };
  }
}

export function serializeArtistFraming(cleanBio: string, framing: ArtistFraming): string {
  const trimmed = cleanBio.trim();
  const framingTag = `<!-- FRAMING: ${JSON.stringify(framing)} -->`;
  return trimmed ? `${trimmed}\n\n${framingTag}` : framingTag;
}
