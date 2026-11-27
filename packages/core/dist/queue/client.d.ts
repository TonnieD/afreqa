import PgBoss from "pg-boss";
declare global {
    var __afreqa_boss__: PgBoss | undefined;
}
/**
 * Serverless-safe pg-boss client for web functions (enqueue-only / cron-fetch).
 * - Tiny connection pool (max: 2)
 * - Disables automatic schema migration (`migrate: false`), background
 *   supervision (`supervise: false`), and scheduling (`schedule: false`).
 * - Schema & queues are provisioned separately by `afreqa_owner` via `queue:init`.
 */
export declare function getBossClient(): PgBoss;
export declare function getStartedBoss(): Promise<PgBoss>;
//# sourceMappingURL=client.d.ts.map