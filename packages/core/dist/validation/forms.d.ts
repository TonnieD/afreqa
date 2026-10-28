import { z } from "zod";
export declare function normalizeAndValidatePhone(phone: string, defaultCountry?: "KE"): string | null;
export declare const subscribeFormSchema: z.ZodObject<{
    email: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    whatsappOptIn: z.ZodDefault<z.ZodBoolean>;
    interests: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    source: z.ZodOptional<z.ZodString>;
    honeypot: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    whatsappOptIn: boolean;
    interests: string[];
    firstName?: string | undefined;
    phone?: string | undefined;
    source?: string | undefined;
    honeypot?: string | undefined;
}, {
    email: string;
    firstName?: string | undefined;
    phone?: string | undefined;
    whatsappOptIn?: boolean | undefined;
    interests?: string[] | undefined;
    source?: string | undefined;
    honeypot?: string | undefined;
}>;
export declare const contactFormSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    topic: z.ZodDefault<z.ZodEnum<["GENERAL", "SPONSORSHIP", "BOOKING", "PRESS"]>>;
    message: z.ZodString;
    honeypot: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    email: string;
    name: string;
    topic: "GENERAL" | "SPONSORSHIP" | "BOOKING" | "PRESS";
    honeypot?: string | undefined;
}, {
    message: string;
    email: string;
    name: string;
    honeypot?: string | undefined;
    topic?: "GENERAL" | "SPONSORSHIP" | "BOOKING" | "PRESS" | undefined;
}>;
/**
 * Escapes CSV formula injection characters according to OWASP guidelines.
 * Any field starting with =, +, -, @, tab, or carriage return is prefixed with a single quote.
 */
export declare function sanitizeCsvField(field: unknown): string;
//# sourceMappingURL=forms.d.ts.map