import { PaymentProvider, CreatePaymentOptions, PaymentInitializationResult, WebhookVerificationResult } from "./PaymentProvider.js";
export declare class PaystackPaymentProvider implements PaymentProvider {
    readonly name = "PaystackPaymentProvider (M-Pesa & Card in KES)";
    private fallback;
    private secretKey?;
    constructor(secretKey?: string);
    get isConfigured(): boolean;
    initializePayment(options: CreatePaymentOptions): Promise<PaymentInitializationResult>;
    verifyWebhook(rawBody: string, signatureHeader?: string | null): Promise<WebhookVerificationResult>;
}
export declare const defaultPaystackPaymentProvider: PaystackPaymentProvider;
//# sourceMappingURL=PaystackPaymentProvider.d.ts.map