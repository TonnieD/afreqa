import { describe, it, expect } from "vitest";
import {
  vendorApplicationSchema,
  partnerEnquirySchema,
} from "../validation/forms.js";
import { renderContactConfirmationEmail } from "../mailer/templates.js";
import { isEmailAllowed } from "../mailer/transport.js";

describe("Vendor & Partner Forms Validation", () => {
  it("validates structured vendor application fields without 2000-char truncation", () => {
    const longDescription = "A".repeat(2500);
    const result = vendorApplicationSchema.safeParse({
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
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description.length).toBe(2500);
      expect(result.data.businessName).toBe("Nairobi Rave Kitchen");
    }
  });

  it("rejects vendor application when honeypot is filled", () => {
    const result = vendorApplicationSchema.safeParse({
      businessName: "Bot Corp",
      contactName: "Bot",
      email: "bot@example.com",
      category: "OTHER",
      spaceNeeds: "3x3m Canopy",
      powerNeeds: "No Power Needed",
      description: "Spamming festival vendor form.",
      website_url: "https://spam.example.com",
    });
    expect(result.success).toBe(false);
  });

  it("validates structured partner enquiry fields without 2000-char truncation", () => {
    const longObjectives = "B".repeat(2600);
    const result = partnerEnquirySchema.safeParse({
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
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.objectives.length).toBe(2600);
    }
  });
});

describe("Contact Confirmation Static Email & Allow-list", () => {
  it("renders a static applicant confirmation template with zero user-supplied free text", () => {
    const html = renderContactConfirmationEmail("VENDOR");
    expect(html).toContain("Vendor Stall Application");
    expect(html).toContain("We Received Your Submission");
    expect(html).not.toContain("<script>");
  });

  it("enforces EMAIL_ALLOWLIST when configured and allows all when unset", () => {
    expect(isEmailAllowed("anyone@example.com", "")).toBe(true);
    expect(isEmailAllowed("anyone@example.com", undefined)).toBe(true);
    expect(isEmailAllowed("owner@afreqa.com", "owner@afreqa.com, ops@afreqa.com")).toBe(true);
    expect(isEmailAllowed("OWNER@AFREQA.COM ", "owner@afreqa.com,ops@afreqa.com")).toBe(true);
    expect(isEmailAllowed("stranger@spam.com", "owner@afreqa.com, ops@afreqa.com")).toBe(false);
  });
});
