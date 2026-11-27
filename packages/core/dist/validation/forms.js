"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerEnquirySchema = exports.vendorApplicationSchema = exports.contactFormSchema = exports.subscribeFormSchema = void 0;
exports.normalizeAndValidatePhone = normalizeAndValidatePhone;
exports.sanitizeCsvField = sanitizeCsvField;
const zod_1 = require("zod");
const libphonenumber_js_1 = require("libphonenumber-js");
function normalizeAndValidatePhone(phone, defaultCountry = "KE") {
    if (!phone || !phone.trim())
        return null;
    const cleaned = phone.trim();
    const parsed = (0, libphonenumber_js_1.parsePhoneNumberFromString)(cleaned, defaultCountry);
    if (parsed && parsed.isValid()) {
        return parsed.number; // Returns E.164, e.g. +254712345678
    }
    return null;
}
const optionalPhoneSchema = zod_1.z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((val) => {
    if (!val)
        return true;
    return normalizeAndValidatePhone(val, "KE") !== null;
}, { message: "Please enter a valid phone number (e.g. 0712 345 678 or +254 712 345 678)" });
exports.subscribeFormSchema = zod_1.z.object({
    email: zod_1.z.string().email("Please enter a valid email address").toLowerCase().trim(),
    firstName: zod_1.z.string().max(50).trim().optional(),
    phone: optionalPhoneSchema,
    whatsappOptIn: zod_1.z.boolean().default(false),
    interests: zod_1.z.array(zod_1.z.string()).default([]),
    source: zod_1.z.string().max(100).optional(),
    honeypot: zod_1.z.string().max(0, "Bot detected").optional(),
});
exports.contactFormSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
    email: zod_1.z.string().email("Please enter a valid email address").toLowerCase().trim(),
    phone: optionalPhoneSchema,
    subject: zod_1.z.enum(["GENERAL", "SPONSORSHIP", "BOOKING", "MEDIA", "PRESS", "VENDOR", "OTHER"]).default("GENERAL"),
    message: zod_1.z.string().min(10, "Message must be at least 10 characters").max(2000).trim(),
    website_url: zod_1.z.string().max(0, "Bot detected").optional(),
});
exports.vendorApplicationSchema = zod_1.z.object({
    businessName: zod_1.z.string().min(2, "Business name must be at least 2 characters").max(120).trim(),
    contactName: zod_1.z.string().min(2, "Contact name must be at least 2 characters").max(100).trim(),
    email: zod_1.z.string().email("Please enter a valid email address").toLowerCase().trim(),
    phone: optionalPhoneSchema,
    category: zod_1.z.enum(["FOOD_BEVERAGE", "FASHION_STREETWEAR", "SENSORY_GLOW", "BEVERAGE", "OTHER"]),
    instagramHandle: zod_1.z.string().max(100).trim().optional().default(""),
    spaceNeeds: zod_1.z.string().min(2, "Please specify space requirements").max(100).trim(),
    powerNeeds: zod_1.z.string().min(2, "Please specify power requirements").max(100).trim(),
    description: zod_1.z.string().min(10, "Concept description must be at least 10 characters").max(4000).trim(),
    website_url: zod_1.z.string().max(0, "Bot detected").optional(),
});
exports.partnerEnquirySchema = zod_1.z.object({
    companyName: zod_1.z.string().min(2, "Company / brand name must be at least 2 characters").max(120).trim(),
    contactName: zod_1.z.string().min(2, "Contact name must be at least 2 characters").max(100).trim(),
    titleRole: zod_1.z.string().max(100).trim().optional().default(""),
    email: zod_1.z.string().email("Please enter a valid email address").toLowerCase().trim(),
    phone: optionalPhoneSchema,
    tierInterest: zod_1.z.string().min(2, "Please select a partnership tier").max(100).trim(),
    budgetBracket: zod_1.z.string().min(2, "Please select an estimated budget bracket").max(100).trim(),
    objectives: zod_1.z.string().min(10, "Objectives must be at least 10 characters").max(4000).trim(),
    website_url: zod_1.z.string().max(0, "Bot detected").optional(),
});
/**
 * Escapes CSV formula injection characters according to OWASP guidelines.
 * Any field starting with =, +, -, @, tab, or carriage return is prefixed with a single quote.
 */
function sanitizeCsvField(field) {
    if (field === null || field === undefined)
        return "";
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
//# sourceMappingURL=forms.js.map