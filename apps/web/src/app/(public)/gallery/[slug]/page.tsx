import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@afreqa/core";
import { ShieldAlert, ArrowLeft, Camera, Film, ArrowUpRight, FolderHeart, DownloadCloud } from "lucide-react";
import { AlbumView } from "@/components/media/AlbumView";
import { VideoPlayer } from "@/components/media/VideoPlayer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    if (slug === "halloween-alloy") {
      albumData = {
        id: "mock-halloween-alloy",
        title: "A Tomorrowland Halloween XP (Alloy Bar & Lounge)",
        description: "Official night photos: high-octane rave crowd, creative Halloween costumes, and midnight B2B sets under the Alloy lights.",
        downloadProtection: "DETERRENT",
        photos: [
          {
            id: "hl-1",
            originalUrl: "/images/afreqa-live-crowd.jpg",
            caption: "Mainstage Peak Time Rave Energy & Crowd Hands",
            photographerCredit: "Afreqa Media Team",
          },
          {
            id: "hl-2",
            originalUrl: "/images/afreqa-halloween-alloy.jpg",
            caption: "Official Tomorrowland Halloween XP Poster & Lineup Artwork",
            photographerCredit: "Afreqa Creative Lab",
          },
          {
            id: "hl-3",
            originalUrl: "/images/afreqa-live-crowd.jpg",
            caption: "Coco Kahi B2B Mike Muema Midnight Set",
            photographerCredit: "Afreqa Media Team",
          },
          {
            id: "hl-4",
            originalUrl: "/images/afreqa-live-crowd.jpg",
            caption: "Laser Canopy & Pyramid Stage Centerpiece",
            photographerCredit: "Nairobi Raves Collective",
          },
        ],
        videos: [
          {
            id: "v1",
            title: "Afreqa Halloween XP Live Recap Highlights",
            provider: "youtube",
            providerId: "dQw4w9WgXcQ",
            posterUrl: "/images/afreqa-halloween-alloy.jpg",
          },
        ],
      };
    } else if (["resonance-2026", "solstice-underground", "secret-warehouse"].includes(slug)) {
      albumData = {
        id: `mock-${slug}`,
        title: slug.replace(/-/g, " ").toUpperCase(),
        description: "Official high-energy festival moments, stage lighting, and electronic raver euphoria.",
        downloadProtection: "DETERRENT",
        photos: [
          {
            id: "p1",
            originalUrl: "/images/afreqa-live-crowd.jpg",
            caption: "Afreqa Main Stage Lighting Grid",
            photographerCredit: "Nairobi Raves Collective",
          },
          {
            id: "p2",
            originalUrl: "/images/afreqa-live-crowd.jpg",
            caption: "Crowd Euphoria during Afro-Tech Peak Time",
            photographerCredit: "Afreqa Media Team",
          },
        ],
        videos: [],
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
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400 transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Albums</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-wide">
              {albumData.title}
            </h1>
            {albumData.description && (
              <p className="text-sm text-zinc-300 mt-2 max-w-2xl leading-relaxed">
                {albumData.description}
              </p>
            )}
          </div>

          {albumData.downloadProtection === "DETERRENT" && (
            <div className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Right-Click & Drag Deterred</span>
            </div>
          )}
        </div>

        {/* External High-Res Drive / Cloud Photos Vault */}
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#0f1117] via-[#151926] to-[#0f1117] border border-amber-500/40 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-inner">
              <FolderHeart className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-base sm:text-lg text-white">
                  Official Google Drive Photo Vault
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Google Drive Cloud
                </span>
              </div>
              <p className="text-xs text-zinc-300 max-w-xl">
                Browse, download, and share full uncompressed high-resolution event photography from Alloy Bar & Lounge directly on Google Drive.
              </p>
            </div>
          </div>
          <a
            href={process.env.NEXT_PUBLIC_HALLOWEEN_PHOTOS_URL || "https://drive.google.com/drive/folders/1EKHSU4PsGTeNACb7GM6ST-mGbslRuiKA"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-500/30 transition-all shrink-0 active:scale-95"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Open Google Drive Vault</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Video Section if available */}
      {albumData.videos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            <h2 className="font-display font-bold text-lg text-white uppercase tracking-wide">
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
                posterUrl={vid.posterUrl || "/images/afreqa-halloween-alloy.jpg"}
              />
            ))}
          </div>
        </section>
      )}

      {/* Photos Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-amber-400" />
          <h2 className="font-display font-bold text-lg text-white uppercase tracking-wide">
            Photo Archive Highlights ({albumData.photos.length} Featured)
          </h2>
        </div>

        <AlbumView
          photos={albumData.photos}
          downloadProtection={albumData.downloadProtection}
        />
      </section>

      {/* Google Drive Live Folder Browser */}
      {slug === "halloween-alloy" && (
        <section className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <FolderHeart className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="font-display font-bold text-lg text-white uppercase tracking-wide">
                  Google Drive Live Vault Explorer
                </h2>
                <p className="text-xs text-zinc-400">
                  Full uncompressed gallery synced directly from the Afreqa photography team.
                </p>
              </div>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_HALLOWEEN_PHOTOS_URL || "https://drive.google.com/drive/folders/1EKHSU4PsGTeNACb7GM6ST-mGbslRuiKA"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-amber-400 transition"
            >
              <span>Open in Full Google Drive</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="rounded-3xl border border-white/15 overflow-hidden bg-black/80 shadow-2xl">
            <div className="bg-[#12141c] px-4 py-3 border-b border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-200">Google Drive: Afreqa Halloween XP</span>
              </div>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">Drive Folder ID: 1EKHSU4PsGTeNACb7GM6ST-mGbslRuiKA</span>
            </div>
            <iframe
              src="https://drive.google.com/embeddedfolderview?id=1EKHSU4PsGTeNACb7GM6ST-mGbslRuiKA#grid"
              className="w-full h-[620px] border-0 bg-[#0c0d12]"
              title="Afreqa Halloween Google Drive Vault"
              loading="lazy"
              allow="fullscreen"
            />
          </div>
        </section>
      )}
    </div>
  );
}

