export type LogLevel = "debug" | "info" | "warn" | "error";
export declare const logger: {
    debug(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>, error?: unknown): void;
    error(message: string, error?: unknown, context?: Record<string, unknown>): void;
};
//# sourceMappingURL=logger.d.ts.map