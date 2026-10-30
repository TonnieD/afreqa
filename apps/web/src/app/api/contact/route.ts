import { NextRequest, NextResponse } from "next/server";
import { db, checkRateLimit, normalizeAndValidatePhone, contactFormSchema, z } from "@afreqa/core";

const ContactPayloadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional().nullable(),
  subject: z.enum(["GENERAL", "SPONSORSHIP", "BOOKING", "MEDIA", "VENDOR", "OTHER"]).default("GENERAL"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  website_url: z.string().max(0, "Bot detected").optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Rate limiting: 5 messages per 10 minutes per IP
    const rateCheck = await checkRateLimit(`rate:contact:${ip}`, 5, 600).catch(() => ({
      allowed: true,
      remaining: 4,
      resetInSeconds: 600,
    }));

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Honeypot check
    if (body.website_url && body.website_url.length > 0) {
      // Silently return ok to fool automated spam bots
      return NextResponse.json({ success: true, message: "Message received." });
    }

    // 3. Validation
    const parsed = ContactPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = parsed.data;

    let phoneTag = "";
    if (phone && phone.trim()) {
      const normalizedPhone = normalizeAndValidatePhone(phone, "KE");
      phoneTag = `[Phone / WhatsApp: ${normalizedPhone || phone}]\n\n`;
    }

    // Map subject string to ContactTopic enum
    let topic: "GENERAL" | "SPONSORSHIP" | "BOOKING" | "PRESS" = "GENERAL";
    let vendorPrefix = "";
    if (subject === "SPONSORSHIP") topic = "SPONSORSHIP";
    else if (subject === "BOOKING") topic = "BOOKING";
    else if (subject === "MEDIA") topic = "PRESS";
    else if (subject === "VENDOR") {
      topic = "GENERAL";
      vendorPrefix = "[VENDOR APPLICATION]\n";
    }

    // 4. Save to Database
    await db.contactMessage.create({
      data: {
        name,
        email,
        topic,
        message: `${vendorPrefix}${phoneTag}${message}`,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent"),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been safely delivered to the Afreqa team.",
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your message." },
      { status: 500 }
    );
  }
}
