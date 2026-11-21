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
    for (const queueName of Object.values(core_1.QUEUE_NAMES)) {
        try {
            await boss.createQueue(queueName);
        }
        catch {
            // ignore if already created
        }
    }
    // 1. Verification Email Worker
    await boss.work(core_1.QUEUE_NAMES.EMAIL_VERIFICATION, async (jobs) => {
        for (const job of jobs) {
            const { email, firstName, verifyUrl, tokenExpiresHours } = job.data;
            core_1.logger.info(`Processing verification email for ${email} (job: ${job.id})`);
            const html = (0, core_1.renderVerificationEmail)({
                recipientName: firstName,
                verifyUrl,
                tokenExpiresHours,
            });
            await (0, core_1.sendEmail)({
                to: email,
                subject: "Confirm your Afreqa Frequency [Verification Required]",
                html,
            });
            core_1.logger.info(`Successfully sent verification email to ${email}`);
        }
    });
    // 2. Welcome Email Worker
    await boss.work(core_1.QUEUE_NAMES.EMAIL_WELCOME, async (jobs) => {
        for (const job of jobs) {
            const { email, firstName, whatsappCommunityUrl, vcardUrl } = job.data;
            core_1.logger.info(`Processing welcome email for ${email} (job: ${job.id})`);
            const html = (0, core_1.renderWelcomeEmail)({
                recipientName: firstName,
                whatsappCommunityUrl,
                vcardUrl,
            });
            await (0, core_1.sendEmail)({
                to: email,
                subject: "Welcome to Afreqa Nairobi — Your Frequency is Verified",
                html,
            });
            core_1.logger.info(`Successfully sent welcome email to ${email}`);
        }
    });
    // 3. Campaign Email Worker
    await boss.work(core_1.QUEUE_NAMES.EMAIL_CAMPAIGN, async (jobs) => {
        for (const job of jobs) {
            const { campaignId, subscriberId, email, subject, html } = job.data;
            core_1.logger.info(`Processing campaign email for ${email} (campaign: ${campaignId})`);
            try {
                await (0, core_1.sendEmail)({
                    to: email,
                    subject,
                    html,
                });
                // Update campaign recipient status
                await core_1.db.campaignRecipient.updateMany({
                    where: { campaignId, subscriberId },
                    data: { status: "SENT", sentAt: new Date() },
                });
                await core_1.db.campaign.update({
                    where: { id: campaignId },
                    data: { sentCount: { increment: 1 } },
                });
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                await core_1.db.campaignRecipient.updateMany({
                    where: { campaignId, subscriberId },
                    data: { status: "FAILED", error: errorMessage },
                });
                await core_1.db.campaign.update({
                    where: { id: campaignId },
                    data: { failedCount: { increment: 1 } },
                });
                throw err; // Allow pg-boss to retry if applicable
            }
        }
    });
    // 4. Scheduled Cleanup Worker (expired rate limit entries & unverified subscribers after 30 days)
    await boss.work(core_1.QUEUE_NAMES.CLEANUP_HOURLY, async () => {
        core_1.logger.info("Running periodic cleanup worker...");
        try {
            const now = new Date();
            // Clean expired rate limit records
            const deletedRateLimits = await core_1.db.rateLimitEntry.deleteMany({
                where: { resetAt: { lt: now } },
            });
            core_1.logger.info(`Cleaned up ${deletedRateLimits.count} expired rate limit entries.`);
            // Clean abandoned partial Tus uploads older than 24 hours
            const cleanedUploads = await (0, core_1.cleanAbandonedTusUploads)(24);
            if (cleanedUploads > 0) {
                core_1.logger.info(`Pruned ${cleanedUploads} abandoned Tus uploads.`);
            }
        }
        catch (err) {
            core_1.logger.error("Cleanup worker error", err);
        }
    });
    // Schedule the hourly cleanup cron
    try {
        await boss.schedule(core_1.QUEUE_NAMES.CLEANUP_HOURLY, "0 * * * *");
        core_1.logger.info("Hourly cleanup job scheduled with cron '0 * * * *'");
    }
    catch (err) {
        core_1.logger.warn("Could not schedule hourly cleanup cron (might already be scheduled)", {
            error: err instanceof Error ? err.message : String(err),
        });
    }
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