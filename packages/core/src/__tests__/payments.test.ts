import { describe, it, expect } from "vitest";
import {
  MockPaymentProvider,
  PaystackPaymentProvider,
  renderOrderReceiptEmail,
} from "../index.js";

describe("Payment Provider Abstraction Layer & HTML Receipts", () => {
  describe("MockPaymentProvider (Showcase & Local)", () => {
    const provider = new MockPaymentProvider();

    it("initializes a valid mock payment reference", async () => {
      const res = await provider.initializePayment({
        orderId: "ord-test-1",
        orderNumber: "AFQ-2026-9999",
        amountKes: 3500,
        customerEmail: "raver@afreqa.com",
        customerName: "Amani Mwangi",
        customerPhone: "+254712345678",
      });

      expect(res.success).toBe(true);
      expect(res.reference).toContain("MOCK-TXN-");
      expect(res.authorizationUrl).toContain("AFQ-2026-9999");
    });

    it("verifies mock webhook payloads successfully", async () => {
      const payload = JSON.stringify({
        orderId: "ord-test-1",
        reference: "ref-123",
        amountKes: 3500,
        status: "SUCCESS",
      });

      const res = await provider.verifyWebhook(payload);
      expect(res.isValid).toBe(true);
      expect(res.status).toBe("SUCCESS");
      expect(res.orderId).toBe("ord-test-1");
    });
  });

  describe("PaystackPaymentProvider", () => {
    const provider = new PaystackPaymentProvider();

    it("falls back gracefully to MockPaymentProvider when secret key is unset", async () => {
      expect(provider.isConfigured).toBe(false);

      const res = await provider.initializePayment({
        orderId: "ord-test-2",
        orderNumber: "AFQ-2026-8888",
        amountKes: 2200,
        customerEmail: "test@afreqa.com",
        customerName: "Kendi",
        customerPhone: "+254722000000",
      });

      expect(res.success).toBe(true);
      expect(res.reference).toContain("MOCK-TXN-");
    });
  });

  describe("HTML-Only Order Receipt Email", () => {
    it("renders complete purchase receipt without PDF dependency", () => {
      const html = renderOrderReceiptEmail({
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

      expect(html).toContain("AFQ-2026-1234");
      expect(html).toContain("Amani");
      expect(html).toContain("Westlands, Nairobi");
      expect(html).toContain("KES 3,800");
      expect(html).toContain("Afreqa 'Resonance' Acid Black Hoodie");
    });
  });
});

