"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const origin_js_1 = require("../auth/origin.js");
(0, vitest_1.describe)("Origin / Referer CSRF Validation", () => {
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
    (0, vitest_1.it)("allows safe GET/HEAD/OPTIONS methods without Origin", () => {
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, method: "GET" }).ok).toBe(true);
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, method: "HEAD" }).ok).toBe(true);
    });
    (0, vitest_1.it)("exempts /api/internal/cron and provider webhooks", () => {
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, pathname: "/api/internal/cron" }).ok).toBe(true);
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, pathname: "/api/shop/payments/webhook" }).ok).toBe(true);
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, pathname: "/api/webhooks/email" }).ok).toBe(true);
    });
    (0, vitest_1.it)("allows matching Origin and rejects cross-site Origin", () => {
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, origin: "https://afreqa.vercel.app" }).ok).toBe(true);
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, origin: "https://evil.example.com" })).toEqual({
            ok: false,
            status: 403,
            reason: "Cross-origin request rejected (evil.example.com).",
        });
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, origin: "null" }).ok).toBe(false);
    });
    (0, vitest_1.it)("falls back to Referer when Origin is missing", () => {
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, referer: "https://afreqa.vercel.app/admin/login" }).ok).toBe(true);
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, referer: "https://attacker.test/csrf" }).ok).toBe(false);
    });
    (0, vitest_1.it)("handles missing Origin + missing Referer deliberately via Sec-Fetch-Site (stricter on admin routes)", () => {
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, secFetchSite: "same-origin" }).ok).toBe(true);
        // Admin routes (including login) reject same-site when Origin/Referer are missing
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, pathname: "/api/admin/auth/login", secFetchSite: "same-site" }).ok).toBe(false);
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, pathname: "/api/admin/users", secFetchSite: "same-site" }).ok).toBe(false);
        // Public form routes allow same-site fallback
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, pathname: "/api/contact", secFetchSite: "same-site" }).ok).toBe(true);
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base, secFetchSite: "cross-site" }).ok).toBe(false);
        (0, vitest_1.expect)((0, origin_js_1.verifySameOrigin)({ ...base }).ok).toBe(false);
    });
});
//# sourceMappingURL=origin.test.js.map