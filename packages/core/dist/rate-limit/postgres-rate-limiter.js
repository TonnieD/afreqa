"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRateLimit = checkRateLimit;
const client_js_1 = require("../db/client.js");
async function checkRateLimit(key, maxPoints, windowSeconds) {
    const now = new Date();
    const resetAt = new Date(now.getTime() + windowSeconds * 1000);
    try {
        // Atomic upsert with Postgres
        const entry = await client_js_1.db.rateLimitEntry.upsert({
            where: { key },
            create: {
                key,
                points: 1,
                resetAt,
            },
            update: {
                // If expired, reset counter and window; otherwise increment points
                points: {
                    increment: 1,
                },
            },
        });
        // Check if the entry was expired before the increment
        if (entry.resetAt < now) {
            // Reset the window
            await client_js_1.db.rateLimitEntry.update({
                where: { key },
                data: {
                    points: 1,
                    resetAt,
                },
            });
            return {
                allowed: true,
                remaining: maxPoints - 1,
                resetInSeconds: windowSeconds,
            };
        }
        const resetInSeconds = Math.max(0, Math.ceil((entry.resetAt.getTime() - now.getTime()) / 1000));
        const allowed = entry.points <= maxPoints;
        const remaining = Math.max(0, maxPoints - entry.points);
        return {
            allowed,
            remaining,
            resetInSeconds,
        };
    }
    catch {
        // Fallback in case of temporary DB failure: allow request to avoid blocking valid traffic
        return {
            allowed: true,
            remaining: 1,
            resetInSeconds: windowSeconds,
        };
    }
}
//# sourceMappingURL=postgres-rate-limiter.js.map