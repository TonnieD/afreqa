"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const forms_js_1 = require("../validation/forms.js");
const templates_js_1 = require("../mailer/templates.js");
const transport_js_1 = require("../mailer/transport.js");
(0, vitest_1.describe)("Vendor & Partner Forms Validation", () => {
    (0, vitest_1.it)("validates structured vendor application fields without 2000-char truncation", () => {
        const longDescription = "A".repeat(2500);
        const result = forms_js_1.vendorApplicationSchema.safeParse({
            businessName: "Nairobi Rave Kitchen",
            contactName: "Jane Doe",
            email: "jane@example.com",
            phone: "0712345678",
            category: "FOOD_BEVERAGE",
            instagramHandle: "@ravekitchenke",
            spaceNeeds: "3x3m Canopy",
            powerNeeds: "Standard 13A Single Socket",
            description: longDescription,
            website_url: "",
        });
        (0, vitest_1.expect)(result.success).toBe(true);
        if (result.success) {
            (0, vitest_1.expect)(result.data.description.length).toBe(2500);
            (0, vitest_1.expect)(result.data.businessName).toBe("Nairobi Rave Kitchen");
        }
    });
    (0, vitest_1.it)("rejects vendor application when honeypot is filled", () => {
        const result = forms_js_1.vendorApplicationSchema.safeParse({
            businessName: "Bot Corp",
            contactName: "Bot",
            email: "bot@example.com",
            category: "OTHER",
            spaceNeeds: "3x3m Canopy",
            powerNeeds: "No Power Needed",
            description: "Spamming festival vendor form.",
            website_url: "https://spam.example.com",
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)("validates structured partner enquiry fields without 2000-char truncation", () => {
        const longObjectives = "B".repeat(2600);
        const result = forms_js_1.partnerEnquirySchema.safeParse({
            companyName: "Pulse Energy Kenya",
            contactName: "John Smith",
            titleRole: "Brand Manager",
            email: "john@pulse.co.ke",
            phone: "+254712345678",
            tierInterest: "EXPERIENTIAL_LOUNGE",
            budgetBracket: "KES 500K - 1M",
            objectives: longObjectives,
            website_url: "",
        });
        (0, vitest_1.expect)(result.success).toBe(true);
        if (result.success) {
            (0, vitest_1.expect)(result.data.objectives.length).toBe(2600);
        }
    });
});
(0, vitest_1.describe)("Contact Confirmation Static Email & Allow-list", () => {
    (0, vitest_1.it)("renders a static applicant confirmation template with zero user-supplied free text", () => {
        const html = (0, templates_js_1.renderContactConfirmationEmail)("VENDOR");
        (0, vitest_1.expect)(html).toContain("Vendor Stall Application");
        (0, vitest_1.expect)(html).toContain("We Received Your Submission");
        (0, vitest_1.expect)(html).not.toContain("<script>");
    });
    (0, vitest_1.it)("enforces EMAIL_ALLOWLIST when configured and allows all when unset", () => {
        (0, vitest_1.expect)((0, transport_js_1.isEmailAllowed)("anyone@example.com", "")).toBe(true);
        (0, vitest_1.expect)((0, transport_js_1.isEmailAllowed)("anyone@example.com", undefined)).toBe(true);
        (0, vitest_1.expect)((0, transport_js_1.isEmailAllowed)("owner@afreqa.com", "owner@afreqa.com, ops@afreqa.com")).toBe(true);
        (0, vitest_1.expect)((0, transport_js_1.isEmailAllowed)("OWNER@AFREQA.COM ", "owner@afreqa.com,ops@afreqa.com")).toBe(true);
        (0, vitest_1.expect)((0, transport_js_1.isEmailAllowed)("stranger@spam.com", "owner@afreqa.com, ops@afreqa.com")).toBe(false);
    });
});
//# sourceMappingURL=contact.test.js.map