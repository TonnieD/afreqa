import PgBoss from "pg-boss";
import { logger } from "../logger.js";

declare global {
  var __afreqa_boss__: PgBoss | undefined;
}

let bossInstance: PgBoss | null = globalThis.__afreqa_boss__ || null;
let isStarted = false;
let startPromise: Promise<PgBoss> | null = null;

/**
 * Serverless-safe pg-boss client for web functions (enqueue-only / cron-fetch).
 * - Tiny connection pool (max: 2)
 * - Disables automatic schema migration (`migrate: false`), background
 *   supervision (`supervise: false`), and scheduling (`schedule: false`).
 * - Schema & queues are provisioned separately by `afreqa_owner` via `queue:init`.
 */
export function getBossClient(): PgBoss {
  if (bossInstance) {
    return bossInstance;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to initialize pg-boss queue client.");
  }

  bossInstance = new PgBoss({
    connectionString,
    max: 2,
    migrate: false,
    supervise: false,
    schedule: false,
    application_name: "afreqa-web-enqueue",
  });

  bossInstance.on("error", (error) => {
    logger.error("pg-boss client error", error);
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__afreqa_boss__ = bossInstance;
  }

  return bossInstance;
}

export async function getStartedBoss(): Promise<PgBoss> {
  const boss = getBossClient();
  if (isStarted) return boss;

  if (startPromise) return startPromise;

  startPromise = (async () => {
    try {
      await boss.start();
      isStarted = true;
      logger.info("pg-boss serverless client started (enqueue/cron mode).");
      return boss;
    } catch (err) {
      startPromise = null;
      logger.error("Failed to start pg-boss client", err);
      throw err;
    }
  })();

  return startPromise;
}
