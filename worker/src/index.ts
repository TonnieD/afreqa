import PgBoss from "pg-boss";
import {
  logger,
  QUEUE_NAMES,
  VerificationEmailPayload,
  WelcomeEmailPayload,
  CampaignEmailPayload,
  sendEmail,
  renderVerificationEmail,
  renderWelcomeEmail,
  cleanAbandonedTusUploads,
  db,
} from "@afreqa/core";

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

  for (const queueName of Object.values(QUEUE_NAMES)) {
    try {
      await boss.createQueue(queueName);
    } catch {
      // ignore if already created
    }
  }

  // 1. Verification Email Worker
  await boss.work<VerificationEmailPayload>(QUEUE_NAMES.EMAIL_VERIFICATION, async (jobs) => {
    for (const job of jobs) {
      const { email, firstName, verifyUrl, tokenExpiresHours } = job.data;
      logger.info(`Processing verification email for ${email} (job: ${job.id})`);
      
      const html = renderVerificationEmail({
        recipientName: firstName,
        verifyUrl,
        tokenExpiresHours,
      });

      await sendEmail({
        to: email,
        subject: "Confirm your Afreqa Frequency [Verification Required]",
        html,
      });

      logger.info(`Successfully sent verification email to ${email}`);
    }
  });

  // 2. Welcome Email Worker
  await boss.work<WelcomeEmailPayload>(QUEUE_NAMES.EMAIL_WELCOME, async (jobs) => {
    for (const job of jobs) {
      const { email, firstName, whatsappCommunityUrl, vcardUrl } = job.data;
      logger.info(`Processing welcome email for ${email} (job: ${job.id})`);

      const html = renderWelcomeEmail({
        recipientName: firstName,
        whatsappCommunityUrl,
        vcardUrl,
      });

      await sendEmail({
        to: email,
        subject: "Welcome to Afreqa Nairobi — Your Frequency is Verified",
        html,
      });

      logger.info(`Successfully sent welcome email to ${email}`);
    }
  });

  // 3. Campaign Email Worker
  await boss.work<CampaignEmailPayload>(QUEUE_NAMES.EMAIL_CAMPAIGN, async (jobs) => {
    for (const job of jobs) {
      const { campaignId, subscriberId, email, subject, html } = job.data;
      logger.info(`Processing campaign email for ${email} (campaign: ${campaignId})`);

      try {
        await sendEmail({
          to: email,
          subject,
          html,
        });

        // Update campaign recipient status
        await db.campaignRecipient.updateMany({
          where: { campaignId, subscriberId },
          data: { status: "SENT", sentAt: new Date() },
        });

        await db.campaign.update({
          where: { id: campaignId },
          data: { sentCount: { increment: 1 } },
        });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        await db.campaignRecipient.updateMany({
          where: { campaignId, subscriberId },
          data: { status: "FAILED", error: errorMessage },
        });

        await db.campaign.update({
          where: { id: campaignId },
          data: { failedCount: { increment: 1 } },
        });
        throw err; // Allow pg-boss to retry if applicable
      }
    }
  });

  // 4. Scheduled Cleanup Worker (expired rate limit entries & unverified subscribers after 30 days)
  await boss.work(QUEUE_NAMES.CLEANUP_HOURLY, async () => {
    logger.info("Running periodic cleanup worker...");
    try {
      const now = new Date();
      // Clean expired rate limit records
      const deletedRateLimits = await db.rateLimitEntry.deleteMany({
        where: { resetAt: { lt: now } },
      });
      logger.info(`Cleaned up ${deletedRateLimits.count} expired rate limit entries.`);

      // Clean abandoned partial Tus uploads older than 24 hours
      const cleanedUploads = await cleanAbandonedTusUploads(24);
      if (cleanedUploads > 0) {
        logger.info(`Pruned ${cleanedUploads} abandoned Tus uploads.`);
      }
    } catch (err) {
      logger.error("Cleanup worker error", err);
    }
  });

  // Schedule the hourly cleanup cron
  try {
    await boss.schedule(QUEUE_NAMES.CLEANUP_HOURLY, "0 * * * *");
    logger.info("Hourly cleanup job scheduled with cron '0 * * * *'");
  } catch (err) {
    logger.warn("Could not schedule hourly cleanup cron (might already be scheduled)", {
      error: err instanceof Error ? err.message : String(err),
    });
  }

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
