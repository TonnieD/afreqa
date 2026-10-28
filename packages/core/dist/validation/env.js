"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
exports.getEnv = getEnv;
const zod_1 = require("zod");
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
    SESSION_SECRET: zod_1.z.string().min(16).default("dev-session-secret-key-at-least-32-chars!"),
    STORAGE_UPLOAD_DIR: zod_1.z.string().default("./uploads"),
    STORAGE_PUBLIC_URL_PREFIX: zod_1.z.string().default("/uploads"),
    HUSTLESASA_STORE_URL: zod_1.z.string().url().default("https://afreqanairobi.hustlesasa.shop/"),
    SMTP_HOST: zod_1.z.string().default("localhost"),
    SMTP_PORT: zod_1.z.coerce.number().default(1025),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    SMTP_FROM: zod_1.z.string().default("Afreqa Nairobi <hello@afreqa.com>"),
    NEXT_PUBLIC_APP_URL: zod_1.z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: zod_1.z.string().optional(),
});
let parsedEnv = null;
function getEnv() {
    if (parsedEnv) {
        return parsedEnv;
    }
    const result = exports.envSchema.safeParse(process.env);
    if (!result.success) {
        console.error("❌ Invalid environment variables:", result.error.format());
        throw new Error("Invalid environment configuration. Check logs for details.");
    }
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