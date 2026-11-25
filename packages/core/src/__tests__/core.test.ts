import { describe, it, expect } from "vitest";
import { normalizeAndValidatePhone, sanitizeCsvField } from "../validation/forms.js";
import { sanitizeAuditPayload } from "../auth/audit.js";
import { hashPassword, verifyPassword } from "../auth/password.js";
import { getEatIsoString, formatEatTimestamp } from "../logger.js";

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

describe("East Africa Time (EAT +3, 24h System) Log Timestamps", () => {
  it("formats ISO string with +03:00 timezone offset", () => {
    // 2026-11-24T18:20:53.000Z in UTC is 21:20:53 in EAT (+3)
    const testDate = new Date("2026-11-24T18:20:53.000Z");
    const eatIso = getEatIsoString(testDate);
    expect(eatIso).toBe("2026-11-24T21:20:53.000+03:00");
  });

  it("strictly enforces 24-hour system without AM/PM for evening times", () => {
    const eveningDate = new Date("2026-11-24T18:20:53.000Z");
    const formatted = formatEatTimestamp(eveningDate);
    expect(formatted).toContain("EAT (24h)");
    expect(formatted).toContain("21:20:53");
    expect(formatted).not.toMatch(/am|pm/i);
  });

  it("strictly enforces 24-hour system without AM/PM for morning times", () => {
    const morningDate = new Date("2026-11-24T06:05:09.000Z");
    const formatted = formatEatTimestamp(morningDate);
    expect(formatted).toContain("09:05:09");
    expect(formatted).not.toMatch(/am|pm/i);
  });

  it("formats EAT timestamp with explicit 24h (+03:00) offset", () => {
    const testDate = new Date("2026-11-24T18:20:53.000Z");
    const formatted = formatEatTimestamp(testDate, { includeOffset: true });
    expect(formatted).toContain("EAT (24h UTC+3)");
    expect(formatted).toContain("21:20:53");
    expect(formatted).not.toMatch(/am|pm/i);
  });
});
