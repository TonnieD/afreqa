import { PrismaClient } from "@prisma/client";
export declare function isPreQueryConnectionError(err: unknown): boolean;
export declare function isTransientReadError(err: unknown): boolean;
/**
 * Retries a database operation once after a brief delay on cold-start connection failure.
 * - For writes (`isReadOnly: false`): retries ONLY on pre-query connection establishment errors (P1001/P1002/ECONNREFUSED).
 * - For reads (`isReadOnly: true`): retries on pre-query or transient socket errors.
 */
export declare function withColdStartRetry<T>(operation: () => Promise<T>, options?: {
    delayMs?: number;
    isReadOnly?: boolean;
} | number): Promise<T>;
declare global {
    var __afreqa_db__: PrismaClient | undefined;
}
export declare const db: PrismaClient;
export * from "@prisma/client";
//# sourceMappingURL=client.d.ts.map