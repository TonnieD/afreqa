import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import {
  db,
  getStartedBoss,
  getStorageDriverName,
  getStorageProvider,
  QUEUE_NAMES,
  sendEmail,
  renderVerificationEmail,
  renderWelcomeEmail,
  cleanAbandonedTusUploads,
  logger,
  type VerificationEmailPayload,
  type WelcomeEmailPayload,
  type CampaignEmailPayload,
  type AdminContactEmailPayload,
} from "@afreqa/core";
import { verifyCronSecret } from "@/lib/host-adapter";

export const dynamic = "force-dynamic";

const MAX_BATCH_SIZE = 5;
const MAX_RUNTIME_MS = 8000;

async function handleCron(req: NextRequest) {
  const startedAt = Date.now();
  const auth = verifyCronSecret(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const hasTimeLeft = () => Date.now() - startedAt < MAX_RUNTIME_MS;

  const summary = {
    verificationSent: 0,
    welcomeSent: 0,
    campaignSent: 0,
    adminContactSent: 0,
    tusCleaned: 0,
    tempUploadsCleaned: 0,
    rateLimitsCleaned: 0,
    unverifiedCleaned: 0,
    exitedEarly: false,
    timedOut: false,
  };

  // 1. Drain bounded batches from pg-boss queues with runtime cap & early exit
  try {
    const boss = await getStartedBoss();

    const [verifyJobs, welcomeJobs, campaignJobs, adminContactJobs] = await Promise.all([
      boss.fetch<VerificationEmailPayload>(QUEUE_NAMES.EMAIL_VERIFICATION, { batchSize: MAX_BATCH_SIZE }),
      boss.fetch<WelcomeEmailPayload>(QUEUE_NAMES.EMAIL_WELCOME, { batchSize: MAX_BATCH_SIZE }),
      boss.fetch<CampaignEmailPayload>(QUEUE_NAMES.EMAIL_CAMPAIGN, { batchSize: MAX_BATCH_SIZE }),
      boss.fetch<AdminContactEmailPayload>(QUEUE_NAMES.EMAIL_CONTACT_ADMIN, { batchSize: MAX_BATCH_SIZE }),
    ]);

    const totalJobs =
      verifyJobs.length + welcomeJobs.length + campaignJobs.length + adminContactJobs.length;

    if (totalJobs === 0) {
      summary.exitedEarly = true;
    } else {
      for (const job of verifyJobs) {
        if (!hasTimeLeft()) {
          summary.timedOut = true;
          break;
        }
        try {
          const { email, firstName, verifyUrl, tokenExpiresHours } = job.data;
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
          await boss.complete(QUEUE_NAMES.EMAIL_VERIFICATION, job.id);
          summary.verificationSent++;
        } catch (err) {
          await boss.fail(QUEUE_NAMES.EMAIL_VERIFICATION, job.id, { error: String(err) });
        }
      }

      for (const job of welcomeJobs) {
        if (!hasTimeLeft()) {
          summary.timedOut = true;
          break;
        }
        try {
          const { email, firstName, whatsappCommunityUrl, vcardUrl } = job.data;
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
          await boss.complete(QUEUE_NAMES.EMAIL_WELCOME, job.id);
          summary.welcomeSent++;
        } catch (err) {
          await boss.fail(QUEUE_NAMES.EMAIL_WELCOME, job.id, { error: String(err) });
        }
      }

      for (const job of campaignJobs) {
        if (!hasTimeLeft()) {
          summary.timedOut = true;
          break;
        }
        const { campaignId, subscriberId, email, subject, html } = job.data;
        try {
          await sendEmail({ to: email, subject, html });
          await db.campaignRecipient.updateMany({
            where: { campaignId, subscriberId },
            data: { status: "SENT", sentAt: new Date() },
          });
          await boss.complete(QUEUE_NAMES.EMAIL_CAMPAIGN, job.id);
          summary.campaignSent++;
        } catch (err) {
          await db.campaignRecipient.updateMany({
            where: { campaignId, subscriberId },
            data: { status: "FAILED" },
          });
          await boss.fail(QUEUE_NAMES.EMAIL_CAMPAIGN, job.id, { error: String(err) });
        }
      }

      for (const job of adminContactJobs) {
        if (!hasTimeLeft()) {
          summary.timedOut = true;
          break;
        }
        try {
          await sendEmail({
            to: job.data.to,
            subject: job.data.subject,
            html: job.data.html,
          });
          await boss.complete(QUEUE_NAMES.EMAIL_CONTACT_ADMIN, job.id);
          summary.adminContactSent++;
        } catch (err) {
          await boss.fail(QUEUE_NAMES.EMAIL_CONTACT_ADMIN, job.id, { error: String(err) });
        }
      }
    }
  } catch (err) {
    logger.error("Cron queue drain encountered an error", err);
  }

  // 2. Cleanup expired rate limits & stale unverified subscribers (only if runtime budget remains)
  if (hasTimeLeft()) {
    if (process.env.VIDEO_UPLOAD_ENABLED === "true") {
      try {
        summary.tusCleaned = await cleanAbandonedTusUploads();
      } catch (err) {
        logger.warn("Tus cleanup skipped in cron", { error: String(err) });
      }
    }

    try {
      const nowMs = Date.now();
      const cutoffDate = new Date(nowMs - 2 * 60 * 60 * 1000);
      const oneDayMs = 24 * 60 * 60 * 1000;

      // Run orphan blob cleanup at most once every 24h without calling list()
      const lastCleanupSetting = await db.siteSetting.findUnique({
        where: { key: "cron.lastTempCleanupAt" },
      });
      const lastCleanupMs = lastCleanupSetting ? Number(lastCleanupSetting.value) || 0 : 0;

      if (nowMs - lastCleanupMs >= oneDayMs) {
        const stalePending = await db.pendingUpload.findMany({
          where: { createdAt: { lt: cutoffDate } },
          take: 50,
        });

        if (stalePending.length > 0) {
          const storage = getStorageProvider();
          for (const item of stalePending) {
            try {
              await storage.delete(item.key);
              summary.tempUploadsCleaned++;
            } catch (delErr) {
              logger.warn("Failed to delete stale PendingUpload blob by key", {
                key: item.key,
                error: String(delErr),
              });
            }
          }
          await db.pendingUpload.deleteMany({
            where: { id: { in: stalePending.map((s) => s.id) } },
          });
        }

        if (getStorageDriverName() === "local") {
          const tempDir = path.resolve(process.env.STORAGE_UPLOAD_DIR || "./uploads", "temp", "originals");
          try {
            const entries = await fs.readdir(tempDir, { withFileTypes: true });
            for (const entry of entries) {
              if (!entry.isFile()) continue;
              const fullPath = path.join(tempDir, entry.name);
              const stat = await fs.stat(fullPath);
              if (stat.mtimeMs < cutoffDate.getTime()) {
                await fs.unlink(fullPath);
                summary.tempUploadsCleaned++;
              }
            }
          } catch {
            // Directory may not exist yet
          }
        }

        await db.siteSetting.upsert({
          where: { key: "cron.lastTempCleanupAt" },
          create: { key: "cron.lastTempCleanupAt", value: String(nowMs) },
          update: { value: String(nowMs) },
        });
      }
    } catch (err) {
      logger.warn("Temp upload cleanup failed in cron", { error: String(err) });
    }

    try {
      const now = new Date();
      const rateRes = await db.rateLimitEntry.deleteMany({
        where: { resetAt: { lt: now } },
      });
      summary.rateLimitsCleaned = rateRes.count;

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const subRes = await db.subscriber.deleteMany({
        where: {
          emailStatus: "UNVERIFIED",
          createdAt: { lt: sevenDaysAgo },
        },
      });
      summary.unverifiedCleaned = subRes.count;
    } catch (err) {
      logger.error("Database cleanup failed in cron", err);
    }
  }

  return NextResponse.json({ ok: true, durationMs: Date.now() - startedAt, summary });
}

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}
