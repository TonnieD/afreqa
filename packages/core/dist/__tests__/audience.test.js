"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_js_1 = require("../index.js");
(0, vitest_1.describe)("Audience & Subscriber Engine", () => {
    (0, vitest_1.describe)("Phone Number Normalization (E.164)", () => {
        (0, vitest_1.it)("normalizes Kenyan 07xx numbers to E.164 (+254)", () => {
            (0, vitest_1.expect)((0, index_js_1.normalizeAndValidatePhone)("0712345678")).toBe("+254712345678");
            (0, vitest_1.expect)((0, index_js_1.normalizeAndValidatePhone)("0722 123 456")).toBe("+254722123456");
            (0, vitest_1.expect)((0, index_js_1.normalizeAndValidatePhone)("0110 987 654")).toBe("+254110987654");
        });
        (0, vitest_1.it)("accepts already formatted international E.164 numbers", () => {
            (0, vitest_1.expect)((0, index_js_1.normalizeAndValidatePhone)("+254712345678")).toBe("+254712345678");
            (0, vitest_1.expect)((0, index_js_1.normalizeAndValidatePhone)("+447911123456")).toBe("+447911123456");
        });
        (0, vitest_1.it)("returns null for invalid or empty numbers", () => {
            (0, vitest_1.expect)((0, index_js_1.normalizeAndValidatePhone)("")).toBeNull();
            (0, vitest_1.expect)((0, index_js_1.normalizeAndValidatePhone)("   ")).toBeNull();
            (0, vitest_1.expect)((0, index_js_1.normalizeAndValidatePhone)("12345")).toBeNull();
            (0, vitest_1.expect)((0, index_js_1.normalizeAndValidatePhone)("invalid-phone")).toBeNull();
        });
    });
    (0, vitest_1.describe)("Subscribe Form Validation & Bot Honeypot", () => {
        (0, vitest_1.it)("validates valid subscriber payloads", () => {
            const res = index_js_1.subscribeFormSchema.safeParse({
                email: "dancer@afreqa.com",
                firstName: "Amani",
                phone: "0712 345 678",
                whatsappOptIn: true,
                interests: ["festivals", "early-bird"],
            });
            (0, vitest_1.expect)(res.success).toBe(true);
            if (res.success) {
                (0, vitest_1.expect)(res.data.email).toBe("dancer@afreqa.com");
                (0, vitest_1.expect)(res.data.whatsappOptIn).toBe(true);
            }
        });
        (0, vitest_1.it)("rejects invalid emails", () => {
            const res = index_js_1.subscribeFormSchema.safeParse({
                email: "not-an-email",
            });
            (0, vitest_1.expect)(res.success).toBe(false);
        });
        (0, vitest_1.it)("catches bot filled honeypot fields", () => {
            const res = index_js_1.subscribeFormSchema.safeParse({
                email: "spambot@example.com",
                honeypot: "http://spam-link.ru",
            });
            (0, vitest_1.expect)(res.success).toBe(false);
        });
    });
    (0, vitest_1.describe)("CSV Formula Injection Sanitization (OWASP)", () => {
        (0, vitest_1.it)("prefixes formula trigger characters (=, +, -, @, \\t, \\r) with single quote", () => {
            (0, vitest_1.expect)((0, index_js_1.sanitizeCsvField)("=cmd|' /C calc'!A0")).toBe("'=cmd|' /C calc'!A0");
            (0, vitest_1.expect)((0, index_js_1.sanitizeCsvField)("+254712345678")).toBe("'+254712345678");
            (0, vitest_1.expect)((0, index_js_1.sanitizeCsvField)("-500")).toBe("'-500");
            (0, vitest_1.expect)((0, index_js_1.sanitizeCsvField)("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");
        });
        (0, vitest_1.it)("escapes fields containing commas or double quotes", () => {
            (0, vitest_1.expect)((0, index_js_1.sanitizeCsvField)('Afreqa "Resonance" VIP')).toBe('"Afreqa ""Resonance"" VIP"');
            (0, vitest_1.expect)((0, index_js_1.sanitizeCsvField)("Nairobi, Kenya")).toBe('"Nairobi, Kenya"');
        });
        (0, vitest_1.it)("leaves standard alphanumeric strings safe and unquoted", () => {
            (0, vitest_1.expect)((0, index_js_1.sanitizeCsvField)("John Doe")).toBe("John Doe");
            (0, vitest_1.expect)((0, index_js_1.sanitizeCsvField)("user@example.com")).toBe("user@example.com");
        });
    });
    (0, vitest_1.describe)("WhatsApp Provider & vCard Generation", () => {
        const provider = new index_js_1.ManualWhatsAppProvider();
        (0, vitest_1.it)("generates RFC 6350 compliant vCard text", () => {
            const vcard = provider.generateVCard({
                name: "Afreqa Nairobi",
                org: "Afreqa Productions Ltd",
                phone: "+254700000000",
                email: "frequencies@afreqa.com",
                url: "https://afreqa.com",
                note: "Official Afreqa contact",
            });
            (0, vitest_1.expect)(vcard).toContain("BEGIN:VCARD");
            (0, vitest_1.expect)(vcard).toContain("VERSION:3.0");
            (0, vitest_1.expect)(vcard).toContain("FN:Afreqa Nairobi");
            (0, vitest_1.expect)(vcard).toContain("TEL;TYPE=CELL,VOICE:+254700000000");
            (0, vitest_1.expect)(vcard).toContain("EMAIL;TYPE=INTERNET:frequencies@afreqa.com");
            (0, vitest_1.expect)(vcard).toContain("END:VCARD");
        });
        (0, vitest_1.it)("generates wa.me click-to-chat links", () => {
            const link = provider.generateClickToChatUrl("+254 712 345 678", "Hello Afreqa Team!");
            (0, vitest_1.expect)(link).toBe("https://wa.me/254712345678?text=Hello%20Afreqa%20Team!");
        });
    });
    (0, vitest_1.describe)("Email Templates Rendering", () => {
        (0, vitest_1.it)("renders verification email with valid CTA and KDPA compliance", () => {
            const html = (0, index_js_1.renderVerificationEmail)({
                recipientName: "Kendi",
                verifyUrl: "https://afreqa.com/verify-email?token=test-token-123",
                tokenExpiresHours: 24,
            });
            (0, vitest_1.expect)(html).toContain("Hello Kendi,");
            (0, vitest_1.expect)(html).toContain("https://afreqa.com/verify-email?token=test-token-123");
            (0, vitest_1.expect)(html).toContain("Kenya Data Protection Act, 2019 (KDPA)");
            (0, vitest_1.expect)(html).toContain("AFREQA");
        });
        (0, vitest_1.it)("renders welcome email with vCard and community access", () => {
            const html = (0, index_js_1.renderWelcomeEmail)({
                recipientName: "Brian",
                vcardUrl: "https://afreqa.com/api/whatsapp/vcard",
                whatsappCommunityUrl: "https://chat.whatsapp.com/test",
            });
            (0, vitest_1.expect)(html).toContain("Welcome to the tribe, Brian!");
            (0, vitest_1.expect)(html).toContain("https://afreqa.com/api/whatsapp/vcard");
            (0, vitest_1.expect)(html).toContain("https://chat.whatsapp.com/test");
        });
    });
});
//# sourceMappingURL=audience.test.js.map