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

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const EXEMPT_PREFIXES = [
  "/api/internal/cron",
  "/api/shop/payments/webhook",
  "/api/webhooks/",
];

function collectAllowedHosts(
  host: string | null,
  forwardedHost: string | null,
  appUrl?: string
): Set<string> {
  const allowed = new Set<string>();
  const add = (raw: string | null | undefined) => {
    if (!raw) return;
    for (const part of raw.split(",")) {
      const cleaned = part.trim().toLowerCase();
      if (cleaned) allowed.add(cleaned);
    }
  };

  add(host);
  add(forwardedHost);

  if (appUrl) {
    try {
      add(new URL(appUrl).host);
    } catch {
      // ignore invalid appUrl
    }
  }

  return allowed;
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
export function verifySameOrigin(input: OriginCheckInput): OriginCheckResult {
  const method = input.method.toUpperCase();
  if (SAFE_METHODS.has(method)) {
    return { ok: true, status: 200 };
  }

  if (EXEMPT_PREFIXES.some((prefix) => input.pathname.startsWith(prefix))) {
    return { ok: true, status: 200 };
  }

  const allowedHosts = collectAllowedHosts(input.host, input.forwardedHost, input.appUrl);
  if (allowedHosts.size === 0) {
    return { ok: false, status: 403, reason: "Unable to determine target host for origin check." };
  }

  if (input.origin) {
    if (input.origin === "null") {
      return { ok: false, status: 403, reason: "Opaque 'null' Origin rejected." };
    }
    try {
      const originHost = new URL(input.origin).host.toLowerCase();
      if (!allowedHosts.has(originHost)) {
        return { ok: false, status: 403, reason: `Cross-origin request rejected (${originHost}).` };
      }
      return { ok: true, status: 200 };
    } catch {
      return { ok: false, status: 403, reason: "Malformed Origin header." };
    }
  }

  if (input.referer) {
    try {
      const refererHost = new URL(input.referer).host.toLowerCase();
      if (!allowedHosts.has(refererHost)) {
        return { ok: false, status: 403, reason: `Cross-site Referer rejected (${refererHost}).` };
      }
      return { ok: true, status: 200 };
    } catch {
      return { ok: false, status: 403, reason: "Malformed Referer header." };
    }
  }

  const secFetch = input.secFetchSite?.trim().toLowerCase();
  const isAdminRoute = input.pathname.startsWith("/api/admin");
  if (isAdminRoute) {
    if (secFetch === "same-origin") {
      return { ok: true, status: 200 };
    }
  } else if (secFetch === "same-origin" || secFetch === "same-site") {
    return { ok: true, status: 200 };
  }

  return {
    ok: false,
    status: 403,
    reason: "Missing Origin and Referer headers on state-changing request.",
  };
}
