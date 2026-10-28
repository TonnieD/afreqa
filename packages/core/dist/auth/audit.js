"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeAuditPayload = sanitizeAuditPayload;
exports.recordAuditLog = recordAuditLog;
const client_js_1 = require("../db/client.js");
const logger_js_1 = require("../logger.js");
/**
 * Sanitizes and masks raw personal data (emails, phone numbers, passwords) in audit payloads.
 */
function sanitizeAuditPayload(data) {
    if (!data)
        return "{}";
    const json = JSON.stringify(data, (key, value) => {
        // Redact password or secret keys entirely
        if (typeof key === "string" && /password|secret|token|hash/i.test(key)) {
            return "[REDACTED]";
        }
        // Mask email addresses
        if (typeof value === "string" && value.includes("@")) {
            const parts = value.split("@");
            if (parts.length === 2) {
                const name = parts[0];
                const domain = parts[1];
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
async function recordAuditLog(options) {
    try {
        const payloadJson = options.payload ? sanitizeAuditPayload(options.payload) : null;
        const maskedEmail = options.userEmail
            ? sanitizeAuditPayload({ email: options.userEmail })
            : null;
        await client_js_1.db.auditLog.create({
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
    }
    catch (err) {
        logger_js_1.logger.error("Failed to write append-only audit log", err, { action: options.action });
    }
}
//# sourceMappingURL=audit.js.map