import { NextRequest, NextResponse } from "next/server";
import { db, checkRateLimit } from "@afreqa/core";
import crypto from "crypto";

const DEFAULT_TICKETS_URL = "https://afreqamusicfestival.hustlesasa.shop/";

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
      const setting = await db.siteSetting.findFirst({
        where: {
          key: { in: ["HUSTLESASA_STORE_URL", "hustlesasa.url"] },
        },
      });
      if (setting?.value) {
        targetUrl = setting.value;
      }
    }
  } catch {
    // If DB read fails, fall back to default URL
    targetUrl = DEFAULT_TICKETS_URL;
  }

  // Sanitize: Automatically normalize any deprecated afreqanairobi URL to the verified active shop
  if (targetUrl.includes("afreqanairobi.hustlesasa.shop")) {
    targetUrl = targetUrl.replace("afreqanairobi.hustlesasa.shop", "afreqamusicfestival.hustlesasa.shop");
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

  // 5. Cross-Browser Resilient Redirect (Native HTTP 302 + Meta-Refresh + JS fallback)
  // Ensures compatibility across Edge, Chrome, Safari, Firefox, and mobile browsers
  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting to Official Tickets • Afreqa</title>
  <meta http-equiv="refresh" content="0;url=${targetUrl}">
  <meta name="referrer" content="no-referrer-when-downgrade">
</head>
<body style="background:#070709;color:#ffffff;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;box-sizing:border-box;">
  <div style="text-align:center;max-width:480px;">
    <div style="width:40px;height:40px;border:3px solid rgba(245,158,11,0.2);border-top-color:#f59e0b;border-radius:50%;margin:0 auto 20px;animation:spin 1s linear infinite;"></div>
    <h2 style="font-size:18px;font-weight:800;letter-spacing:1px;margin:0 0 8px;text-transform:uppercase;">Redirecting to HustleSasa</h2>
    <p style="font-size:14px;color:#a1a1aa;margin:0 0 16px;">Securing your spot at Nairobi's Tomorrowland Experience...</p>
    <p style="font-size:13px;color:#71717a;margin:0;">If you are not redirected automatically, <a href="${targetUrl}" style="color:#f59e0b;text-decoration:underline;font-weight:bold;">click here</a>.</p>
  </div>
  <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  <script>
    try {
      window.location.replace(${JSON.stringify(targetUrl)});
    } catch (e) {
      window.location.href = ${JSON.stringify(targetUrl)};
    }
  </script>
</body>
</html>`;

  return new NextResponse(htmlBody, {
    status: 302,
    headers: {
      Location: targetUrl,
      Refresh: `0; url=${targetUrl}`,
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Referrer-Policy": "no-referrer-when-downgrade",
      "Access-Control-Allow-Origin": "*",
      "x-nextjs-redirect": targetUrl,
    },
  });
}

