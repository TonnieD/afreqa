import { describe, it, expect } from "vitest";
import {
  normalizeAndValidatePhone,
  subscribeFormSchema,
  sanitizeCsvField,
  ManualWhatsAppProvider,
  renderVerificationEmail,
  renderWelcomeEmail,
} from "../index.js";

describe("Audience & Subscriber Engine", () => {
  describe("Phone Number Normalization (E.164)", () => {
    it("normalizes Kenyan 07xx numbers to E.164 (+254)", () => {
      expect(normalizeAndValidatePhone("0712345678")).toBe("+254712345678");
      expect(normalizeAndValidatePhone("0722 123 456")).toBe("+254722123456");
      expect(normalizeAndValidatePhone("0110 987 654")).toBe("+254110987654");
    });

    it("accepts already formatted international E.164 numbers", () => {
      expect(normalizeAndValidatePhone("+254712345678")).toBe("+254712345678");
      expect(normalizeAndValidatePhone("+447911123456")).toBe("+447911123456");
    });

    it("returns null for invalid or empty numbers", () => {
      expect(normalizeAndValidatePhone("")).toBeNull();
      expect(normalizeAndValidatePhone("   ")).toBeNull();
      expect(normalizeAndValidatePhone("12345")).toBeNull();
      expect(normalizeAndValidatePhone("invalid-phone")).toBeNull();
    });
  });

  describe("Subscribe Form Validation & Bot Honeypot", () => {
    it("validates valid subscriber payloads", () => {
      const res = subscribeFormSchema.safeParse({
        email: "dancer@afreqa.com",
        firstName: "Amani",
        phone: "0712 345 678",
        whatsappOptIn: true,
        interests: ["festivals", "early-bird"],
      });

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.email).toBe("dancer@afreqa.com");
        expect(res.data.whatsappOptIn).toBe(true);
      }
    });

    it("rejects invalid emails", () => {
      const res = subscribeFormSchema.safeParse({
        email: "not-an-email",
      });
      expect(res.success).toBe(false);
    });

    it("catches bot filled honeypot fields", () => {
      const res = subscribeFormSchema.safeParse({
        email: "spambot@example.com",
        honeypot: "http://spam-link.ru",
      });
      expect(res.success).toBe(false);
    });
  });

  describe("CSV Formula Injection Sanitization (OWASP)", () => {
    it("prefixes formula trigger characters (=, +, -, @, \\t, \\r) with single quote", () => {
      expect(sanitizeCsvField("=cmd|' /C calc'!A0")).toBe("'=cmd|' /C calc'!A0");
      expect(sanitizeCsvField("+254712345678")).toBe("'+254712345678");
      expect(sanitizeCsvField("-500")).toBe("'-500");
      expect(sanitizeCsvField("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");
    });

    it("escapes fields containing commas or double quotes", () => {
      expect(sanitizeCsvField('Afreqa "Resonance" VIP')).toBe('"Afreqa ""Resonance"" VIP"');
      expect(sanitizeCsvField("Nairobi, Kenya")).toBe('"Nairobi, Kenya"');
    });

    it("leaves standard alphanumeric strings safe and unquoted", () => {
      expect(sanitizeCsvField("John Doe")).toBe("John Doe");
      expect(sanitizeCsvField("user@example.com")).toBe("user@example.com");
    });
  });

  describe("WhatsApp Provider & vCard Generation", () => {
    const provider = new ManualWhatsAppProvider();

    it("generates RFC 6350 compliant vCard text", () => {
      const vcard = provider.generateVCard({
        name: "Afreqa Nairobi",
        org: "Afreqa Productions Ltd",
        phone: "+254700000000",
        email: "frequencies@afreqa.com",
        url: "https://afreqa.com",
        note: "Official Afreqa contact",
      });

      expect(vcard).toContain("BEGIN:VCARD");
      expect(vcard).toContain("VERSION:3.0");
      expect(vcard).toContain("FN:Afreqa Nairobi");
      expect(vcard).toContain("TEL;TYPE=CELL,VOICE:+254700000000");
      expect(vcard).toContain("EMAIL;TYPE=INTERNET:frequencies@afreqa.com");
      expect(vcard).toContain("END:VCARD");
    });

    it("generates wa.me click-to-chat links", () => {
      const link = provider.generateClickToChatUrl("+254 712 345 678", "Hello Afreqa Team!");
      expect(link).toBe("https://wa.me/254712345678?text=Hello%20Afreqa%20Team!");
    });
  });

  describe("Email Templates Rendering", () => {
    it("renders verification email with valid CTA and KDPA compliance", () => {
      const html = renderVerificationEmail({
        recipientName: "Kendi",
        verifyUrl: "https://afreqa.com/verify-email?token=test-token-123",
        tokenExpiresHours: 24,
      });

      expect(html).toContain("Hello Kendi,");
      expect(html).toContain("https://afreqa.com/verify-email?token=test-token-123");
      expect(html).toContain("Kenya Data Protection Act, 2019 (KDPA)");
      expect(html).toContain("AFREQA");
    });

    it("renders welcome email with vCard and community access", () => {
      const html = renderWelcomeEmail({
        recipientName: "Brian",
        vcardUrl: "https://afreqa.com/api/whatsapp/vcard",
        whatsappCommunityUrl: "https://chat.whatsapp.com/test",
      });

      expect(html).toContain("Welcome to the tribe, Brian!");
      expect(html).toContain("https://afreqa.com/api/whatsapp/vcard");
      expect(html).toContain("https://chat.whatsapp.com/test");
    });
  });
});
