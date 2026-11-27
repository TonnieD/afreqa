import { z } from "zod";
import { logger } from "../logger.js";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_OWNER_URL: z.string().optional(),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().min(8).optional(),
  DEMO_MODE: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  DEMO_BANNER: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  DEMO_CONTENT_UNVERIFIED: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  ROBOTS_NOINDEX: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  VIDEO_UPLOAD_ENABLED: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  SESSION_SECRET: z.string().min(16).default("dev-session-secret-key-at-least-32-chars!"),
  STORAGE_DRIVER: z.enum(["local", "vercel-blob", "r2"]).default("local"),
  STORAGE_UPLOAD_DIR: z.string().default("./uploads"),
  STORAGE_PUBLIC_URL_PREFIX: z.string().default("/uploads"),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  BLOB_PUBLIC_BASE_URL: z.string().optional(),
  GALLERY_MAX_PHOTOS: z.coerce.number().int().positive().default(100),
  HUSTLESASA_STORE_URL: z.string().url().default("https://afreqamusicfestival.hustlesasa.shop/"),
  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default("Afreqa Nairobi <hello@afreqa.com>"),
  ADMIN_NOTIFY_EMAIL: z.string().email().optional().or(z.literal("")),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional().or(z.literal("")),
  EMAIL_ALLOWLIST: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env | null = null;
let demoFlagWarned = false;

export function warnIfDemoFlagsInProduction(env: NodeJS.ProcessEnv = process.env): string[] {
  if (env.NODE_ENV !== "production") return [];
  const active: string[] = [];
  if (env.DEMO_CONTENT_UNVERIFIED === "true") active.push("DEMO_CONTENT_UNVERIFIED=true");
  if (env.DEMO_BANNER === "true") active.push("DEMO_BANNER=true");
  if (env.ROBOTS_NOINDEX === "true") active.push("ROBOTS_NOINDEX=true");
  if (env.EMAIL_ALLOWLIST && env.EMAIL_ALLOWLIST.trim() !== "") active.push("EMAIL_ALLOWLIST=<non-empty>");

  if (active.length > 0 && !demoFlagWarned) {
    demoFlagWarned = true;
    logger.warn("Production startup notice: demo/review flags are active", { activeFlags: active });
  }
  return active;
}

export function getEnv(): Env {
  if (parsedEnv) {
    return parsedEnv;
  }

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment configuration. Check logs for details.");
  }

  warnIfDemoFlagsInProduction(process.env);

  // Production check for seed credentials if seeding in production
  if (result.data.NODE_ENV === "production") {
    if (process.env.SEED_ADMIN === "true") {
      if (!result.data.SEED_ADMIN_EMAIL || !result.data.SEED_ADMIN_PASSWORD) {
        throw new Error(
          "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be explicitly provided in production when running database seeding.",
        );
      }
    }
  }

  parsedEnv = result.data;
  return parsedEnv;
}

