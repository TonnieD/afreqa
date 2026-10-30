import { NextResponse } from "next/server";
import { defaultWhatsAppProvider } from "@afreqa/core";

export const dynamic = "force-static";

export async function GET() {
  const vcard = defaultWhatsAppProvider.generateVCard({
    name: "Afreqa Nairobi",
    org: "Afreqa Productions Ltd",
    title: "Official EDM Community & Event Desk",
    phone: process.env.WHATSAPP_PHONE || "+254700000000",
    email: "frequencies@afreqa.com",
    url: "https://afreqa.com",
    note: "Official Afreqa Nairobi contact. Save this contact to guarantee delivery of WhatsApp festival announcements, secret lineups, and Early Bird drops.",
  });

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="afreqa.vcf"',
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

