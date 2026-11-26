/**
 * East Africa Time (EAT / UTC+3, 24-Hour System) Date & Timestamp Utilities
 * AFREQA official operations base: Nairobi, Kenya (UTC+3, 24-hour military clock)
 */

function parseSafeDate(date: unknown): Date | null {
  if (date === null || date === undefined || date === "") return null;
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }
  if (typeof date === "string" || typeof date === "number") {
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function formatEatTimestamp(
  date: unknown,
  options?: { includeSeconds?: boolean; includeOffset?: boolean }
): string {
  const d = parseSafeDate(date);
  if (!d) return "—";

  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: options?.includeSeconds !== false ? "2-digit" : undefined,
    hourCycle: "h23",
    hour12: false,
  }).format(d);

  return options?.includeOffset ? `${formatted} EAT (24h UTC+3)` : `${formatted} EAT (24h)`;
}

export function formatEatDateTime(
  date: unknown,
  options?: { includeSeconds?: boolean }
): string {
  const d = parseSafeDate(date);
  if (!d) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: options?.includeSeconds !== false ? "2-digit" : undefined,
    hourCycle: "h23",
    hour12: false,
  }).format(d);
}

export function formatEatTime(
  date: unknown,
  options?: { includeSeconds?: boolean }
): string {
  const d = parseSafeDate(date);
  if (!d) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    hour: "2-digit",
    minute: "2-digit",
    second: options?.includeSeconds ? "2-digit" : undefined,
    hourCycle: "h23",
    hour12: false,
  }).format(d);
}

export function formatEatDate(date: unknown): string {
  const d = parseSafeDate(date);
  if (!d) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}
