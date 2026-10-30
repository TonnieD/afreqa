import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, recordAuditLog, hasPermission } from "@afreqa/core";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "inquiries:manage")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { isRead, isReplied } = body;

    const updated = await db.contactMessage.update({
      where: { id },
      data: {
        isRead: isRead !== undefined ? Boolean(isRead) : undefined,
        isReplied: isReplied !== undefined ? Boolean(isReplied) : undefined,
        repliedAt: isReplied ? new Date() : undefined,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "INQUIRY_STATUS_UPDATE",
      resource: "ContactMessage",
      resourceId: id,
      payload: { isRead: updated.isRead, isReplied: updated.isReplied },
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update inquiry";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

