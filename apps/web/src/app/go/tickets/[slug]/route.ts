import { NextRequest, NextResponse } from "next/server";
import { db, checkRateLimit } from "@afreqa/core";
import crypto from "crypto";

const DEFAULT_TICKETS_URL = "https://afreqanairobi.hustlesasa.shop/";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. Rate limiting (60 redirects per minute per IP)
  const rateLimitKey = `rate:tickets:${ip}`;
  const rateCheck = await checkRateLimit(rateLimitKey, 60, 60).catch(() => ({
    allowed: true,
    remaining: 59,
    resetInSeconds: 60,
  }));

  if (!rateCheck.allowed) {
    return new NextResponse("Too Many Requests. Please slow down.", {
      status: 429,
      headers: {
        "Retry-After": String(rateCheck.resetInSeconds),
      },
    });
  }

  // 2. Extract UTM parameters and placement query strings
  const searchParams = req.nextUrl.searchParams;
  const placement = searchParams.get("placement") || "direct";
  const phaseName = searchParams.get("phase") || null;
  const utmSource = searchParams.get("utm_source") || "afreqa_website";
  const utmMedium = searchParams.get("utm_medium") || "referral";
  const utmCampaign = searchParams.get("utm_campaign") || slug;
  const userAgent = req.headers.get("user-agent") || null;

  // Mask / hash IP for KDPA privacy compliance
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);

  // 3. Find event and target ticket URL
  let targetUrl = DEFAULT_TICKETS_URL;
  let eventRecord = null;

  try {
    eventRecord = await db.event.findFirst({
      where: {
        OR: [{ slug: slug }, { id: slug }],
      },
      select: {
        id: true,
        slug: true,
        externalTicketUrl: true,
      },
    });

    if (eventRecord?.externalTicketUrl) {
      targetUrl = eventRecord.externalTicketUrl;
    } else {
      // Check site settings for global tickets URL override
      const setting = await db.siteSetting.findUnique({
        where: { key: "HUSTLESASA_STORE_URL" },
      });
      if (setting?.value) {
        targetUrl = setting.value;
      }
    }
  } catch {
    // If DB read fails, fall back to default URL
    targetUrl = DEFAULT_TICKETS_URL;
  }

  // Construct final redirect URL with UTM query params appended
  try {
    const finalUrlObj = new URL(targetUrl);
    finalUrlObj.searchParams.set("utm_source", utmSource);
    finalUrlObj.searchParams.set("utm_medium", utmMedium);
    finalUrlObj.searchParams.set("utm_campaign", utmCampaign);
    if (searchParams.has("utm_term")) {
      finalUrlObj.searchParams.set("utm_term", searchParams.get("utm_term")!);
    }
    if (searchParams.has("utm_content")) {
      finalUrlObj.searchParams.set("utm_content", searchParams.get("utm_content")!);
    }
    targetUrl = finalUrlObj.toString();
  } catch {
    // URL parsing fallback
  }

  // 4. Non-blocking asynchronous click logging (does NOT block or delay the redirect)
  if (eventRecord?.id) {
    void (async () => {
      try {
        await db.clickEvent.create({
          data: {
            eventId: eventRecord.id,
            placement,
            phaseName,
            utmSource,
            utmMedium,
            utmCampaign,
            targetUrl,
            userAgent,
            ipHash,
          },
        });
      } catch (err) {
        // Logging error silently swallowed to prioritize user redirect experience
      }
    })();
  }

  // 5. Immediate HTTP 302 Redirect
  return NextResponse.redirect(targetUrl, {
    status: 302,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

