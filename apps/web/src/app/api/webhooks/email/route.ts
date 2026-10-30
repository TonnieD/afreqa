import { NextRequest, NextResponse } from "next/server";
import { db, recordAuditLog, logger } from "@afreqa/core";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support standard webhook payloads (e.g. Brevo, Mailgun, Postmark, AWS SES)
    // Common fields: email / recipient, event / type ("bounce", "complaint", "spam")
    const email =
      body.email ||
      body.recipient ||
      body.Message?.mail?.destination?.[0] ||
      body.data?.email;
    const eventType = (body.event || body.type || body.eventType || "").toLowerCase();

    if (!email) {
      return NextResponse.json({ message: "No email identified in webhook payload" }, { status: 200 });
    }

    const subscriber = await db.subscriber.findUnique({
      where: { email: String(email).toLowerCase().trim() },
    });

    if (subscriber) {
      const isSpam = eventType.includes("complaint") || eventType.includes("spam");
      const newStatus = isSpam ? "COMPLAINED" : "BOUNCED";

      await db.subscriber.update({
        where: { id: subscriber.id },
        data: { emailStatus: newStatus },
      });

      await recordAuditLog({
        resourceId: subscriber.id,
        action: `EMAIL_${newStatus}`,
        resource: "Subscriber",
        payload: { eventType, providerPayload: body },
      });

      logger.info(`Updated subscriber ${subscriber.email} status to ${newStatus} via email webhook.`);
    }

    return NextResponse.json({ success: true, processed: Boolean(subscriber) });
  } catch (error) {
    logger.error("Failed to process email webhook", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}

