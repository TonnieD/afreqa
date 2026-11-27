export interface OriginCheckInput {
    method: string;
    pathname: string;
    origin: string | null;
    referer: string | null;
    host: string | null;
    forwardedHost: string | null;
    secFetchSite: string | null;
    appUrl?: string;
}
export interface OriginCheckResult {
    ok: boolean;
    status: number;
    reason?: string;
}
/**
 * Validates Origin / Referer on state-changing requests (POST, PUT, PATCH, DELETE).
 *
 * Policy for missing Origin:
 * - Falls back to Referer host check when Referer is present.
 * - If BOTH Origin and Referer are missing, allows only when `Sec-Fetch-Site` is
 *   `same-origin` or `same-site` (modern browser same-site navigations/fetches);
 *   rejects with 403 otherwise to block cross-site / headerless CSRF.
 */
export declare function verifySameOrigin(input: OriginCheckInput): OriginCheckResult;
//# sourceMappingURL=origin.d.ts.map