import { MessagingProvider, VCardOptions, BroadcastResult } from "./MessagingProvider.js";
/**
 * CloudApiProvider — Prepared stub for Meta WhatsApp Business Cloud API.
 * When Meta API credentials (WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID) are supplied,
 * this provider can send automated template messages via Graph API.
 * In development and local showcase, it safely falls back to ManualWhatsAppProvider.
 */
export declare class CloudApiProvider implements MessagingProvider {
    readonly name = "CloudApiProvider (Meta WhatsApp Business API)";
    private fallback;
    private token;
    private phoneNumberId;
    get isConfigured(): boolean;
    generateVCard(options: VCardOptions): string;
    generateClickToChatUrl(phone: string, text?: string): string;
    sendBroadcast(phones: string[], message: string): Promise<BroadcastResult>;
}
//# sourceMappingURL=CloudApiProvider.d.ts.map