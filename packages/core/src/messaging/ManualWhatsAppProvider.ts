import { MessagingProvider, VCardOptions, BroadcastResult } from "./MessagingProvider.js";
import { logger } from "../logger.js";

export class ManualWhatsAppProvider implements MessagingProvider {
  readonly name = "ManualWhatsAppProvider (Cheapest-First / Zero Marginal Cost)";

  /**
   * Generates a vCard 3.0 string formatted for iOS and Android contacts import.
   * Essential for WhatsApp broadcast delivery, as WhatsApp broadcasts require the
   * recipient to have the sender in their address book.
   */
  generateVCard(options: VCardOptions): string {
    const lines: string[] = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${options.name}`,
    ];

    if (options.org) {
      lines.push(`ORG:${options.org}`);
    }
    if (options.title) {
      lines.push(`TITLE:${options.title}`);
    }
    lines.push(`TEL;TYPE=CELL,VOICE:${options.phone}`);
    if (options.email) {
      lines.push(`EMAIL;TYPE=INTERNET:${options.email}`);
    }
    if (options.url) {
      lines.push(`URL:${options.url}`);
    }
    if (options.note) {
      lines.push(`NOTE:${options.note.replace(/\n/g, "\\n")}`);
    }

    lines.push("END:VCARD");
    return lines.join("\r\n") + "\r\n";
  }

  /**
   * Generates a wa.me click-to-chat deep link with pre-filled message text.
   */
  generateClickToChatUrl(phone: string, text?: string): string {
    // Sanitize to digits only (e.g. +254 712 345678 -> 254712345678)
    const sanitized = phone.replace(/[^0-9]/g, "");
    const base = `https://wa.me/${sanitized}`;
    if (text && text.trim()) {
      return `${base}?text=${encodeURIComponent(text.trim())}`;
    }
    return base;
  }

  /**
   * Manual broadcast: in Phase 2 / v1, broadcasts are managed via WhatsApp Broadcast Lists
   * without incurring Meta per-conversation API fees.
   */
  async sendBroadcast(phones: string[], message: string): Promise<BroadcastResult> {
    logger.info(`[ManualWhatsAppProvider] Prepared manual broadcast list of ${phones.length} recipients.`, {
      messagePreview: message.slice(0, 80),
    });

    return {
      provider: this.name,
      successCount: phones.length,
      failedCount: 0,
      messageIds: phones.map((p, idx) => `manual-broadcast-${idx}-${Date.now()}`),
    };
  }
}

export const defaultWhatsAppProvider = new ManualWhatsAppProvider();

