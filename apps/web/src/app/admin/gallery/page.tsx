import { requireAuth } from "@/lib/auth";
import { db } from "@afreqa/core";
import { Image as ImageIcon, Plus, Shield } from "lucide-react";

export default async function AdminGalleryPage() {
  await requireAuth("gallery:read");

  let albums: Array<{
    id: string;
    title: string;
    slug: string;
    visibility: string;
    downloadProtection: string;
    _count: { media: number };
  }> = [];

  try {
    albums = await db.album.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { media: true } },
      },
    });
  } catch {
    // If DB offline
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-afreqa-chrome-high/10">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
            Media & Festival Gallery
          </h1>
          <p className="text-xs text-afreqa-silver-mid mt-1 font-mono">
            Manage festival photo albums, photographer credits, and right-click deterrent protection
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-8 text-center">
        <ImageIcon className="w-12 h-12 text-afreqa-teal mx-auto mb-3 opacity-80" />
        <h3 className="font-bold text-base text-afreqa-chrome-high">Festival Albums & Media Engine</h3>
        <p className="text-xs text-afreqa-silver-mid max-w-md mx-auto mt-1 mb-4 leading-relaxed">
          The basic image uploader is active (`/api/uploads/images`). Full multi-photo album upload, ffmpeg video transcoding, and tus resumable chunking will be managed here in Phase 4.
        </p>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-afreqa-teal/10 border border-afreqa-teal/30 text-afreqa-teal text-xs font-mono font-bold uppercase">
          <Shield className="w-3.5 h-3.5" />
          <span>Storage Volume & Sharp Pipeline Ready</span>
        </span>
      </div>
    </div>
  );
}

