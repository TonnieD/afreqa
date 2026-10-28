import PgBoss from "pg-boss";
import { logger } from "@afreqa/core";

async function runWorker() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    logger.error("DATABASE_URL is required to start the pg-boss background worker.");
    process.exit(1);
  }

  logger.info("⚡ Starting Afreqa background worker with pg-boss...");
  const boss = new PgBoss(connectionString);

  boss.on("error", (error) => {
    logger.error("pg-boss encountered an unhandled error", error);
  });

  await boss.start();
  logger.info("🚀 Background worker connected and listening for jobs.");

  // 1. Transactional Email Queue Worker
  await boss.work("email:send", async (jobs) => {
    for (const job of jobs) {
      logger.info("Processing email job", { jobId: job.id, name: job.name });
      // Email delivery logic in Phase 2
    }
  });

  // 2. Scheduled Cleanup Worker (abandoned Tus uploads & expired rate limit entries)
  await boss.work("cleanup:worker", async () => {
    logger.info("Running periodic cleanup worker for abandoned uploads and expired sessions");
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down pg-boss gracefully...`);
    await boss.stop({ graceful: true, timeout: 5000 });
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

runWorker().catch((err) => {
  logger.error("Fatal worker startup failure", err);
  process.exit(1);
});
