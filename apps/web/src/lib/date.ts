/**
 * East Africa Time (EAT / UTC+3, 24-Hour System) Date & Timestamp Utilities
 * AFREQA official operations base: Nairobi, Kenya (UTC+3, 24-hour military clock)
 */

export function formatEatTimestamp(
  date: Date | string | number,
  options?: { includeSeconds?: boolean; includeOffset?: boolean }
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid Date";

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
  date: Date | string | number,
  options?: { includeSeconds?: boolean }
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";

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
  date: Date | string | number,
  options?: { includeSeconds?: boolean }
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    hour: "2-digit",
    minute: "2-digit",
    second: options?.includeSeconds ? "2-digit" : undefined,
    hourCycle: "h23",
    hour12: false,
  }).format(d);
}

export function formatEatDate(date: Date | string | number): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}
