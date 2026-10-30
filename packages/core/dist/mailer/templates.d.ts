/**
 * Afreqa Website — HTML-Only Transactional & Marketing Email Templates
 * Styled with Tomorrowland-inspired dark theme, chrome typography, and neon accents.
 */
interface BaseEmailOptions {
    appUrl?: string;
    unsubscribeUrl?: string;
}
interface VerificationEmailOptions extends BaseEmailOptions {
    recipientName?: string | null;
    verifyUrl: string;
    tokenExpiresHours?: number;
}
interface WelcomeEmailOptions extends BaseEmailOptions {
    recipientName?: string | null;
    whatsappCommunityUrl?: string;
    vcardUrl?: string;
}
export declare function renderVerificationEmail({ recipientName, verifyUrl, tokenExpiresHours, unsubscribeUrl, }: VerificationEmailOptions): string;
export declare function renderWelcomeEmail({ recipientName, whatsappCommunityUrl, vcardUrl, unsubscribeUrl, }: WelcomeEmailOptions): string;
export interface OrderItemReceipt {
    title: string;
    variantName?: string | null;
    quantity: number;
    unitPriceKes: number;
    lineTotalKes: number;
}
export interface OrderReceiptEmailOptions extends BaseEmailOptions {
    customerName: string;
    orderNumber: string;
    deliveryMethod: "PICKUP" | "COURIER";
    shippingAddress?: string | null;
    items: OrderItemReceipt[];
    subtotalKes: number;
    deliveryFeeKes: number;
    totalKes: number;
    orderUrl?: string;
}
export declare function renderOrderReceiptEmail({ customerName, orderNumber, deliveryMethod, shippingAddress, items, subtotalKes, deliveryFeeKes, totalKes, orderUrl, unsubscribeUrl, }: OrderReceiptEmailOptions): string;
export {};
//# sourceMappingURL=templates.d.ts.map