import { NextRequest, NextResponse } from "next/server";
import { db, checkRateLimit, normalizeAndValidatePhone, z } from "@afreqa/core";

const DataRequestSchema = z.object({
  fullName: z.string().min(2, "Full name required").max(100),
  email: z.string().email("Valid email address required"),
  phone: z.string().optional().nullable(),
  requestType: z.enum(["ACCESS", "RECTIFICATION", "ERASURE", "RESTRICTION"]),
  details: z.string().min(10, "Please provide specific details regarding your request").max(1500),
  nationalIdNumber: z.string().min(4, "Identification details required for verification").max(30),
});

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Rate limiting (3 requests per 15 minutes per IP)
    const rateCheck = await checkRateLimit(`rate:data-req:${ip}`, 3, 900).catch(() => ({
      allowed: true,
      remaining: 2,
      resetInSeconds: 900,
    }));

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests submitted. Please wait before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const parsed = DataRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { fullName, email, phone, requestType, details, nationalIdNumber } = parsed.data;

    let phoneTag = "";
    if (phone && phone.trim()) {
      const normalizedPhone = normalizeAndValidatePhone(phone, "KE");
      phoneTag = `Phone / WhatsApp: ${normalizedPhone || phone}\n`;
    }

    // Create a tracked contact message / compliance ticket in the database
    await db.contactMessage.create({
      data: {
        name: fullName,
        email,
        topic: "GENERAL",
        message: `[KDPA DATA SUBJECT REQUEST - ${requestType}]\nID Reference: ${nationalIdNumber}\n${phoneTag}Details: ${details}`,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent"),
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Your Data Subject Request has been officially logged in compliance with KDPA Section 26. Our Data Protection Lead will process your request within 21 days.",
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred while logging your request." },
      { status: 500 }
    );
  }
}
