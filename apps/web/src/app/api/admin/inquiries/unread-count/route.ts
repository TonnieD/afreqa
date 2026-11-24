import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, hasPermission } from "@afreqa/core";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "inquiries:read")) {
    return NextResponse.json({ unreadCount: 0 }, { status: 401 });
  }

  try {
    const unreadCount = await db.contactMessage.count({
      where: { isRead: false },
    });

    return NextResponse.json({ unreadCount });
  } catch {
    return NextResponse.json({ unreadCount: 0 });
  }
}
