"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_js_1 = require("../index.js");
(0, vitest_1.describe)("Payment Provider Abstraction Layer & HTML Receipts", () => {
    (0, vitest_1.describe)("MockPaymentProvider (Showcase & Local)", () => {
        const provider = new index_js_1.MockPaymentProvider();
        (0, vitest_1.it)("initializes a valid mock payment reference", async () => {
            const res = await provider.initializePayment({
                orderId: "ord-test-1",
                orderNumber: "AFQ-2026-9999",
                amountKes: 3500,
                customerEmail: "raver@afreqa.com",
                customerName: "Amani Mwangi",
                customerPhone: "+254712345678",
            });
            (0, vitest_1.expect)(res.success).toBe(true);
            (0, vitest_1.expect)(res.reference).toContain("MOCK-TXN-");
            (0, vitest_1.expect)(res.authorizationUrl).toContain("AFQ-2026-9999");
        });
        (0, vitest_1.it)("verifies mock webhook payloads successfully", async () => {
            const payload = JSON.stringify({
                orderId: "ord-test-1",
                reference: "ref-123",
                amountKes: 3500,
                status: "SUCCESS",
            });
            const res = await provider.verifyWebhook(payload);
            (0, vitest_1.expect)(res.isValid).toBe(true);
            (0, vitest_1.expect)(res.status).toBe("SUCCESS");
            (0, vitest_1.expect)(res.orderId).toBe("ord-test-1");
        });
    });
    (0, vitest_1.describe)("PaystackPaymentProvider", () => {
        const provider = new index_js_1.PaystackPaymentProvider();
        (0, vitest_1.it)("falls back gracefully to MockPaymentProvider when secret key is unset", async () => {
            (0, vitest_1.expect)(provider.isConfigured).toBe(false);
            const res = await provider.initializePayment({
                orderId: "ord-test-2",
                orderNumber: "AFQ-2026-8888",
                amountKes: 2200,
                customerEmail: "test@afreqa.com",
                customerName: "Kendi",
                customerPhone: "+254722000000",
            });
            (0, vitest_1.expect)(res.success).toBe(true);
            (0, vitest_1.expect)(res.reference).toContain("MOCK-TXN-");
        });
    });
    (0, vitest_1.describe)("HTML-Only Order Receipt Email", () => {
        (0, vitest_1.it)("renders complete purchase receipt without PDF dependency", () => {
            const html = (0, index_js_1.renderOrderReceiptEmail)({
                customerName: "Amani",
                orderNumber: "AFQ-2026-1234",
                deliveryMethod: "COURIER",
                shippingAddress: "Westlands, Nairobi",
                items: [
                    {
                        title: "Afreqa 'Resonance' Acid Black Hoodie",
                        variantName: "Large / Acid Black",
                        quantity: 1,
                        unitPriceKes: 3500,
                        lineTotalKes: 3500,
                    },
                ],
                subtotalKes: 3500,
                deliveryFeeKes: 300,
                totalKes: 3800,
            });
            (0, vitest_1.expect)(html).toContain("AFQ-2026-1234");
            (0, vitest_1.expect)(html).toContain("Amani");
            (0, vitest_1.expect)(html).toContain("Westlands, Nairobi");
            (0, vitest_1.expect)(html).toContain("KES 3,800");
            (0, vitest_1.expect)(html).toContain("Afreqa 'Resonance' Acid Black Hoodie");
        });
    });
});
//# sourceMappingURL=payments.test.js.map