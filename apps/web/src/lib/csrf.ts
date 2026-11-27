import { NextRequest, NextResponse } from "next/server";
import { verifySameOrigin } from "@afreqa/core";

/**
 * Enforces Origin/Referer CSRF validation on state-changing API requests.
 * Returns null if valid, or a 403 NextResponse if rejected.
 */
export function assertSameOrigin(req: NextRequest): NextResponse | null {
  const result = verifySameOrigin({
    method: req.method,
    pathname: req.nextUrl.pathname,
    origin: req.headers.get("origin"),
    referer: req.headers.get("referer"),
    host: req.headers.get("host"),
    forwardedHost: req.headers.get("x-forwarded-host"),
    secFetchSite: req.headers.get("sec-fetch-site"),
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.reason || "Forbidden: Invalid request origin" },
      { status: result.status }
    );
  }

  return null;
}
