"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const forms_js_1 = require("../validation/forms.js");
const audit_js_1 = require("../auth/audit.js");
const password_js_1 = require("../auth/password.js");
(0, vitest_1.describe)("Phone Validation & Normalization (libphonenumber-js)", () => {
    (0, vitest_1.it)("normalizes Kenyan mobile number with leading 0 to E.164", () => {
        const result = (0, forms_js_1.normalizeAndValidatePhone)("0712345678", "KE");
        (0, vitest_1.expect)(result).toBe("+254712345678");
    });
    (0, vitest_1.it)("normalizes Kenyan mobile number with spaces and dashes", () => {
        const result = (0, forms_js_1.normalizeAndValidatePhone)("0712-345 678", "KE");
        (0, vitest_1.expect)(result).toBe("+254712345678");
    });
    (0, vitest_1.it)("accepts valid international E.164 number", () => {
        const result = (0, forms_js_1.normalizeAndValidatePhone)("+254712345678", "KE");
        (0, vitest_1.expect)(result).toBe("+254712345678");
    });
    (0, vitest_1.it)("returns null for invalid phone numbers", () => {
        (0, vitest_1.expect)((0, forms_js_1.normalizeAndValidatePhone)("12345", "KE")).toBeNull();
        (0, vitest_1.expect)((0, forms_js_1.normalizeAndValidatePhone)("invalid-phone", "KE")).toBeNull();
    });
});
(0, vitest_1.describe)("CSV Formula Injection Escaping (OWASP Hardening)", () => {
    (0, vitest_1.it)("prefixes formula injection trigger characters with a single quote", () => {
        (0, vitest_1.expect)((0, forms_js_1.sanitizeCsvField)("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
        (0, vitest_1.expect)((0, forms_js_1.sanitizeCsvField)("+cmd|' /C calc'!A0")).toBe("'+cmd|' /C calc'!A0");
        (0, vitest_1.expect)((0, forms_js_1.sanitizeCsvField)("-2+3*10")).toBe("'-2+3*10");
        (0, vitest_1.expect)((0, forms_js_1.sanitizeCsvField)("@malicious.payload")).toBe("'@malicious.payload");
        (0, vitest_1.expect)((0, forms_js_1.sanitizeCsvField)("\tTabInjection")).toBe("'\tTabInjection");
        (0, vitest_1.expect)((0, forms_js_1.sanitizeCsvField)("\rReturnInjection")).toBe("\"'\rReturnInjection\"");
    });
    (0, vitest_1.it)("leaves standard alphanumeric content unchanged", () => {
        (0, vitest_1.expect)((0, forms_js_1.sanitizeCsvField)("Afreqa Festival")).toBe("Afreqa Festival");
        (0, vitest_1.expect)((0, forms_js_1.sanitizeCsvField)("test@example.com")).toBe("test@example.com");
    });
    (0, vitest_1.it)("properly quotes fields containing commas and quotes", () => {
        (0, vitest_1.expect)((0, forms_js_1.sanitizeCsvField)("Afreqa, Nairobi")).toBe('"Afreqa, Nairobi"');
        (0, vitest_1.expect)((0, forms_js_1.sanitizeCsvField)('Quote "Test"')).toBe('"Quote ""Test"""');
    });
});
(0, vitest_1.describe)("Audit Payload Personal Data Masking", () => {
    (0, vitest_1.it)("masks raw email addresses in audit diffs", () => {
        const payload = {
            event: "SUBSCRIBER_CREATE",
            email: "raver@afreqa.com",
        };
        const sanitized = JSON.parse((0, audit_js_1.sanitizeAuditPayload)(payload));
        (0, vitest_1.expect)(sanitized.email).toBe("ra***@afreqa.com");
        (0, vitest_1.expect)(sanitized.email).not.toBe("raver@afreqa.com");
    });
    (0, vitest_1.it)("masks raw phone numbers in audit diffs", () => {
        const payload = {
            phone: "+254712345678",
        };
        const sanitized = JSON.parse((0, audit_js_1.sanitizeAuditPayload)(payload));
        (0, vitest_1.expect)(sanitized.phone).toBe("+254***78");
    });
    (0, vitest_1.it)("redacts passwords and secret keys entirely", () => {
        const payload = {
            password: "SuperSecretPassword123!",
            sessionToken: "secret_token_abc_123",
            action: "LOGIN",
        };
        const sanitized = JSON.parse((0, audit_js_1.sanitizeAuditPayload)(payload));
        (0, vitest_1.expect)(sanitized.password).toBe("[REDACTED]");
        (0, vitest_1.expect)(sanitized.sessionToken).toBe("[REDACTED]");
        (0, vitest_1.expect)(sanitized.action).toBe("LOGIN");
    });
});
(0, vitest_1.describe)("@node-rs/argon2 Password Hashing", () => {
    (0, vitest_1.it)("hashes and correctly verifies passwords", async () => {
        const plain = "AfreqaAdmin2026!";
        const hash = await (0, password_js_1.hashPassword)(plain);
        (0, vitest_1.expect)(hash).toContain("$argon2id$");
        const valid = await (0, password_js_1.verifyPassword)(plain, hash);
        (0, vitest_1.expect)(valid).toBe(true);
        const invalid = await (0, password_js_1.verifyPassword)("WrongPassword!", hash);
        (0, vitest_1.expect)(invalid).toBe(false);
    });
});
//# sourceMappingURL=core.test.js.map