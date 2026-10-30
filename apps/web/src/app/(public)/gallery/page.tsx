import Link from "next/link";
import Image from "next/image";
import { db } from "@afreqa/core";
import { Camera, Film, ArrowUpRight, Sparkles } from "lucide-react";
import { VideoPlayer } from "@/components/media/VideoPlayer";

export const metadata = {
  title: "Visual Gallery & After-Movies | Afreqa Nairobi",
  description:
    "Explore high-energy photo archives and official after-movies capturing Kenya's electronic dance music movement.",
};

const SAMPLE_ALBUMS = [
  {
    id: "alb-resonance-01",
    title: "Afreqa: Resonance (Launch Edition)",
    slug: "resonance-2026",
    description: "Laser beams, euphoric crowd energy, and hypnotic basslines under the Nairobi skyline.",
    coverUrl: "/images/afreqa-live-crowd.jpg",
    photoCount: 42,
    videoCount: 2,
    year: "2026",
  },
  {
    id: "alb-solstice-02",
    title: "Summer Solstice Underground",
    slug: "solstice-underground",
    description: "Sunset Amapiano and Afro-Tech vibrations transitioning into nocturnal synth fantasy.",
    coverUrl: "/images/afreqa-live-crowd.jpg",
    photoCount: 36,
    videoCount: 1,
    year: "2025",
  },
  {
    id: "alb-warehouse-03",
    title: "Secret Warehouse Sessions",
    slug: "secret-warehouse",
    description: "An intimate, members-only techno sanctuary engineered for pure sonic immersion.",
    coverUrl: "/images/afreqa-live-crowd.jpg",
    photoCount: 28,
    videoCount: 1,
    year: "2025",
  },
];

export default async function GalleryPage() {
  let albums = SAMPLE_ALBUMS;

  try {
    const dbAlbums = await db.album.findMany({
      where: { visibility: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { media: true } },
      },
    });

    if (dbAlbums.length > 0) {
      albums = dbAlbums.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        description: a.description || "Festival edition visual archive",
        coverUrl: a.coverUrl || "/images/afreqa-live-crowd.jpg",
        photoCount: a._count.media,
        videoCount: 1,
        year: new Date(a.createdAt).getFullYear().toString(),
      }));
    }
  } catch {
    // If DB offline, fallback to sample
  }

  return (
    <div className="space-y-16 pb-24">
      {/* 1. Gallery Header */}
      <section className="text-center px-4 max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Visual Archive</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
          Captured In The Frequency
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
          Relive the euphoria. A sensory catalog of stage designs, transcendent crowd moments, and official after-movies recorded across Nairobi.
        </p>
      </section>

      {/* 2. Featured Official After-Movie */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            <h2 className="font-display font-bold text-lg text-white uppercase tracking-wide">
              Featured Festival Teaser
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">1080p Transcode</span>
        </div>

        <VideoPlayer
          title="Afreqa: Resonance Official Festival Teaser"
          posterUrl="/images/afreqa-live-crowd.jpg"
          provider="youtube"
          providerId="dQw4w9WgXcQ"
        />
      </section>

      {/* 3. Festival Editions Albums Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-white/10 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" />
            <h2 className="font-display font-bold text-xl text-white uppercase tracking-wide">
              Official Edition Albums
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {albums.length} Public Editions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/gallery/${album.slug}`}
              className="group rounded-3xl bg-[#0f1117]/80 backdrop-blur-md border border-white/10 overflow-hidden hover:border-amber-400/40 transition-all duration-300 shadow-xl hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] w-full bg-black overflow-hidden">
                <Image
                  src={album.coverUrl}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-white text-[10px] font-mono">
                  {album.year}
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded">
                    <Camera className="w-3 h-3 text-amber-400" />
                    <span>{album.photoCount} photos</span>
                  </span>
                  <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded">
                    <Film className="w-3 h-3 text-zinc-400" />
                    <span>{album.videoCount} video</span>
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    {album.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {album.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

