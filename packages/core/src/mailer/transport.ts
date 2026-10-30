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
const defaultFrom = process.env.EMAIL_FROM || "Afreqa Nairobi <frequencies@afreqa.com>";

export const mailTransporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

export async function sendEmail(options: SendEmailOptions): Promise<{ messageId?: string; accepted?: string[] }> {
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

