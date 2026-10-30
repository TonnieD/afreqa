import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  db,
  checkRateLimit,
  normalizeAndValidatePhone,
  subscribeFormSchema,
  enqueueVerificationEmail,
  logger,
} from "@afreqa/core";

export async function POST(req: NextRequest) {
  try {
    const rawIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Rate limiting: 5 subscriptions per hour per IP
    const rateCheck = await checkRateLimit(`rate:subscribe:${rawIp}`, 5, 3600).catch(() => ({
      allowed: true,
      remaining: 4,
      resetInSeconds: 3600,
    }));

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many subscription attempts. Please wait a while before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Honeypot check for bots
    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Thank you for subscribing! Please check your email to confirm.",
      });
    }

    // 3. Validation
    const parsed = subscribeFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { email, firstName, phone, whatsappOptIn, interests, source } = parsed.data;

    let phoneE164: string | null = null;
    if (phone) {
      phoneE164 = normalizeAndValidatePhone(phone, "KE");
    }

    // 4. Check existing subscriber status
    const existing = await db.subscriber.findUnique({
      where: { email },
    });

    if (existing && existing.emailStatus === "ACTIVE") {
      return NextResponse.json({
        success: true,
        message: "You are already an active member of the Afreqa Inner Circle!",
      });
    }

    // 5. Generate 24-hour verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 6. Upsert subscriber record
    const subscriber = await db.subscriber.upsert({
      where: { email },
      create: {
        email,
        firstName: firstName || null,
        phoneE164,
        emailStatus: "UNVERIFIED",
        whatsappOptIn: Boolean(whatsappOptIn),
        interests: interests || [],
        source: source || "website",
        verificationToken,
        tokenExpiresAt,
      },
      update: {
        firstName: firstName || undefined,
        phoneE164: phoneE164 || undefined,
        whatsappOptIn: Boolean(whatsappOptIn),
        interests: interests && interests.length > 0 ? interests : undefined,
        verificationToken,
        tokenExpiresAt,
        emailStatus: "UNVERIFIED", // reset to unverified if previously bounced/unsubscribed
      },
    });

    // 7. Hash IP for KDPA consent ledger without retaining raw IP
    const ipHash = crypto.createHash("sha256").update(rawIp + (process.env.SESSION_SECRET || "afreqa-salt")).digest("hex");
    const userAgent = req.headers.get("user-agent") || undefined;

    // Log EMAIL consent
    await db.consentLog.create({
      data: {
        subscriberId: subscriber.id,
        phoneE164: phoneE164 || undefined,
        channel: "EMAIL",
        consentTextVersion: "KDPA-2026-V1",
        ipHash,
        userAgent,
        sourcePage: source || "website",
      },
    });

    // If opted into WhatsApp, log WHATSAPP consent as separate unbundled entry
    if (whatsappOptIn && phoneE164) {
      await db.consentLog.create({
        data: {
          subscriberId: subscriber.id,
          phoneE164,
          channel: "WHATSAPP",
          consentTextVersion: "KDPA-2026-V1-WHATSAPP",
          ipHash,
          userAgent,
          sourcePage: source || "website",
        },
      });
    }

    // 8. Enqueue background verification email
    const origin =
      req.headers.get("x-forwarded-host")
        ? `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("x-forwarded-host")}`
        : req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

    const verifyUrl = `${origin}/verify-email?token=${verificationToken}`;

    try {
      await enqueueVerificationEmail({
        subscriberId: subscriber.id,
        email: subscriber.email,
        firstName: subscriber.firstName,
        verifyUrl,
        tokenExpiresHours: 24,
      });
    } catch (queueErr) {
      logger.error("Failed to enqueue verification email via pg-boss", queueErr);
      // Even if queue fails, subscriber is persisted and can request resend or admin can verify
    }

    return NextResponse.json({
      success: true,
      message: "Please check your email to confirm your subscription and activate your frequency access.",
    });
  } catch (error) {
    logger.error("Error in subscribers API", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your subscription. Please try again." },
      { status: 500 }
    );
  }
}

