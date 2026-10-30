export interface VCardOptions {
    name: string;
    org?: string;
    title?: string;
    phone: string;
    email?: string;
    url?: string;
    note?: string;
}
export interface BroadcastResult {
    provider: string;
    successCount: number;
    failedCount: number;
    messageIds: string[];
}
export interface MessagingProvider {
    readonly name: string;
    generateVCard(options: VCardOptions): string;
    generateClickToChatUrl(phone: string, text?: string): string;
    sendBroadcast?(phones: string[], message: string): Promise<BroadcastResult>;
}
//# sourceMappingURL=MessagingProvider.d.ts.map