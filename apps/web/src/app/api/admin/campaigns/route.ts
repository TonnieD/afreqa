import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, recordAuditLog, hasPermission, enqueueCampaignEmail } from "@afreqa/core";

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "campaigns:manage")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaigns = await db.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { recipients: true } },
    },
  });

  return NextResponse.json(campaigns);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "campaigns:manage")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, subject, previewText, contentHtml, segmentInterests } = body;

    if (!title || !subject || !contentHtml) {
      return NextResponse.json(
        { error: "Campaign title, subject, and HTML content are required." },
        { status: 400 }
      );
    }

    // 1. Query matching active subscribers
    const whereClause: { emailStatus: "ACTIVE"; interests?: { hasSome: string[] } } = {
      emailStatus: "ACTIVE",
    };
    if (Array.isArray(segmentInterests) && segmentInterests.length > 0) {
      whereClause.interests = { hasSome: segmentInterests };
    }

    const recipients = await db.subscriber.findMany({
      where: whereClause,
      select: { id: true, email: true },
    });

    // 2. Create Campaign record
    const campaign = await db.campaign.create({
      data: {
        title,
        subject,
        previewText,
        contentHtml,
        segmentInterests: Array.isArray(segmentInterests) ? segmentInterests : [],
        status: recipients.length > 0 ? "SENDING" : "SENT",
        totalRecipients: recipients.length,
        createdById: user.id,
        sentAt: new Date(),
      },
    });

    // 3. Create CampaignRecipient entries & enqueue pg-boss jobs
    if (recipients.length > 0) {
      await db.campaignRecipient.createMany({
        data: recipients.map((r) => ({
          campaignId: campaign.id,
          subscriberId: r.id,
          status: "QUEUED",
        })),
      });

      for (const r of recipients) {
        await enqueueCampaignEmail({
          campaignId: campaign.id,
          subscriberId: r.id,
          email: r.email,
          subject,
          html: contentHtml,
        }).catch(() => {});
      }
    }

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "CAMPAIGN_DISPATCH",
      resource: "Campaign",
      resourceId: campaign.id,
      payload: { title: campaign.title, recipientsCount: recipients.length },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to dispatch campaign";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

