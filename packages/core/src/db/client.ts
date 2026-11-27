import { PrismaClient } from "@prisma/client";

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

export function isPreQueryConnectionError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: unknown }).code;
  if (typeof code === "string" && PRE_QUERY_CONNECTION_CODES.has(code)) {
    return true;
  }
  const msg = err instanceof Error ? err.message : String(err);
  return PRE_QUERY_PATTERNS.some((p) => msg.includes(p));
}

export function isTransientReadError(err: unknown): boolean {
  if (isPreQueryConnectionError(err)) return true;
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: unknown }).code;
  if (code === "P1008" || code === "P1017") return true;
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("ETIMEDOUT") || msg.includes("ECONNRESET") || msg.includes("Connection terminated unexpectedly");
}

/**
 * Retries a database operation once after a brief delay on cold-start connection failure.
 * - For writes (`isReadOnly: false`): retries ONLY on pre-query connection establishment errors (P1001/P1002/ECONNREFUSED).
 * - For reads (`isReadOnly: true`): retries on pre-query or transient socket errors.
 */
export async function withColdStartRetry<T>(
  operation: () => Promise<T>,
  options: { delayMs?: number; isReadOnly?: boolean } | number = {}
): Promise<T> {
  const delayMs = typeof options === "number" ? options : (options.delayMs ?? 500);
  const isReadOnly = typeof options === "number" ? false : (options.isReadOnly ?? false);

  try {
    return await operation();
  } catch (err) {
    const shouldRetry = isReadOnly ? isTransientReadError(err) : isPreQueryConnectionError(err);
    if (!shouldRetry) {
      throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return operation();
  }
}

function createPrismaClient(): PrismaClient {
  const base = new PrismaClient({
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
  }) as unknown as PrismaClient;
}

declare global {
  var __afreqa_db__: PrismaClient | undefined;
}

export const db: PrismaClient = globalThis.__afreqa_db__ || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__afreqa_db__ = db;
}

export * from "@prisma/client";
