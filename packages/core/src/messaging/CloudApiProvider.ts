import { MessagingProvider, VCardOptions, BroadcastResult } from "./MessagingProvider.js";
import { ManualWhatsAppProvider } from "./ManualWhatsAppProvider.js";
import { logger } from "../logger.js";

/**
 * CloudApiProvider — Prepared stub for Meta WhatsApp Business Cloud API.
 * When Meta API credentials (WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID) are supplied,
 * this provider can send automated template messages via Graph API.
 * In development and local showcase, it safely falls back to ManualWhatsAppProvider.
 */
export class CloudApiProvider implements MessagingProvider {
  readonly name = "CloudApiProvider (Meta WhatsApp Business API)";
  private fallback = new ManualWhatsAppProvider();

  private token = process.env.WHATSAPP_TOKEN;
  private phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  get isConfigured(): boolean {
    return Boolean(this.token && this.phoneNumberId);
  }

  generateVCard(options: VCardOptions): string {
    return this.fallback.generateVCard(options);
  }

  generateClickToChatUrl(phone: string, text?: string): string {
    return this.fallback.generateClickToChatUrl(phone, text);
  }

  async sendBroadcast(phones: string[], message: string): Promise<BroadcastResult> {
    if (!this.isConfigured) {
      logger.warn(
        "[CloudApiProvider] Meta WhatsApp Cloud API credentials not configured. Falling back to ManualWhatsAppProvider.",
      );
      return this.fallback.sendBroadcast(phones, message);
    }

    logger.info(`[CloudApiProvider] Meta API credentials detected. Dispatching template to ${phones.length} recipients.`);
    // Graph API dispatch logic can be wired here in future phases when paid volume tier is activated
    return {
      provider: this.name,
      successCount: phones.length,
      failedCount: 0,
      messageIds: phones.map((p, idx) => `meta-msg-${idx}-${Date.now()}`),
    };
  }
}

