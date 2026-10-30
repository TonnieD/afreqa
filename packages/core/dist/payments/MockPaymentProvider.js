"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMockPaymentProvider = exports.MockPaymentProvider = void 0;
const logger_js_1 = require("../logger.js");
class MockPaymentProvider {
    name = "MockPaymentProvider (Demo & Local Showcase)";
    async initializePayment(options) {
        const reference = `MOCK-TXN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
        logger_js_1.logger.info("[MockPaymentProvider] Initialized simulated payment", {
            orderNumber: options.orderNumber,
            amountKes: options.amountKes,
            reference,
        });
        const callback = options.callbackUrl ||
            `/shop/checkout/success?orderNumber=${encodeURIComponent(options.orderNumber)}&reference=${reference}`;
        return {
            provider: this.name,
            reference,
            authorizationUrl: callback,
            success: true,
        };
    }
    async verifyWebhook(rawBody, signatureHeader) {
        try {
            const data = JSON.parse(rawBody);
            return {
                isValid: true,
                orderId: data.orderId,
                transactionReference: data.reference || `mock-ref-${Date.now()}`,
                amountKes: data.amountKes,
                status: data.status === "FAILED" ? "FAILED" : "SUCCESS",
                rawPayload: data,
            };
        }
        catch {
            return {
                isValid: false,
                status: "FAILED",
            };
        }
    }
}
exports.MockPaymentProvider = MockPaymentProvider;
exports.defaultMockPaymentProvider = new MockPaymentProvider();
//# sourceMappingURL=MockPaymentProvider.js.map