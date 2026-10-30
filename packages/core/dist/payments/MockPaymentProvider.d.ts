import { PaymentProvider, CreatePaymentOptions, PaymentInitializationResult, WebhookVerificationResult } from "./PaymentProvider.js";
export declare class MockPaymentProvider implements PaymentProvider {
    readonly name = "MockPaymentProvider (Demo & Local Showcase)";
    initializePayment(options: CreatePaymentOptions): Promise<PaymentInitializationResult>;
    verifyWebhook(rawBody: string, signatureHeader?: string | null): Promise<WebhookVerificationResult>;
}
export declare const defaultMockPaymentProvider: MockPaymentProvider;
//# sourceMappingURL=MockPaymentProvider.d.ts.map