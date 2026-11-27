"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailTransporter = void 0;
exports.isEmailAllowed = isEmailAllowed;
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_js_1 = require("../logger.js");
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
function isEmailAllowed(to, allowlistEnv = process.env.EMAIL_ALLOWLIST) {
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
exports.mailTransporter = nodemailer_1.default.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
    tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
    },
});
async function sendEmail(options) {
    if (!isEmailAllowed(options.to)) {
        logger_js_1.logger.info("Email skipped: recipient not in EMAIL_ALLOWLIST", {
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
        const info = await exports.mailTransporter.sendMail({
            from: options.from || defaultFrom,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text || options.html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
        });
        logger_js_1.logger.info("Email dispatched successfully", {
            to: options.to,
            subject: options.subject,
            messageId: info.messageId,
        });
        return {
            messageId: info.messageId,
            accepted: Array.isArray(info.accepted) ? info.accepted : [],
        };
    }
    catch (error) {
        logger_js_1.logger.error("Failed to dispatch email", { to: options.to, subject: options.subject, error });
        throw error;
    }
}
//# sourceMappingURL=transport.js.map