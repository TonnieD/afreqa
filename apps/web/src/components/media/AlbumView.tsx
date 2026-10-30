"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Maximize2, ShieldAlert } from "lucide-react";
import { GalleryLightbox, GalleryPhoto } from "./GalleryLightbox";

interface AlbumViewProps {
  photos: GalleryPhoto[];
  downloadProtection: "DISABLED" | "DETERRENT";
}

export function AlbumView({ photos, downloadProtection }: AlbumViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openPhoto = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const isDeterrent = downloadProtection === "DETERRENT";

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        onContextMenu={isDeterrent ? (e) => e.preventDefault() : undefined}
      >
        {photos.map((photo, idx) => {
          const thumbUrl = photo.responsiveUrls?.medium || photo.responsiveUrls?.thumb || photo.originalUrl;

          return (
            <div
              key={photo.id}
              onClick={() => openPhoto(idx)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-afreqa-shadow border border-afreqa-chrome-high/10 cursor-pointer hover:border-afreqa-teal/50 transition duration-300 shadow-md"
            >
              <Image
                src={thumbUrl}
                alt={photo.caption || `Festival moment ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onDragStart={isDeterrent ? (e) => e.preventDefault() : undefined}
                className="object-cover group-hover:scale-105 transition duration-500 select-none"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="self-end p-2 rounded-full bg-black/60 text-white">
                  <Maximize2 className="w-4 h-4 text-afreqa-teal" />
                </div>

                <div>
                  {photo.caption && (
                    <p className="text-xs font-bold text-white line-clamp-1">{photo.caption}</p>
                  )}
                  {photo.photographerCredit && (
                    <span className="text-[10px] text-afreqa-silver-mid font-mono block mt-0.5">
                      📷 {photo.photographerCredit}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <GalleryLightbox
        photos={photos}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

