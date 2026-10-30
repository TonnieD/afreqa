import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db, logger } from "@afreqa/core";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email ? String(body.email).toLowerCase().trim() : null;

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const subscriber = await db.subscriber.findUnique({
      where: { email },
    });

    if (subscriber) {
      await db.subscriber.update({
        where: { id: subscriber.id },
        data: {
          emailStatus: "UNSUBSCRIBED",
          unsubscribedAt: new Date(),
        },
      });

      const rawIp =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        req.headers.get("x-real-ip") ||
        "127.0.0.1";
      const ipHash = crypto.createHash("sha256").update(rawIp + (process.env.SESSION_SECRET || "afreqa-salt")).digest("hex");

      await db.consentLog.create({
        data: {
          subscriberId: subscriber.id,
          channel: "EMAIL",
          consentTextVersion: "REVOCATION-KDPA-2026",
          ipHash,
          userAgent: req.headers.get("user-agent") || undefined,
          sourcePage: "unsubscribe_portal",
        },
      });

      logger.info(`Subscriber ${email} unsubscribed successfully.`);
    }

    return NextResponse.json({
      success: true,
      message: "You have been successfully removed from our mailing list.",
    });
  } catch (error) {
    logger.error("Error handling unsubscribe request", error);
    return NextResponse.json(
      { error: "Could not process unsubscribe request." },
      { status: 500 }
    );
  }
}

