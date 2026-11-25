"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.getEatIsoString = getEatIsoString;
exports.formatEatTimestamp = formatEatTimestamp;
/**
 * Returns ISO 8601 formatted timestamp string in East Africa Time (EAT, UTC+3, +03:00) using 24-hour time.
 * Example: "2026-11-24T21:20:53.123+03:00"
 */
function getEatIsoString(date = new Date()) {
    const eatOffsetMs = 3 * 60 * 60 * 1000;
    const eatDate = new Date(date.getTime() + eatOffsetMs);
    const iso = eatDate.toISOString();
    return iso.replace("Z", "+03:00");
}
/**
 * Formats a date into East Africa Time (EAT, UTC+3) 24-hour string.
 * Example: "24 Nov 2026, 21:20:53 EAT (24h)" or "24 Nov 2026, 21:20:53 EAT (24h UTC+3)"
 */
function formatEatTimestamp(date, options) {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    if (isNaN(d.getTime()))
        return "Invalid Date";
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
function formatLog(level, message, context, error) {
    const payload = {
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
    }
    else if (error) {
        payload.error = { message: String(error) };
    }
    return JSON.stringify(payload);
}
exports.logger = {
    debug(message, context) {
        if (process.env.NODE_ENV !== "production") {
            console.debug(formatLog("debug", message, context));
        }
    },
    info(message, context) {
        console.info(formatLog("info", message, context));
    },
    warn(message, context, error) {
        console.warn(formatLog("warn", message, context, error));
    },
    error(message, error, context) {
        console.error(formatLog("error", message, context, error));
    },
};
//# sourceMappingURL=logger.js.map