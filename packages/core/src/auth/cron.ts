import crypto from "crypto";

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
export function verifyCronSecretHeaders(
  headers: { get(name: string): string | null },
  expectedSecret: string | undefined = process.env.CRON_SECRET
): CronAuthResult {
  if (!expectedSecret || expectedSecret.length < 16) {
    return {
      ok: false,
      status: 503,
      error: "CRON_SECRET is not configured on the server.",
    };
  }

  const authHeader = headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const headerToken = headers.get("x-cron-secret")?.trim() || null;
  const provided = bearerToken || headerToken;

  if (!provided) {
    return { ok: false, status: 401, error: "Missing cron secret header." };
  }

  const expectedBuf = Buffer.from(expectedSecret, "utf-8");
  const providedBuf = Buffer.from(provided, "utf-8");
  if (expectedBuf.length !== providedBuf.length || !crypto.timingSafeEqual(expectedBuf, providedBuf)) {
    return { ok: false, status: 401, error: "Invalid cron secret." };
  }

  return { ok: true, status: 200 };
}
