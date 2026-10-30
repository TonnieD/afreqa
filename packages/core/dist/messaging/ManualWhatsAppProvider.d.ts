import { MessagingProvider, VCardOptions, BroadcastResult } from "./MessagingProvider.js";
export declare class ManualWhatsAppProvider implements MessagingProvider {
    readonly name = "ManualWhatsAppProvider (Cheapest-First / Zero Marginal Cost)";
    /**
     * Generates a vCard 3.0 string formatted for iOS and Android contacts import.
     * Essential for WhatsApp broadcast delivery, as WhatsApp broadcasts require the
     * recipient to have the sender in their address book.
     */
    generateVCard(options: VCardOptions): string;
    /**
     * Generates a wa.me click-to-chat deep link with pre-filled message text.
     */
    generateClickToChatUrl(phone: string, text?: string): string;
    /**
     * Manual broadcast: in Phase 2 / v1, broadcasts are managed via WhatsApp Broadcast Lists
     * without incurring Meta per-conversation API fees.
     */
    sendBroadcast(phones: string[], message: string): Promise<BroadcastResult>;
}
export declare const defaultWhatsAppProvider: ManualWhatsAppProvider;
//# sourceMappingURL=ManualWhatsAppProvider.d.ts.map