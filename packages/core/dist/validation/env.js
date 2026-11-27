"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
exports.warnIfDemoFlagsInProduction = warnIfDemoFlagsInProduction;
exports.getEnv = getEnv;
const zod_1 = require("zod");
const logger_js_1 = require("../logger.js");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
    DATABASE_OWNER_URL: zod_1.z.string().optional(),
    SEED_ADMIN_EMAIL: zod_1.z.string().email().optional(),
    SEED_ADMIN_PASSWORD: zod_1.z.string().min(8).optional(),
    DEMO_MODE: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "true"),
    DEMO_BANNER: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "true"),
    DEMO_CONTENT_UNVERIFIED: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "true"),
    ROBOTS_NOINDEX: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "true"),
    VIDEO_UPLOAD_ENABLED: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "true"),
    SESSION_SECRET: zod_1.z.string().min(16).default("dev-session-secret-key-at-least-32-chars!"),
    STORAGE_DRIVER: zod_1.z.enum(["local", "vercel-blob", "r2"]).default("local"),
    STORAGE_UPLOAD_DIR: zod_1.z.string().default("./uploads"),
    STORAGE_PUBLIC_URL_PREFIX: zod_1.z.string().default("/uploads"),
    BLOB_READ_WRITE_TOKEN: zod_1.z.string().optional(),
    BLOB_PUBLIC_BASE_URL: zod_1.z.string().optional(),
    GALLERY_MAX_PHOTOS: zod_1.z.coerce.number().int().positive().default(100),
    HUSTLESASA_STORE_URL: zod_1.z.string().url().default("https://afreqamusicfestival.hustlesasa.shop/"),
    SMTP_HOST: zod_1.z.string().default("localhost"),
    SMTP_PORT: zod_1.z.coerce.number().default(1025),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    SMTP_FROM: zod_1.z.string().default("Afreqa Nairobi <hello@afreqa.com>"),
    ADMIN_NOTIFY_EMAIL: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    ADMIN_NOTIFICATION_EMAIL: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    EMAIL_ALLOWLIST: zod_1.z.string().optional(),
    CRON_SECRET: zod_1.z.string().optional(),
    NEXT_PUBLIC_APP_URL: zod_1.z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: zod_1.z.string().optional(),
});
let parsedEnv = null;
let demoFlagWarned = false;
function warnIfDemoFlagsInProduction(env = process.env) {
    if (env.NODE_ENV !== "production")
        return [];
    const active = [];
    if (env.DEMO_CONTENT_UNVERIFIED === "true")
        active.push("DEMO_CONTENT_UNVERIFIED=true");
    if (env.DEMO_BANNER === "true")
        active.push("DEMO_BANNER=true");
    if (env.ROBOTS_NOINDEX === "true")
        active.push("ROBOTS_NOINDEX=true");
    if (env.EMAIL_ALLOWLIST && env.EMAIL_ALLOWLIST.trim() !== "")
        active.push("EMAIL_ALLOWLIST=<non-empty>");
    if (active.length > 0 && !demoFlagWarned) {
        demoFlagWarned = true;
        logger_js_1.logger.warn("Production startup notice: demo/review flags are active", { activeFlags: active });
    }
    return active;
}
function getEnv() {
    if (parsedEnv) {
        return parsedEnv;
    }
    const result = exports.envSchema.safeParse(process.env);
    if (!result.success) {
        console.error("❌ Invalid environment variables:", result.error.format());
        throw new Error("Invalid environment configuration. Check logs for details.");
    }
    warnIfDemoFlagsInProduction(process.env);
    // Production check for seed credentials if seeding in production
    if (result.data.NODE_ENV === "production") {
        if (process.env.SEED_ADMIN === "true") {
            if (!result.data.SEED_ADMIN_EMAIL || !result.data.SEED_ADMIN_PASSWORD) {
                throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be explicitly provided in production when running database seeding.");
            }
        }
    }
    parsedEnv = result.data;
    return parsedEnv;
}
//# sourceMappingURL=env.js.map