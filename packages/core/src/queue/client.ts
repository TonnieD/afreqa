import PgBoss from "pg-boss";
import { logger } from "../logger.js";

declare global {
  var __afreqa_boss__: PgBoss | undefined;
}

let bossInstance: PgBoss | null = globalThis.__afreqa_boss__ || null;
let isStarted = false;
let startPromise: Promise<PgBoss> | null = null;

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
    max: 10,
    application_name: "afreqa-queue",
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
      logger.info("pg-boss connected and started successfully.");

      const queues = [
        "email:verification",
        "email:welcome",
        "email:campaign",
        "cleanup:hourly",
      ];
      for (const q of queues) {
        try {
          await boss.createQueue(q);
        } catch {
          // ignore if already created
        }
      }

      return boss;
    } catch (err) {
      startPromise = null;
      logger.error("Failed to start pg-boss client", err);
      throw err;
    }
  })();

  return startPromise;
}

