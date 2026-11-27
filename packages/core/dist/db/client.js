"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.isPreQueryConnectionError = isPreQueryConnectionError;
exports.isTransientReadError = isTransientReadError;
exports.withColdStartRetry = withColdStartRetry;
const client_1 = require("@prisma/client");
/**
 * Prisma error codes & patterns that occur strictly BEFORE a query reaches Postgres
 * (connection establishment / scale-to-zero wake-up), safe to retry once even on writes.
 * Mid-query timeouts or socket resets (P1008, P1017, ETIMEDOUT, ECONNRESET) are
 * intentionally excluded so non-idempotent writes are never duplicated.
 */
const PRE_QUERY_CONNECTION_CODES = new Set(["P1001", "P1002"]);
const PRE_QUERY_PATTERNS = [
    "Can't reach database server",
    "ECONNREFUSED",
    "Connection refused",
];
const READ_OPERATIONS = new Set([
    "findUnique",
    "findUniqueOrThrow",
    "findFirst",
    "findFirstOrThrow",
    "findMany",
    "count",
    "aggregate",
    "groupBy",
]);
function isPreQueryConnectionError(err) {
    if (!err || typeof err !== "object")
        return false;
    const code = err.code;
    if (typeof code === "string" && PRE_QUERY_CONNECTION_CODES.has(code)) {
        return true;
    }
    const msg = err instanceof Error ? err.message : String(err);
    return PRE_QUERY_PATTERNS.some((p) => msg.includes(p));
}
function isTransientReadError(err) {
    if (isPreQueryConnectionError(err))
        return true;
    if (!err || typeof err !== "object")
        return false;
    const code = err.code;
    if (code === "P1008" || code === "P1017")
        return true;
    const msg = err instanceof Error ? err.message : String(err);
    return msg.includes("ETIMEDOUT") || msg.includes("ECONNRESET") || msg.includes("Connection terminated unexpectedly");
}
/**
 * Retries a database operation once after a brief delay on cold-start connection failure.
 * - For writes (`isReadOnly: false`): retries ONLY on pre-query connection establishment errors (P1001/P1002/ECONNREFUSED).
 * - For reads (`isReadOnly: true`): retries on pre-query or transient socket errors.
 */
async function withColdStartRetry(operation, options = {}) {
    const delayMs = typeof options === "number" ? options : (options.delayMs ?? 500);
    const isReadOnly = typeof options === "number" ? false : (options.isReadOnly ?? false);
    try {
        return await operation();
    }
    catch (err) {
        const shouldRetry = isReadOnly ? isTransientReadError(err) : isPreQueryConnectionError(err);
        if (!shouldRetry) {
            throw err;
        }
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return operation();
    }
}
function createPrismaClient() {
    const base = new client_1.PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
    return base.$extends({
        query: {
            $allModels: {
                async $allOperations({ operation, args, query }) {
                    const isReadOnly = READ_OPERATIONS.has(operation);
                    return withColdStartRetry(() => query(args), { isReadOnly });
                },
            },
        },
    });
}
exports.db = globalThis.__afreqa_db__ || createPrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalThis.__afreqa_db__ = exports.db;
}
__exportStar(require("@prisma/client"), exports);
//# sourceMappingURL=client.js.map