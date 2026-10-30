export interface CreatePaymentOptions {
    orderId: string;
    orderNumber: string;
    amountKes: number;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    callbackUrl?: string;
}
export interface PaymentInitializationResult {
    provider: string;
    reference: string;
    authorizationUrl?: string;
    success: boolean;
}
export interface WebhookVerificationResult {
    isValid: boolean;
    orderId?: string;
    transactionReference?: string;
    amountKes?: number;
    status: "SUCCESS" | "FAILED" | "PENDING";
    rawPayload?: unknown;
}
export interface PaymentProvider {
    readonly name: string;
    initializePayment(options: CreatePaymentOptions): Promise<PaymentInitializationResult>;
    verifyWebhook(rawBody: string, signatureHeader?: string | null): Promise<WebhookVerificationResult>;
}
//# sourceMappingURL=PaymentProvider.d.ts.map