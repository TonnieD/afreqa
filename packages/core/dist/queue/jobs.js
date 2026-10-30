"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUEUE_NAMES = void 0;
exports.enqueueVerificationEmail = enqueueVerificationEmail;
exports.enqueueWelcomeEmail = enqueueWelcomeEmail;
exports.enqueueCampaignEmail = enqueueCampaignEmail;
const client_js_1 = require("./client.js");
const logger_js_1 = require("../logger.js");
exports.QUEUE_NAMES = {
    EMAIL_VERIFICATION: "email:verification",
    EMAIL_WELCOME: "email:welcome",
    EMAIL_CAMPAIGN: "email:campaign",
    CLEANUP_HOURLY: "cleanup:hourly",
};
/**
 * Enqueue a verification email with 3 automatic retries and exponential backoff
 */
async function enqueueVerificationEmail(payload) {
    try {
        const boss = await (0, client_js_1.getStartedBoss)();
        const jobId = await boss.send(exports.QUEUE_NAMES.EMAIL_VERIFICATION, payload, {
            retryLimit: 3,
            retryDelay: 30, // seconds
            retryBackoff: true,
            expireInMinutes: 60,
        });
        logger_js_1.logger.info("Enqueued verification email job", { jobId, email: payload.email });
        return jobId;
    }
    catch (error) {
        logger_js_1.logger.error("Failed to enqueue verification email", { error, email: payload.email });
        throw error;
    }
}
/**
 * Enqueue a welcome email with 3 automatic retries and exponential backoff
 */
async function enqueueWelcomeEmail(payload) {
    try {
        const boss = await (0, client_js_1.getStartedBoss)();
        const jobId = await boss.send(exports.QUEUE_NAMES.EMAIL_WELCOME, payload, {
            retryLimit: 3,
            retryDelay: 30,
            retryBackoff: true,
            expireInMinutes: 60,
        });
        logger_js_1.logger.info("Enqueued welcome email job", { jobId, email: payload.email });
        return jobId;
    }
    catch (error) {
        logger_js_1.logger.error("Failed to enqueue welcome email", { error, email: payload.email });
        throw error;
    }
}
/**
 * Enqueue a batch of campaign emails
 */
async function enqueueCampaignEmail(payload) {
    try {
        const boss = await (0, client_js_1.getStartedBoss)();
        const jobId = await boss.send(exports.QUEUE_NAMES.EMAIL_CAMPAIGN, payload, {
            retryLimit: 3,
            retryDelay: 60,
            retryBackoff: true,
        });
        return jobId;
    }
    catch (error) {
        logger_js_1.logger.error("Failed to enqueue campaign email", { error, email: payload.email });
        throw error;
    }
}
//# sourceMappingURL=jobs.js.map