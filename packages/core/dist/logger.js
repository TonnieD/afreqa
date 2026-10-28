"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
function formatLog(level, message, context, error) {
    const payload = {
        message,
        level,
        timestamp: new Date().toISOString(),
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