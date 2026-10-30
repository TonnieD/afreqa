"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_js_1 = require("../index.js");
(0, vitest_1.describe)("Role-Based Access Control (RBAC) Matrix", () => {
    (0, vitest_1.it)("grants SUPER_ADMIN full administrative privileges", () => {
        const allPermissions = [
            "users:manage",
            "settings:manage",
            "audit:view",
            "events:write",
            "artists:write",
            "subscribers:export",
            "subscribers:manage",
            "campaigns:manage",
            "shop:manage",
        ];
        for (const perm of allPermissions) {
            (0, vitest_1.expect)((0, index_js_1.hasPermission)("SUPER_ADMIN", perm)).toBe(true);
        }
        (0, vitest_1.expect)((0, index_js_1.canExportSubscribers)("SUPER_ADMIN")).toBe(true);
    });
    (0, vitest_1.it)("grants ADMIN operational management but restricts core user management", () => {
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("ADMIN", "events:write")).toBe(true);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("ADMIN", "artists:write")).toBe(true);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("ADMIN", "subscribers:export")).toBe(true);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("ADMIN", "audit:view")).toBe(true);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("ADMIN", "users:manage")).toBe(false);
        (0, vitest_1.expect)((0, index_js_1.canExportSubscribers)("ADMIN")).toBe(true);
    });
    (0, vitest_1.it)("strictly restricts EDITOR to content creation without CRM or audit access", () => {
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("EDITOR", "events:write")).toBe(true);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("EDITOR", "artists:write")).toBe(true);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("EDITOR", "gallery:write")).toBe(true);
        // Forbidden for EDITOR:
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("EDITOR", "subscribers:read")).toBe(false);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("EDITOR", "subscribers:export")).toBe(false);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("EDITOR", "audit:view")).toBe(false);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("EDITOR", "shop:manage")).toBe(false);
        (0, vitest_1.expect)((0, index_js_1.canExportSubscribers)("EDITOR")).toBe(false);
    });
    (0, vitest_1.it)("restricts SUPPORT to read-only subscribers and customer inquiries", () => {
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("SUPPORT", "subscribers:read")).toBe(true);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("SUPPORT", "inquiries:manage")).toBe(true);
        // Forbidden for SUPPORT:
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("SUPPORT", "subscribers:export")).toBe(false);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("SUPPORT", "events:write")).toBe(false);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("SUPPORT", "artists:write")).toBe(false);
        (0, vitest_1.expect)((0, index_js_1.hasPermission)("SUPPORT", "audit:view")).toBe(false);
        (0, vitest_1.expect)((0, index_js_1.canExportSubscribers)("SUPPORT")).toBe(false);
    });
});
//# sourceMappingURL=rbac.test.js.map