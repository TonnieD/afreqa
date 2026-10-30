"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPaystackPaymentProvider = exports.PaystackPaymentProvider = void 0;
const crypto_1 = __importDefault(require("crypto"));
const MockPaymentProvider_js_1 = require("./MockPaymentProvider.js");
const logger_js_1 = require("../logger.js");
class PaystackPaymentProvider {
    name = "PaystackPaymentProvider (M-Pesa & Card in KES)";
    fallback = new MockPaymentProvider_js_1.MockPaymentProvider();
    secretKey;
    constructor(secretKey) {
        this.secretKey = secretKey !== undefined ? secretKey : process.env.PAYSTACK_SECRET_KEY;
    }
    get isConfigured() {
        return Boolean(this.secretKey &&
            this.secretKey.startsWith("sk_") &&
            this.secretKey !== "sk_test_placeholder");
    }
    async initializePayment(options) {
        if (!this.isConfigured) {
            logger_js_1.logger.info("[PaystackPaymentProvider] Paystack secret key not configured; falling back to MockPaymentProvider.");
            return this.fallback.initializePayment(options);
        }
        try {
            // Amount in kobo/cents (multiply KES by 100)
            const amountInCents = options.amountKes * 100;
            const res = await fetch("https://api.paystack.co/transaction/initialize", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: options.customerEmail,
                    amount: amountInCents,
                    currency: "KES",
                    reference: `AFQ-${options.orderNumber}-${Date.now()}`,
                    callback_url: options.callbackUrl,
                    metadata: {
                        orderId: options.orderId,
                        orderNumber: options.orderNumber,
                        customerName: options.customerName,
                        customerPhone: options.customerPhone,
                    },
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.status) {
                throw new Error(data.message || "Failed to initialize Paystack transaction");
            }
            return {
                provider: this.name,
                reference: data.data.reference,
                authorizationUrl: data.data.authorization_url,
                success: true,
            };
        }
        catch (err) {
            logger_js_1.logger.error("Paystack initialization error", err);
            // Fall back in case of network issue
            return this.fallback.initializePayment(options);
        }
    }
    async verifyWebhook(rawBody, signatureHeader) {
        if (!this.isConfigured || !this.secretKey) {
            return this.fallback.verifyWebhook(rawBody, signatureHeader);
        }
        try {
            const hash = crypto_1.default
                .createHmac("sha512", this.secretKey)
                .update(rawBody)
                .digest("hex");
            if (hash !== signatureHeader) {
                logger_js_1.logger.warn("[PaystackPaymentProvider] Webhook signature mismatch.");
                return { isValid: false, status: "FAILED" };
            }
            const payload = JSON.parse(rawBody);
            const isSuccess = payload.event === "charge.success";
            const metadata = payload.data?.metadata;
            return {
                isValid: true,
                orderId: metadata?.orderId,
                transactionReference: payload.data?.reference,
                amountKes: payload.data?.amount ? payload.data.amount / 100 : undefined,
                status: isSuccess ? "SUCCESS" : "FAILED",
                rawPayload: payload,
            };
        }
        catch (err) {
            logger_js_1.logger.error("Paystack webhook verification failed", err);
            return { isValid: false, status: "FAILED" };
        }
    }
}
exports.PaystackPaymentProvider = PaystackPaymentProvider;
exports.defaultPaystackPaymentProvider = new PaystackPaymentProvider();
//# sourceMappingURL=PaystackPaymentProvider.js.map