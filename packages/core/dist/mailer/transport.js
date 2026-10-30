"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailTransporter = void 0;
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_js_1 = require("../logger.js");
// Mailpit is the default development SMTP server (host: localhost or mailpit, port: 1025)
const smtpHost = process.env.SMTP_HOST || "localhost";
const smtpPort = parseInt(process.env.SMTP_PORT || "1025", 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const defaultFrom = process.env.EMAIL_FROM || "Afreqa Nairobi <frequencies@afreqa.com>";
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