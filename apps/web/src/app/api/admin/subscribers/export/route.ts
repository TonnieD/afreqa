import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, recordAuditLog, canExportSubscribers, sanitizeCsvField } from "@afreqa/core";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !canExportSubscribers(user.role)) {
    return NextResponse.json(
      { error: "Forbidden: CSV export is restricted to Administrators only." },
      { status: 403 }
    );
  }

  const subscribers = await db.subscriber.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      email: true,
      firstName: true,
      phoneE164: true,
      emailStatus: true,
      whatsappOptIn: true,
      interests: true,
      source: true,
      createdAt: true,
      verifiedAt: true,
    },
  });

  // Construct sanitized CSV rows
  const headers = [
    "Email",
    "First Name",
    "Phone (E.164)",
    "Status",
    "WhatsApp Opt-In",
    "Interests",
    "Source",
    "Created At",
    "Verified At",
  ];

  const csvRows = [headers.join(",")];

  for (const sub of subscribers) {
    const row = [
      sanitizeCsvField(sub.email),
      sanitizeCsvField(sub.firstName || ""),
      sanitizeCsvField(sub.phoneE164 || ""),
      sanitizeCsvField(sub.emailStatus),
      sanitizeCsvField(sub.whatsappOptIn ? "YES" : "NO"),
      sanitizeCsvField(sub.interests.join("; ")),
      sanitizeCsvField(sub.source || ""),
      sanitizeCsvField(sub.createdAt.toISOString()),
      sanitizeCsvField(sub.verifiedAt ? sub.verifiedAt.toISOString() : ""),
    ];
    csvRows.push(row.join(","));
  }

  const csvContent = "\uFEFF" + csvRows.join("\r\n"); // Add BOM for clean Excel import

  // Audit log the export
  await recordAuditLog({
    userId: user.id,
    userEmail: user.email,
    action: "CSV_EXPORT",
    resource: "Subscriber",
    payload: { recordCount: subscribers.length },
    ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip"),
    userAgent: req.headers.get("user-agent"),
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="afreqa-subscribers-${timestamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

