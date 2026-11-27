import { describe, it, expect } from "vitest";
import { verifySameOrigin } from "../auth/origin.js";

describe("Origin / Referer CSRF Validation", () => {
  const base = {
    method: "POST",
    pathname: "/api/admin/auth/login",
    host: "afreqa.vercel.app",
    forwardedHost: null,
    origin: null,
    referer: null,
    secFetchSite: null,
    appUrl: "https://afreqa.vercel.app",
  };

  it("allows safe GET/HEAD/OPTIONS methods without Origin", () => {
    expect(verifySameOrigin({ ...base, method: "GET" }).ok).toBe(true);
    expect(verifySameOrigin({ ...base, method: "HEAD" }).ok).toBe(true);
  });

  it("exempts /api/internal/cron and provider webhooks", () => {
    expect(verifySameOrigin({ ...base, pathname: "/api/internal/cron" }).ok).toBe(true);
    expect(verifySameOrigin({ ...base, pathname: "/api/shop/payments/webhook" }).ok).toBe(true);
    expect(verifySameOrigin({ ...base, pathname: "/api/webhooks/email" }).ok).toBe(true);
  });

  it("allows matching Origin and rejects cross-site Origin", () => {
    expect(verifySameOrigin({ ...base, origin: "https://afreqa.vercel.app" }).ok).toBe(true);
    expect(verifySameOrigin({ ...base, origin: "https://evil.example.com" })).toEqual({
      ok: false,
      status: 403,
      reason: "Cross-origin request rejected (evil.example.com).",
    });
    expect(verifySameOrigin({ ...base, origin: "null" }).ok).toBe(false);
  });

  it("falls back to Referer when Origin is missing", () => {
    expect(verifySameOrigin({ ...base, referer: "https://afreqa.vercel.app/admin/login" }).ok).toBe(true);
    expect(verifySameOrigin({ ...base, referer: "https://attacker.test/csrf" }).ok).toBe(false);
  });

  it("handles missing Origin + missing Referer deliberately via Sec-Fetch-Site (stricter on admin routes)", () => {
    expect(verifySameOrigin({ ...base, secFetchSite: "same-origin" }).ok).toBe(true);
    // Admin routes (including login) reject same-site when Origin/Referer are missing
    expect(verifySameOrigin({ ...base, pathname: "/api/admin/auth/login", secFetchSite: "same-site" }).ok).toBe(false);
    expect(verifySameOrigin({ ...base, pathname: "/api/admin/users", secFetchSite: "same-site" }).ok).toBe(false);
    // Public form routes allow same-site fallback
    expect(verifySameOrigin({ ...base, pathname: "/api/contact", secFetchSite: "same-site" }).ok).toBe(true);
    expect(verifySameOrigin({ ...base, secFetchSite: "cross-site" }).ok).toBe(false);
    expect(verifySameOrigin({ ...base }).ok).toBe(false);
  });
});
