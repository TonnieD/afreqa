import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export function normalizeAndValidatePhone(phone: string, defaultCountry: "KE" = "KE"): string | null {
  if (!phone || !phone.trim()) return null;
  const cleaned = phone.trim();
  const parsed = parsePhoneNumberFromString(cleaned, defaultCountry);
  if (parsed && parsed.isValid()) {
    return parsed.number; // Returns E.164, e.g. +254712345678
  }
  return null;
}

export const subscribeFormSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  firstName: z.string().max(50).trim().optional(),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return normalizeAndValidatePhone(val, "KE") !== null;
      },
      { message: "Please enter a valid phone number (e.g. 0712 345 678 or +254 712 345 678)" },
    ),
  whatsappOptIn: z.boolean().default(false),
  interests: z.array(z.string()).default([]),
  source: z.string().max(100).optional(),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  topic: z.enum(["GENERAL", "SPONSORSHIP", "BOOKING", "PRESS"]).default("GENERAL"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000).trim(),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

/**
 * Escapes CSV formula injection characters according to OWASP guidelines.
 * Any field starting with =, +, -, @, tab, or carriage return is prefixed with a single quote.
 */
export function sanitizeCsvField(field: unknown): string {
  if (field === null || field === undefined) return "";
  let str = String(field);
  
  // If field starts with formula trigger characters, prefix with single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  
  // Standard CSV escaping for quotes and commas
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

