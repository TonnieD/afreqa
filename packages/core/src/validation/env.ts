import { z } from "zod";

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
  SESSION_SECRET: z.string().min(16).default("dev-session-secret-key-at-least-32-chars!"),
  STORAGE_UPLOAD_DIR: z.string().default("./uploads"),
  STORAGE_PUBLIC_URL_PREFIX: z.string().default("/uploads"),
  HUSTLESASA_STORE_URL: z.string().url().default("https://afreqanairobi.hustlesasa.shop/"),
  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default("Afreqa Nairobi <hello@afreqa.com>"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env | null = null;

export function getEnv(): Env {
  if (parsedEnv) {
    return parsedEnv;
  }

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment configuration. Check logs for details.");
  }

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

