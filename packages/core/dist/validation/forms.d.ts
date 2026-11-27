import { z } from "zod";
export declare function normalizeAndValidatePhone(phone: string, defaultCountry?: "KE"): string | null;
export declare const subscribeFormSchema: z.ZodObject<{
    email: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    phone: z.ZodEffects<z.ZodNullable<z.ZodOptional<z.ZodString>>, string | null | undefined, string | null | undefined>;
    whatsappOptIn: z.ZodDefault<z.ZodBoolean>;
    interests: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    source: z.ZodOptional<z.ZodString>;
    honeypot: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    whatsappOptIn: boolean;
    interests: string[];
    firstName?: string | undefined;
    phone?: string | null | undefined;
    source?: string | undefined;
    honeypot?: string | undefined;
}, {
    email: string;
    firstName?: string | undefined;
    phone?: string | null | undefined;
    whatsappOptIn?: boolean | undefined;
    interests?: string[] | undefined;
    source?: string | undefined;
    honeypot?: string | undefined;
}>;
export declare const contactFormSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodEffects<z.ZodNullable<z.ZodOptional<z.ZodString>>, string | null | undefined, string | null | undefined>;
    subject: z.ZodDefault<z.ZodEnum<["GENERAL", "SPONSORSHIP", "BOOKING", "MEDIA", "PRESS", "VENDOR", "OTHER"]>>;
    message: z.ZodString;
    website_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    email: string;
    name: string;
    subject: "GENERAL" | "SPONSORSHIP" | "BOOKING" | "MEDIA" | "PRESS" | "VENDOR" | "OTHER";
    phone?: string | null | undefined;
    website_url?: string | undefined;
}, {
    message: string;
    email: string;
    name: string;
    phone?: string | null | undefined;
    subject?: "GENERAL" | "SPONSORSHIP" | "BOOKING" | "MEDIA" | "PRESS" | "VENDOR" | "OTHER" | undefined;
    website_url?: string | undefined;
}>;
export declare const vendorApplicationSchema: z.ZodObject<{
    businessName: z.ZodString;
    contactName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodEffects<z.ZodNullable<z.ZodOptional<z.ZodString>>, string | null | undefined, string | null | undefined>;
    category: z.ZodEnum<["FOOD_BEVERAGE", "FASHION_STREETWEAR", "SENSORY_GLOW", "BEVERAGE", "OTHER"]>;
    instagramHandle: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    spaceNeeds: z.ZodString;
    powerNeeds: z.ZodString;
    description: z.ZodString;
    website_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    businessName: string;
    contactName: string;
    category: "OTHER" | "FOOD_BEVERAGE" | "FASHION_STREETWEAR" | "SENSORY_GLOW" | "BEVERAGE";
    instagramHandle: string;
    spaceNeeds: string;
    powerNeeds: string;
    description: string;
    phone?: string | null | undefined;
    website_url?: string | undefined;
}, {
    email: string;
    businessName: string;
    contactName: string;
    category: "OTHER" | "FOOD_BEVERAGE" | "FASHION_STREETWEAR" | "SENSORY_GLOW" | "BEVERAGE";
    spaceNeeds: string;
    powerNeeds: string;
    description: string;
    phone?: string | null | undefined;
    website_url?: string | undefined;
    instagramHandle?: string | undefined;
}>;
export declare const partnerEnquirySchema: z.ZodObject<{
    companyName: z.ZodString;
    contactName: z.ZodString;
    titleRole: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    email: z.ZodString;
    phone: z.ZodEffects<z.ZodNullable<z.ZodOptional<z.ZodString>>, string | null | undefined, string | null | undefined>;
    tierInterest: z.ZodString;
    budgetBracket: z.ZodString;
    objectives: z.ZodString;
    website_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    contactName: string;
    companyName: string;
    titleRole: string;
    tierInterest: string;
    budgetBracket: string;
    objectives: string;
    phone?: string | null | undefined;
    website_url?: string | undefined;
}, {
    email: string;
    contactName: string;
    companyName: string;
    tierInterest: string;
    budgetBracket: string;
    objectives: string;
    phone?: string | null | undefined;
    website_url?: string | undefined;
    titleRole?: string | undefined;
}>;
/**
 * Escapes CSV formula injection characters according to OWASP guidelines.
 * Any field starting with =, +, -, @, tab, or carriage return is prefixed with a single quote.
 */
export declare function sanitizeCsvField(field: unknown): string;
//# sourceMappingURL=forms.d.ts.map