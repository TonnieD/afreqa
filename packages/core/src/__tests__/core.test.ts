import { describe, it, expect } from "vitest";
import { normalizeAndValidatePhone, sanitizeCsvField } from "../validation/forms.js";
import { sanitizeAuditPayload } from "../auth/audit.js";
import { hashPassword, verifyPassword } from "../auth/password.js";

describe("Phone Validation & Normalization (libphonenumber-js)", () => {
  it("normalizes Kenyan mobile number with leading 0 to E.164", () => {
    const result = normalizeAndValidatePhone("0712345678", "KE");
    expect(result).toBe("+254712345678");
  });

  it("normalizes Kenyan mobile number with spaces and dashes", () => {
    const result = normalizeAndValidatePhone("0712-345 678", "KE");
    expect(result).toBe("+254712345678");
  });

  it("accepts valid international E.164 number", () => {
    const result = normalizeAndValidatePhone("+254712345678", "KE");
    expect(result).toBe("+254712345678");
  });

  it("returns null for invalid phone numbers", () => {
    expect(normalizeAndValidatePhone("12345", "KE")).toBeNull();
    expect(normalizeAndValidatePhone("invalid-phone", "KE")).toBeNull();
  });
});

describe("CSV Formula Injection Escaping (OWASP Hardening)", () => {
  it("prefixes formula injection trigger characters with a single quote", () => {
    expect(sanitizeCsvField("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
    expect(sanitizeCsvField("+cmd|' /C calc'!A0")).toBe("'+cmd|' /C calc'!A0");
    expect(sanitizeCsvField("-2+3*10")).toBe("'-2+3*10");
    expect(sanitizeCsvField("@malicious.payload")).toBe("'@malicious.payload");
    expect(sanitizeCsvField("\tTabInjection")).toBe("'\tTabInjection");
    expect(sanitizeCsvField("\rReturnInjection")).toBe("\"'\rReturnInjection\"");
  });

  it("leaves standard alphanumeric content unchanged", () => {
    expect(sanitizeCsvField("Afreqa Festival")).toBe("Afreqa Festival");
    expect(sanitizeCsvField("test@example.com")).toBe("test@example.com");
  });

  it("properly quotes fields containing commas and quotes", () => {
    expect(sanitizeCsvField("Afreqa, Nairobi")).toBe('"Afreqa, Nairobi"');
    expect(sanitizeCsvField('Quote "Test"')).toBe('"Quote ""Test"""');
  });
});

describe("Audit Payload Personal Data Masking", () => {
  it("masks raw email addresses in audit diffs", () => {
    const payload = {
      event: "SUBSCRIBER_CREATE",
      email: "raver@afreqa.com",
    };
    const sanitized = JSON.parse(sanitizeAuditPayload(payload));
    expect(sanitized.email).toBe("ra***@afreqa.com");
    expect(sanitized.email).not.toBe("raver@afreqa.com");
  });

  it("masks raw phone numbers in audit diffs", () => {
    const payload = {
      phone: "+254712345678",
    };
    const sanitized = JSON.parse(sanitizeAuditPayload(payload));
    expect(sanitized.phone).toBe("+254***78");
  });

  it("redacts passwords and secret keys entirely", () => {
    const payload = {
      password: "SuperSecretPassword123!",
      sessionToken: "secret_token_abc_123",
      action: "LOGIN",
    };
    const sanitized = JSON.parse(sanitizeAuditPayload(payload));
    expect(sanitized.password).toBe("[REDACTED]");
    expect(sanitized.sessionToken).toBe("[REDACTED]");
    expect(sanitized.action).toBe("LOGIN");
  });
});

describe("@node-rs/argon2 Password Hashing", () => {
  it("hashes and correctly verifies passwords", async () => {
    const plain = "AfreqaAdmin2026!";
    const hash = await hashPassword(plain);
    expect(hash).toContain("$argon2id$");

    const valid = await verifyPassword(plain, hash);
    expect(valid).toBe(true);

    const invalid = await verifyPassword("WrongPassword!", hash);
    expect(invalid).toBe(false);
  });
});
