"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_boss_1 = __importDefault(require("pg-boss"));
const core_1 = require("@afreqa/core");
async function runWorker() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        core_1.logger.error("DATABASE_URL is required to start the pg-boss background worker.");
        process.exit(1);
    }
    core_1.logger.info("⚡ Starting Afreqa background worker with pg-boss...");
    const boss = new pg_boss_1.default(connectionString);
    boss.on("error", (error) => {
        core_1.logger.error("pg-boss encountered an unhandled error", error);
    });
    await boss.start();
    core_1.logger.info("🚀 Background worker connected and listening for jobs.");
    // 1. Transactional Email Queue Worker
    await boss.work("email:send", async (jobs) => {
        for (const job of jobs) {
            core_1.logger.info("Processing email job", { jobId: job.id, name: job.name });
            // Email delivery logic in Phase 2
        }
    });
    // 2. Scheduled Cleanup Worker (abandoned Tus uploads & expired rate limit entries)
    await boss.work("cleanup:worker", async () => {
        core_1.logger.info("Running periodic cleanup worker for abandoned uploads and expired sessions");
    });
    // Graceful shutdown
    const shutdown = async (signal) => {
        core_1.logger.info(`Received ${signal}, shutting down pg-boss gracefully...`);
        await boss.stop({ graceful: true, timeout: 5000 });
        process.exit(0);
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
}
runWorker().catch((err) => {
    core_1.logger.error("Fatal worker startup failure", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map