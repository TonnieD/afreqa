import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@afreqa/core";
import { ShieldAlert, ArrowLeft, Camera, Film } from "lucide-react";
import { AlbumView } from "@/components/media/AlbumView";
import { VideoPlayer } from "@/components/media/VideoPlayer";

interface AlbumPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AlbumPageProps) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ").toUpperCase()} Archive | Afreqa Gallery`,
    description: `Browse official photos and videos from the ${slug} festival edition in Nairobi.`,
  };
}

export default async function AlbumDetailPage({ params }: AlbumPageProps) {
  const { slug } = await params;

  let albumData: {
    id: string;
    title: string;
    description: string | null;
    downloadProtection: "DISABLED" | "DETERRENT";
    photos: Array<{
      id: string;
      originalUrl: string;
      responsiveUrls?: { thumb?: string; medium?: string; full?: string } | null;
      caption?: string | null;
      photographerCredit?: string | null;
    }>;
    videos: Array<{
      id: string;
      title?: string;
      provider?: string | null;
      providerId?: string | null;
      posterUrl?: string | null;
      originalUrl?: string | null;
    }>;
  } | null = null;

  try {
    const dbAlbum = await db.album.findUnique({
      where: { slug },
      include: {
        media: {
          where: { status: "READY" },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (dbAlbum) {
      albumData = {
        id: dbAlbum.id,
        title: dbAlbum.title,
        description: dbAlbum.description,
        downloadProtection: dbAlbum.downloadProtection as "DISABLED" | "DETERRENT",
        photos: dbAlbum.media
          .filter((m) => m.type === "PHOTO")
          .map((m) => ({
            id: m.id,
            originalUrl: m.originalUrl,
            responsiveUrls: m.responsiveUrls as { thumb?: string; medium?: string; full?: string } | null,
            caption: m.caption,
            photographerCredit: m.photographerCredit,
          })),
        videos: dbAlbum.media
          .filter((m) => m.type === "VIDEO_UPLOAD" || m.type === "VIDEO_EMBED")
          .map((m) => ({
            id: m.id,
            title: m.caption || "Festival Video",
            provider: m.provider,
            providerId: m.providerId,
            posterUrl: m.posterUrl,
            originalUrl: m.originalUrl,
          })),
      };
    }
  } catch {
    // If DB offline
  }

  // Fallback showcase data for pre-seeded slugs
  if (!albumData) {
    if (["resonance-2026", "solstice-underground", "secret-warehouse"].includes(slug)) {
      albumData = {
        id: `mock-${slug}`,
        title: slug.replace(/-/g, " ").toUpperCase(),
        description: "Official high-energy festival moments, stage lighting, and electronic raver euphoria.",
        downloadProtection: "DETERRENT",
        photos: [
          {
            id: "p1",
            originalUrl: "/brand/logo.jpg",
            caption: "Afreqa Main Stage Lighting Grid",
            photographerCredit: "Nairobi Raves Collective",
          },
          {
            id: "p2",
            originalUrl: "/brand/logo.jpg",
            caption: "Crowd Euphoria during Afro-Tech Peak Time",
            photographerCredit: "Afreqa Media Team",
          },
          {
            id: "p3",
            originalUrl: "/brand/logo.jpg",
            caption: "Bassline Reverberation under the Laser Canopy",
            photographerCredit: "Kendi Visuals",
          },
          {
            id: "p4",
            originalUrl: "/brand/logo.jpg",
            caption: "Dawn Breakdown & Sunrise Celebration",
            photographerCredit: "Afreqa Media Team",
          },
        ],
        videos: [
          {
            id: "v1",
            title: "Afreqa Resonance Live Set Highlights",
            provider: "youtube",
            providerId: "dQw4w9WgXcQ",
            posterUrl: "/brand/logo.jpg",
          },
        ],
      };
    } else {
      notFound();
    }
  }

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Back button & Header */}
      <div>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-afreqa-silver hover:text-afreqa-teal transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Albums</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-afreqa-chrome-high/10 pb-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-afreqa-chrome-high uppercase tracking-wide">
              {albumData.title}
            </h1>
            {albumData.description && (
              <p className="text-sm text-afreqa-silver mt-2 max-w-2xl leading-relaxed">
                {albumData.description}
              </p>
            )}
          </div>

          {albumData.downloadProtection === "DETERRENT" && (
            <div className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-afreqa-teal/10 border border-afreqa-teal/30 text-afreqa-teal text-xs font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Right-Click & Drag Deterred</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Section if available */}
      {albumData.videos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-afreqa-teal" />
            <h2 className="font-display font-bold text-lg text-afreqa-chrome-high uppercase tracking-wide">
              Official Video Recap
            </h2>
          </div>
          <div className="max-w-4xl">
            {albumData.videos.map((vid) => (
              <VideoPlayer
                key={vid.id}
                title={vid.title}
                provider={vid.provider}
                providerId={vid.providerId}
                src={vid.originalUrl}
                posterUrl={vid.posterUrl || "/brand/logo.jpg"}
              />
            ))}
          </div>
        </section>
      )}

      {/* Photos Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-afreqa-teal" />
          <h2 className="font-display font-bold text-lg text-afreqa-chrome-high uppercase tracking-wide">
            Photo Archive ({albumData.photos.length} Captured)
          </h2>
        </div>

        <AlbumView
          photos={albumData.photos}
          downloadProtection={albumData.downloadProtection}
        />
      </section>
    </div>
  );
}

