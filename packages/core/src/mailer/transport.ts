import nodemailer from "nodemailer";
import { logger } from "../logger.js";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Mailpit is the default development SMTP server (host: localhost or mailpit, port: 1025)
const smtpHost = process.env.SMTP_HOST || "localhost";
const smtpPort = parseInt(process.env.SMTP_PORT || "1025", 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const defaultFrom = process.env.SMTP_FROM || process.env.EMAIL_FROM || "Afreqa Nairobi <hello@afreqa.com>";

/**
 * Checks whether a recipient address is permitted by the optional EMAIL_ALLOWLIST env var.
 * If EMAIL_ALLOWLIST is unset or empty, all valid recipients are allowed.
 */
export function isEmailAllowed(to: string, allowlistEnv: string | undefined = process.env.EMAIL_ALLOWLIST): boolean {
  if (!allowlistEnv || !allowlistEnv.trim()) {
    return true;
  }
  const allowed = allowlistEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) {
    return true;
  }
  return allowed.includes(to.trim().toLowerCase());
}

export const mailTransporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

export async function sendEmail(options: SendEmailOptions): Promise<{ messageId?: string; accepted?: string[]; skippedAllowlist?: boolean }> {
  if (!isEmailAllowed(options.to)) {
    logger.info("Email skipped: recipient not in EMAIL_ALLOWLIST", {
      to: options.to,
      subject: options.subject,
    });
    return {
      messageId: "skipped-allowlist",
      accepted: [],
      skippedAllowlist: true,
    };
  }

  try {
    const info = await mailTransporter.sendMail({
      from: options.from || defaultFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    });

    logger.info("Email dispatched successfully", {
      to: options.to,
      subject: options.subject,
      messageId: info.messageId,
    });

    return {
      messageId: info.messageId,
      accepted: Array.isArray(info.accepted) ? (info.accepted as string[]) : [],
    };
  } catch (error) {
    logger.error("Failed to dispatch email", { to: options.to, subject: options.subject, error });
    throw error;
  }
}
