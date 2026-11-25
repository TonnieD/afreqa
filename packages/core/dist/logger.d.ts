export type LogLevel = "debug" | "info" | "warn" | "error";
/**
 * Returns ISO 8601 formatted timestamp string in East Africa Time (EAT, UTC+3, +03:00) using 24-hour time.
 * Example: "2026-11-24T21:20:53.123+03:00"
 */
export declare function getEatIsoString(date?: Date): string;
/**
 * Formats a date into East Africa Time (EAT, UTC+3) 24-hour string.
 * Example: "24 Nov 2026, 21:20:53 EAT (24h)" or "24 Nov 2026, 21:20:53 EAT (24h UTC+3)"
 */
export declare function formatEatTimestamp(date: Date | string | number, options?: {
    includeSeconds?: boolean;
    includeOffset?: boolean;
}): string;
export declare const logger: {
    debug(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>, error?: unknown): void;
    error(message: string, error?: unknown, context?: Record<string, unknown>): void;
};
//# sourceMappingURL=logger.d.ts.map