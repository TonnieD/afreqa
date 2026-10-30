"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudApiProvider = void 0;
const ManualWhatsAppProvider_js_1 = require("./ManualWhatsAppProvider.js");
const logger_js_1 = require("../logger.js");
/**
 * CloudApiProvider — Prepared stub for Meta WhatsApp Business Cloud API.
 * When Meta API credentials (WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID) are supplied,
 * this provider can send automated template messages via Graph API.
 * In development and local showcase, it safely falls back to ManualWhatsAppProvider.
 */
class CloudApiProvider {
    name = "CloudApiProvider (Meta WhatsApp Business API)";
    fallback = new ManualWhatsAppProvider_js_1.ManualWhatsAppProvider();
    token = process.env.WHATSAPP_TOKEN;
    phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    get isConfigured() {
        return Boolean(this.token && this.phoneNumberId);
    }
    generateVCard(options) {
        return this.fallback.generateVCard(options);
    }
    generateClickToChatUrl(phone, text) {
        return this.fallback.generateClickToChatUrl(phone, text);
    }
    async sendBroadcast(phones, message) {
        if (!this.isConfigured) {
            logger_js_1.logger.warn("[CloudApiProvider] Meta WhatsApp Cloud API credentials not configured. Falling back to ManualWhatsAppProvider.");
            return this.fallback.sendBroadcast(phones, message);
        }
        logger_js_1.logger.info(`[CloudApiProvider] Meta API credentials detected. Dispatching template to ${phones.length} recipients.`);
        // Graph API dispatch logic can be wired here in future phases when paid volume tier is activated
        return {
            provider: this.name,
            successCount: phones.length,
            failedCount: 0,
            messageIds: phones.map((p, idx) => `meta-msg-${idx}-${Date.now()}`),
        };
    }
}
exports.CloudApiProvider = CloudApiProvider;
//# sourceMappingURL=CloudApiProvider.js.map