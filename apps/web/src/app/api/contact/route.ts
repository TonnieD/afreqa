import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  db,
  checkRateLimit,
  normalizeAndValidatePhone,
  contactFormSchema,
  vendorApplicationSchema,
  partnerEnquirySchema,
  sendEmail,
  renderContactConfirmationEmail,
  renderAdminContactNotificationEmail,
  enqueueAdminContactNotification,
  logger,
} from "@afreqa/core";
import { runAfterResponse } from "@/lib/host-adapter";
import { formatEatDateTime } from "@/lib/date";
import { assertSameOrigin } from "@/lib/csrf";

type ContactTopicType = "GENERAL" | "SPONSORSHIP" | "BOOKING" | "PRESS" | "VENDOR";

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. IP Rate limiting: 5 messages per 10 minutes per IP
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
    if (body.website_url && String(body.website_url).length > 0) {
      return NextResponse.json({ success: true, message: "Message received." });
    }

    let senderName = "";
    let senderEmail = "";
    let topic: ContactTopicType = "GENERAL";
    let storedMessage = "";
    let structuredDetails: Record<string, unknown> | undefined;

    // 3. Structured Validation by formType
    if (body.formType === "VENDOR") {
      const parsed = vendorApplicationSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message || "Invalid vendor application data" },
          { status: 400 }
        );
      }
      const d = parsed.data;
      const normalizedPhone = d.phone ? normalizeAndValidatePhone(d.phone, "KE") || d.phone : null;
      senderName = `${d.contactName} (${d.businessName})`;
      senderEmail = d.email;
      topic = "VENDOR";
      storedMessage = d.description;
      structuredDetails = {
        businessName: d.businessName,
        contactName: d.contactName,
        phone: normalizedPhone,
        category: d.category,
        instagramHandle: d.instagramHandle || null,
        spaceNeeds: d.spaceNeeds,
        powerNeeds: d.powerNeeds,
      };
    } else if (body.formType === "PARTNER") {
      const parsed = partnerEnquirySchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message || "Invalid partnership inquiry data" },
          { status: 400 }
        );
      }
      const d = parsed.data;
      const normalizedPhone = d.phone ? normalizeAndValidatePhone(d.phone, "KE") || d.phone : null;
      senderName = `${d.contactName} (${d.companyName})`;
      senderEmail = d.email;
      topic = "SPONSORSHIP";
      storedMessage = d.objectives;
      structuredDetails = {
        companyName: d.companyName,
        contactName: d.contactName,
        titleRole: d.titleRole || null,
        phone: normalizedPhone,
        tierInterest: d.tierInterest,
        budgetBracket: d.budgetBracket,
      };
    } else {
      const parsed = contactFormSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message || "Invalid input data" },
          { status: 400 }
        );
      }
      const d = parsed.data;
      senderName = d.name;
      senderEmail = d.email;
      if (d.subject === "SPONSORSHIP") topic = "SPONSORSHIP";
      else if (d.subject === "BOOKING") topic = "BOOKING";
      else if (d.subject === "MEDIA" || d.subject === "PRESS") topic = "PRESS";
      else if (d.subject === "VENDOR") topic = "VENDOR";
      else topic = "GENERAL";

      let phoneTag = "";
      if (d.phone && d.phone.trim()) {
        const normalizedPhone = normalizeAndValidatePhone(d.phone, "KE");
        phoneTag = `[Phone / WhatsApp: ${normalizedPhone || d.phone}]\n\n`;
      }
      storedMessage = `${phoneTag}${d.message}`;
    }

    // 4. Save to Database
    await db.contactMessage.create({
      data: {
        name: senderName,
        email: senderEmail,
        topic,
        message: storedMessage,
        details: structuredDetails ? (structuredDetails as object) : undefined,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent"),
      },
    });

    // 5. Admin Notification (Direct via after() first, fallback to pg-boss queue)
    const adminRecipient =
      process.env.ADMIN_NOTIFY_EMAIL ||
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.SEED_ADMIN_EMAIL ||
      "hello@afreqa.com";

    const adminHtml = renderAdminContactNotificationEmail({
      topic,
      senderName,
      senderEmail,
      message: storedMessage,
      details: structuredDetails || null,
      submittedAtEat: `${formatEatDateTime(new Date())} EAT (24h)`,
    });
    const adminSubject = `[AFREQA ${topic}] New submission from ${senderName}`;

    runAfterResponse("contact-admin-notification", async () => {
      try {
        await sendEmail({
          to: adminRecipient,
          subject: adminSubject,
          html: adminHtml,
        });
      } catch (err) {
        logger.warn("Direct admin contact email failed; falling back to queue", { error: String(err) });
        await enqueueAdminContactNotification({
          to: adminRecipient,
          subject: adminSubject,
          html: adminHtml,
        });
      }
    });

    // 6. Applicant Confirmation (Static template only, per-recipient rate-limited 1/hour)
    const emailHash = crypto.createHash("sha256").update(senderEmail.toLowerCase()).digest("hex").slice(0, 24);
    const recipientRate = await checkRateLimit(`rate:contact:email:${emailHash}`, 1, 3600).catch(() => ({
      allowed: true,
      remaining: 0,
      resetInSeconds: 3600,
    }));

    if (recipientRate.allowed) {
      const confirmHtml = renderContactConfirmationEmail(topic);
      runAfterResponse("contact-applicant-confirmation", async () => {
        await sendEmail({
          to: senderEmail,
          subject: "We Received Your Submission — AFREQA Nairobi",
          html: confirmHtml,
        });
      });
    }

    return NextResponse.json({
      success: true,
      message: "Your submission has been safely delivered to the Afreqa team.",
    });
  } catch (err) {
    logger.error("Contact submission error", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your submission." },
      { status: 500 }
    );
  }
}
