import { getStartedBoss } from "./client.js";
import { logger } from "../logger.js";

export const QUEUE_NAMES = {
  EMAIL_VERIFICATION: "email:verification",
  EMAIL_WELCOME: "email:welcome",
  EMAIL_CAMPAIGN: "email:campaign",
  CLEANUP_HOURLY: "cleanup:hourly",
} as const;

export interface VerificationEmailPayload {
  subscriberId: string;
  email: string;
  firstName?: string | null;
  verifyUrl: string;
  tokenExpiresHours?: number;
}

export interface WelcomeEmailPayload {
  subscriberId: string;
  email: string;
  firstName?: string | null;
  whatsappCommunityUrl?: string;
  vcardUrl?: string;
}

export interface CampaignEmailPayload {
  campaignId: string;
  subscriberId: string;
  email: string;
  subject: string;
  html: string;
}

/**
 * Enqueue a verification email with 3 automatic retries and exponential backoff
 */
export async function enqueueVerificationEmail(payload: VerificationEmailPayload): Promise<string | null> {
  try {
    const boss = await getStartedBoss();
    const jobId = await boss.send(QUEUE_NAMES.EMAIL_VERIFICATION, payload, {
      retryLimit: 3,
      retryDelay: 30, // seconds
      retryBackoff: true,
      expireInMinutes: 60,
    });
    logger.info("Enqueued verification email job", { jobId, email: payload.email });
    return jobId;
  } catch (error) {
    logger.error("Failed to enqueue verification email", { error, email: payload.email });
    throw error;
  }
}

/**
 * Enqueue a welcome email with 3 automatic retries and exponential backoff
 */
export async function enqueueWelcomeEmail(payload: WelcomeEmailPayload): Promise<string | null> {
  try {
    const boss = await getStartedBoss();
    const jobId = await boss.send(QUEUE_NAMES.EMAIL_WELCOME, payload, {
      retryLimit: 3,
      retryDelay: 30,
      retryBackoff: true,
      expireInMinutes: 60,
    });
    logger.info("Enqueued welcome email job", { jobId, email: payload.email });
    return jobId;
  } catch (error) {
    logger.error("Failed to enqueue welcome email", { error, email: payload.email });
    throw error;
  }
}

/**
 * Enqueue a batch of campaign emails
 */
export async function enqueueCampaignEmail(payload: CampaignEmailPayload): Promise<string | null> {
  try {
    const boss = await getStartedBoss();
    const jobId = await boss.send(QUEUE_NAMES.EMAIL_CAMPAIGN, payload, {
      retryLimit: 3,
      retryDelay: 60,
      retryBackoff: true,
    });
    return jobId;
  } catch (error) {
    logger.error("Failed to enqueue campaign email", { error, email: payload.email });
    throw error;
  }
}

