import {
  PaymentProvider,
  CreatePaymentOptions,
  PaymentInitializationResult,
  WebhookVerificationResult,
} from "./PaymentProvider.js";
import { logger } from "../logger.js";

export class MockPaymentProvider implements PaymentProvider {
  readonly name = "MockPaymentProvider (Demo & Local Showcase)";

  async initializePayment(options: CreatePaymentOptions): Promise<PaymentInitializationResult> {
    const reference = `MOCK-TXN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    logger.info("[MockPaymentProvider] Initialized simulated payment", {
      orderNumber: options.orderNumber,
      amountKes: options.amountKes,
      reference,
    });

    const callback =
      options.callbackUrl ||
      `/shop/checkout/success?orderNumber=${encodeURIComponent(options.orderNumber)}&reference=${reference}`;

    return {
      provider: this.name,
      reference,
      authorizationUrl: callback,
      success: true,
    };
  }

  async verifyWebhook(
    rawBody: string,
    signatureHeader?: string | null
  ): Promise<WebhookVerificationResult> {
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
    } catch {
      return {
        isValid: false,
        status: "FAILED",
      };
    }
  }
}

export const defaultMockPaymentProvider = new MockPaymentProvider();

