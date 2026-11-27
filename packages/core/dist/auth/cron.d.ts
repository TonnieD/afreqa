export interface CronAuthResult {
    ok: boolean;
    status: number;
    error?: string;
}
/**
 * Verifies a scheduler request against CRON_SECRET using constant-time comparison.
 * - Fails closed (503) if CRON_SECRET is unset or shorter than 16 characters.
 * - Accepts `Authorization: Bearer <secret>` (Vercel Cron standard) or `x-cron-secret: <secret>`.
 * - Never reads secrets from URL query parameters.
 */
export declare function verifyCronSecretHeaders(headers: {
    get(name: string): string | null;
}, expectedSecret?: string | undefined): CronAuthResult;
//# sourceMappingURL=cron.d.ts.map