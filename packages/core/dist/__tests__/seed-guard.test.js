"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const seed_guard_js_1 = require("../db/seed-guard.js");
(0, vitest_1.describe)("Local Demo Admin Seed Guard", () => {
    (0, vitest_1.it)("refuses demo admin seeding in production even with localhost DATABASE_URL", () => {
        (0, vitest_1.expect)((0, seed_guard_js_1.isLocalDemoSeedAllowed)({
            NODE_ENV: "production",
            DATABASE_URL: "postgresql://postgres:pass@localhost:5433/afreqa_db",
        })).toBe(false);
    });
    (0, vitest_1.it)("refuses demo admin seeding when DATABASE_URL points to Neon or any remote host", () => {
        (0, vitest_1.expect)((0, seed_guard_js_1.isLocalDemoSeedAllowed)({
            NODE_ENV: "development",
            DATABASE_URL: "postgresql://user:pass@ep-cool-wave-1234.eu-central-1.aws.neon.tech/neondb?sslmode=require",
        })).toBe(false);
        (0, vitest_1.expect)((0, seed_guard_js_1.isLocalDemoSeedAllowed)({
            NODE_ENV: "development",
            DATABASE_URL: undefined,
        })).toBe(false);
    });
    (0, vitest_1.it)("allows demo admin seeding only in non-production with localhost or Docker DB", () => {
        (0, vitest_1.expect)((0, seed_guard_js_1.isLocalDemoSeedAllowed)({
            NODE_ENV: "development",
            DATABASE_URL: "postgresql://postgres:pass@localhost:5433/afreqa_db",
        })).toBe(true);
        (0, vitest_1.expect)((0, seed_guard_js_1.isLocalDemoSeedAllowed)({
            NODE_ENV: "development",
            DATABASE_URL: "postgresql://postgres:pass@db:5432/afreqa_db",
        })).toBe(true);
    });
});
//# sourceMappingURL=seed-guard.test.js.map