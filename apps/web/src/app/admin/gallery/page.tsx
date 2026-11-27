import {
  db,
  getGalleryCapStatus,
  getStorageDriverName,
  resolveMediaUrl,
} from "@afreqa/core";
import { requireAuth } from "@/lib/auth";
import { GalleryUploader } from "@/components/admin/GalleryUploader";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAuth("gallery:write");

  const [photoCount, albumCount, albums, recentAssets] = await Promise.all([
    db.mediaAsset.count({ where: { type: "PHOTO" } }),
    db.album.count(),
    db.album.findMany({
      select: { id: true, title: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.mediaAsset.findMany({
      where: { type: "PHOTO", status: "READY" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        filename: true,
        originalUrl: true,
        responsiveUrls: true,
        caption: true,
      },
    }),
  ]);

  const cap = getGalleryCapStatus(photoCount);
  const driver = getStorageDriverName();
  const videoUploadEnabled = process.env.VIDEO_UPLOAD_ENABLED === "true";

  const initialPhotos = recentAssets.map((asset) => {
    const resp = asset.responsiveUrls as { thumb?: string } | null;
    return {
      id: asset.id,
      filename: asset.filename || "photo",
      thumbUrl: resolveMediaUrl(resp?.thumb || asset.originalUrl),
      caption: asset.caption,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-afreqa-chrome-high">
          Media &amp; Gallery Management
        </h1>
        <p className="text-sm text-afreqa-silver-mid mt-1">
          Manage photo albums and upload optimized WebP variants (400w, 1200w, 2400w + LQIP).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-afreqa-void border border-afreqa-chrome-high/10">
          <div className="text-xs font-mono uppercase text-afreqa-silver-mid">Total Albums</div>
          <div className="text-3xl font-bold text-afreqa-chrome-high mt-2">{albumCount}</div>
        </div>
        <div className="p-6 rounded-xl bg-afreqa-void border border-afreqa-chrome-high/10">
          <div className="text-xs font-mono uppercase text-afreqa-silver-mid">Photo Pipeline</div>
          <div className="text-sm font-semibold text-afreqa-teal mt-2">
            WebP Variants Only ({driver})
          </div>
        </div>
        <div className="p-6 rounded-xl bg-afreqa-void border border-afreqa-chrome-high/10">
          <div className="text-xs font-mono uppercase text-afreqa-silver-mid">Video Hosting</div>
          <div className="text-sm font-semibold text-afreqa-silver-mid mt-2">
            {videoUploadEnabled ? "Direct Upload Enabled" : "Embeds Only (YouTube / Vimeo)"}
          </div>
        </div>
      </div>

      <GalleryUploader
        initialCap={cap}
        driver={driver}
        albums={albums}
        initialPhotos={initialPhotos}
      />
    </div>
  );
}
