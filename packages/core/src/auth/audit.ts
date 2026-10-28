import { db } from "../db/client.js";
import { logger } from "../logger.js";

/**
 * Sanitizes and masks raw personal data (emails, phone numbers, passwords) in audit payloads.
 */
export function sanitizeAuditPayload(data: unknown): string {
  if (!data) return "{}";

  const json = JSON.stringify(data, (key, value) => {
    // Redact password or secret keys entirely
    if (typeof key === "string" && /password|secret|token|hash/i.test(key)) {
      return "[REDACTED]";
    }

    // Mask email addresses
    if (typeof value === "string" && value.includes("@")) {
      const parts = value.split("@");
      if (parts.length === 2) {
        const name = parts[0]!;
        const domain = parts[1]!;
        const maskedName = name.length > 2 ? `${name.slice(0, 2)}***` : `${name}***`;
        return `${maskedName}@${domain}`;
      }
    }

    // Mask phone numbers (e.g. +254 712 345 678 -> +254***78)
    if (typeof value === "string" && /^\+?[0-9]{9,15}$/.test(value.replace(/[\s-]/g, ""))) {
      const clean = value.replace(/[\s-]/g, "");
      return clean.length > 5 ? `${clean.slice(0, 4)}***${clean.slice(-2)}` : "[MASKED PHONE]";
    }

    return value;
  });

  return json;
}

export interface RecordAuditOptions {
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  payload?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function recordAuditLog(options: RecordAuditOptions): Promise<void> {
  try {
    const payloadJson = options.payload ? sanitizeAuditPayload(options.payload) : null;
    const maskedEmail = options.userEmail
      ? sanitizeAuditPayload({ email: options.userEmail })
      : null;

    await db.auditLog.create({
      data: {
        userId: options.userId || null,
        userEmail: maskedEmail ? JSON.parse(maskedEmail).email : null,
        action: options.action,
        resource: options.resource,
        resourceId: options.resourceId || null,
        payloadJson,
        ipAddress: options.ipAddress || null,
        userAgent: options.userAgent || null,
      },
    });
  } catch (err) {
    logger.error("Failed to write append-only audit log", err, { action: options.action });
  }
}

