export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  message: string;
  level: LogLevel;
  timestamp: string;
  timezone: string;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
  };
}

/**
 * Returns ISO 8601 formatted timestamp string in East Africa Time (EAT, UTC+3, +03:00) using 24-hour time.
 * Example: "2026-11-24T21:20:53.123+03:00"
 */
export function getEatIsoString(date: Date = new Date()): string {
  const eatOffsetMs = 3 * 60 * 60 * 1000;
  const eatDate = new Date(date.getTime() + eatOffsetMs);
  const iso = eatDate.toISOString();
  return iso.replace("Z", "+03:00");
}

/**
 * Formats a date into East Africa Time (EAT, UTC+3) 24-hour string.
 * Example: "24 Nov 2026, 21:20:53 EAT (24h)" or "24 Nov 2026, 21:20:53 EAT (24h UTC+3)"
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

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown): string {
  const payload: LogPayload = {
    message,
    level,
    timestamp: getEatIsoString(new Date()),
    timezone: "EAT (UTC+3, 24h)",
    ...(context && { context }),
  };

  if (error instanceof Error) {
    payload.error = {
      message: error.message,
      stack: error.stack,
    };
  } else if (error) {
    payload.error = { message: String(error) };
  }

  return JSON.stringify(payload);
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatLog("debug", message, context));
    }
  },

  info(message: string, context?: Record<string, unknown>) {
    console.info(formatLog("info", message, context));
  },

  warn(message: string, context?: Record<string, unknown>, error?: unknown) {
    console.warn(formatLog("warn", message, context, error));
  },

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    console.error(formatLog("error", message, context, error));
  },
};
