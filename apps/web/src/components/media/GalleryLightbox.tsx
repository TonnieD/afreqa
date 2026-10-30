"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Camera, ShieldAlert } from "lucide-react";

export interface GalleryPhoto {
  id: string;
  originalUrl: string;
  responsiveUrls?: {
    thumb?: string;
    medium?: string;
    full?: string;
  } | null;
  caption?: string | null;
  photographerCredit?: string | null;
  width?: number | null;
  height?: number | null;
}

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryLightbox({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, photos.length]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex]!;
  const displayUrl =
    currentPhoto.responsiveUrls?.full ||
    currentPhoto.responsiveUrls?.medium ||
    currentPhoto.originalUrl;

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const showPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-xl animate-fadeIn"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-afreqa-silver-mid">
            {currentIndex + 1} / {photos.length}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-afreqa-teal">
            Protected Deterrent Derivative
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-afreqa-chrome-high transition"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden select-none">
        {/* Navigation Buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={showPrev}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition hover:scale-105"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={showNext}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white transition hover:scale-105"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Protected photo with drag deterrent */}
        <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center">
          <img
            src={displayUrl}
            alt={currentPhoto.caption || "Afreqa Festival Moment"}
            onDragStart={(e) => e.preventDefault()}
            className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl pointer-events-auto"
          />
        </div>
      </div>

      {/* Bottom Caption & Credit Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs z-10">
        <div>
          {currentPhoto.caption && (
            <p className="font-semibold text-afreqa-chrome-high">{currentPhoto.caption}</p>
          )}
          {currentPhoto.photographerCredit ? (
            <div className="flex items-center gap-1.5 text-afreqa-silver-mid font-mono mt-0.5">
              <Camera className="w-3.5 h-3.5 text-afreqa-teal" />
              <span>Shot by: {currentPhoto.photographerCredit}</span>
            </div>
          ) : (
            <span className="text-[11px] text-afreqa-silver-mid font-mono">
              © Afreqa Festival Archive
            </span>
          )}
        </div>

        <div className="text-[10px] font-mono text-afreqa-silver-mid/60 text-right">
          Right-click & drag deterred • KDPA Content Protection
        </div>
      </div>
    </div>
  );
}

