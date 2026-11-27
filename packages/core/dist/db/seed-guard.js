"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalDemoSeedAllowed = isLocalDemoSeedAllowed;
const ALLOWED_LOCAL_HOSTS = new Set([
    "localhost",
    "127.0.0.1",
    "::1",
    "db",
    "postgres",
    "afreqa-db",
    "afreqa_db",
]);
/**
 * Determines whether the local-development-only demo admin (`admin@afreqa.local`)
 * may be seeded. Strictly refuses when NODE_ENV === "production" or when
 * DATABASE_URL does not point to a local/Docker database host.
 */
function isLocalDemoSeedAllowed(env) {
    if (env.NODE_ENV === "production") {
        return false;
    }
    const dbUrl = env.DATABASE_URL;
    if (!dbUrl) {
        return false;
    }
    try {
        const parsed = new URL(dbUrl);
        const hostname = parsed.hostname.toLowerCase();
        return ALLOWED_LOCAL_HOSTS.has(hostname);
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=seed-guard.js.map