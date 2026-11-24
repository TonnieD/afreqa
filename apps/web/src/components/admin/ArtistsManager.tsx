"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, Upload, Music, ExternalLink, ZoomIn, Eye, Move, Maximize2, Sparkles, Check, Calendar } from "lucide-react";
import { parseArtistFraming, serializeArtistFraming, DEFAULT_FRAMING, type ArtistFraming } from "@/lib/artist-framing";
import { ArtistPortraitPlaceholder } from "@/components/admin/ArtistPortraitPlaceholder";
import { AdminConfirmModal } from "@/components/admin/AdminConfirmModal";
import { AdminToast, type ToastMessage } from "@/components/admin/AdminToast";

interface ArtistItem {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  photoUrl: string | null;
  genres: string[];
  instagramUrl: string | null;
  soundcloudUrl: string | null;
  spotifyUrl: string | null;
  isFictional: boolean;
  eventSlots: Array<{
    id: string;
    stageName: string | null;
    setStartTime: string | null;
    event: { title: string; date: Date };
  }>;
}

export function ArtistsManager({ initialArtists }: { initialArtists: ArtistItem[] }) {
  const [artists, setArtists] = useState<ArtistItem[]>(initialArtists);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<ArtistItem | null>(null);

  // Lightbox full image view
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPosterUrl] = useState("");
  const [genresInput, setGenresInput] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [soundcloudUrl, setSoundcloudUrl] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [isFictional, setIsFictional] = useState(true);
  const [performedEventsCount, setPerformedEventsCount] = useState<number>(0);

  // System On-Screen Popups & Notifications (Replacing browser alerts/confirms)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: async () => {},
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Framing & Face Visibility states
  const [focalY, setFocalY] = useState<number>(DEFAULT_FRAMING.focalY);
  const [focalX, setFocalX] = useState<number>(DEFAULT_FRAMING.focalX);
  const [zoom, setZoom] = useState<number>(DEFAULT_FRAMING.zoom);
  const [fitMode, setFitMode] = useState<"cover" | "contain">(DEFAULT_FRAMING.fit);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingArtist(null);
    setName("");
    setSlug("");
    setBio("");
    setPosterUrl("");
    setGenresInput("Progressive EDM, Big Room, Melodic Techno, Techno, Hardstyle");
    setInstagramUrl("");
    setSoundcloudUrl("");
    setSpotifyUrl("");
    setIsFictional(true);
    setPerformedEventsCount(0);
    setFocalY(DEFAULT_FRAMING.focalY);
    setFocalX(DEFAULT_FRAMING.focalX);
    setZoom(DEFAULT_FRAMING.zoom);
    setFitMode(DEFAULT_FRAMING.fit);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (artist: ArtistItem) => {
    setEditingArtist(artist);
    setName(artist.name);
    setSlug(artist.slug);

    const { framing, cleanBio } = parseArtistFraming(artist.bio);
    setBio(cleanBio);
    setFocalY(framing.focalY);
    setFocalX(framing.focalX);
    setZoom(framing.zoom);
    setFitMode(framing.fit);
    setPerformedEventsCount(
      framing.performedEventsCount !== undefined ? framing.performedEventsCount : artist.eventSlots.length
    );

    setPosterUrl(artist.photoUrl || "");
    setGenresInput(artist.genres.join(", "));
    setInstagramUrl(artist.instagramUrl || "");
    setSoundcloudUrl(artist.soundcloudUrl || "");
    setSpotifyUrl(artist.spotifyUrl || "");
    setIsFictional(artist.isFictional);
    setError(null);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingArtist) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const uploadedUrl =
        data.responsiveUrls?.full ||
        data.responsiveUrls?.medium ||
        data.originalUrl ||
        data.asset?.responsiveUrls?.full ||
        data.asset?.responsiveUrls?.medium ||
        data.asset?.originalUrl;
      if (uploadedUrl) {
        setPosterUrl(uploadedUrl);
      } else {
        throw new Error("Server returned no image URL");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const genres = genresInput
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    // Embed framing parameters and editable events count safely into bio
    const finalBio = serializeArtistFraming(bio, {
      focalY,
      focalX,
      zoom,
      fit: fitMode,
      performedEventsCount,
    });

    const payload = {
      name,
      slug,
      bio: finalBio,
      photoUrl,
      genres,
      instagramUrl,
      soundcloudUrl,
      spotifyUrl,
      isFictional,
    };

    try {
      const url = editingArtist ? `/api/admin/artists/${editingArtist.id}` : "/api/admin/artists";
      const method = editingArtist ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save artist");

      if (editingArtist) {
        setArtists(artists.map((a) => (a.id === editingArtist.id ? { ...a, ...data } : a)));
      } else {
        setArtists([...artists, { ...data, eventSlots: [] }]);
      }

      setToast({
        type: "success",
        message: `Artist "${name}" saved successfully to database.`,
      });
      setModalOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const promptDelete = (id: string, artistName: string) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete ${artistName}`,
      description: `Are you sure you want to permanently delete "${artistName}" from the AFREQA roster? This will permanently remove their profile and all event allocations from the database.`,
      confirmText: "Permanently Delete",
      onConfirm: async () => {
        setSaving(true);
        try {
          const res = await fetch(`/api/admin/artists/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete artist");
          setArtists((prev) => prev.filter((a) => a.id !== id));
          setToast({
            type: "success",
            message: `Artist "${artistName}" was successfully removed from the database.`,
          });
        } catch {
          setToast({
            type: "error",
            message: `Could not delete "${artistName}". Database request failed.`,
          });
        } finally {
          setSaving(false);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-glow-pink"
        >
          <Plus className="w-4 h-4" />
          <span>Add Artist / DJ</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => {
          const { framing, cleanBio } = parseArtistFraming(artist.bio);

          return (
            <div
              key={artist.id}
              className="rounded-3xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 overflow-hidden flex flex-col justify-between hover:border-pink-500/30 transition shadow-xl"
            >
              <div>
                {/* Photo with Focal Centering & Zoom */}
                <div className="relative h-52 w-full bg-black/60 overflow-hidden group">
                  {artist.photoUrl ? (
                    <>
                      <Image
                        src={artist.photoUrl}
                        alt={artist.name}
                        fill
                        className={`transition-transform duration-300 ${
                          framing.fit === "contain" ? "object-contain" : "object-cover"
                        }`}
                        style={{
                          objectPosition: `${framing.focalX}% ${framing.focalY}%`,
                          transform: framing.fit === "cover" ? `scale(${framing.zoom})` : undefined,
                          transformOrigin: `${framing.focalX}% ${framing.focalY}%`,
                        }}
                      />

                      {/* Hover action to zoom / see whole image */}
                      <button
                        onClick={() => setLightboxUrl(artist.photoUrl)}
                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition flex items-center gap-1.5 border border-white/20 shadow-lg"
                        title="View Full Uncropped Image"
                      >
                        <ZoomIn className="w-3.5 h-3.5 text-pink-400" />
                        <span>View Whole</span>
                      </button>
                    </>
                  ) : (
                    <ArtistPortraitPlaceholder />
                  )}

                  {artist.isFictional && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 border border-pink-500/40 text-pink-400 text-[10px] font-mono uppercase">
                      Sample Data
                    </span>
                  )}

                  {artist.photoUrl && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-zinc-400">
                      Face Align: {framing.focalY}% • {framing.fit}
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-white">{artist.name}</h3>
                    <span className="text-[11px] font-mono text-zinc-500">/{artist.slug}</span>
                  </div>

                  {cleanBio && (
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {cleanBio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {artist.genres.map((g, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-pink-400"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-afreqa-chrome-high/5 flex items-center justify-between mt-4">
                <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <span>
                    {framing.performedEventsCount !== undefined ? framing.performedEventsCount : artist.eventSlots.length}{" "}
                    {(framing.performedEventsCount !== undefined ? framing.performedEventsCount : artist.eventSlots.length) === 1
                      ? "festival appearance"
                      : "festival appearances"}
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(artist)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-pink-400 transition"
                    title="Edit artist & adjust framing"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => promptDelete(artist.id, artist.name)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                    title="Delete artist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox to see whole uncropped image */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={lightboxUrl}
                alt="Full Uncropped Artist"
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-3">
              Click anywhere to close full photo view
            </p>
          </div>
        </div>
      )}

      {/* Artist Editor Modal with Face Visibility & Framing Controls */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-afreqa-stage border border-afreqa-chrome-high/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {editingArtist ? `Edit ${editingArtist.name}` : "Add New Artist / DJ"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div>
                <label className="block uppercase font-mono text-zinc-400 mb-1">
                  Artist / Stage Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Sona Waves"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-white text-sm focus:outline-none focus:border-pink-500 transition"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-zinc-400 mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-white text-sm focus:outline-none focus:border-pink-500 transition font-mono"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-zinc-400 mb-1">
                  Genres (comma-separated)
                </label>
                <input
                  type="text"
                  value={genresInput}
                  onChange={(e) => setGenresInput(e.target.value)}
                  placeholder="Melodic Techno, Progressive House, Hardstyle"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-white text-sm focus:outline-none focus:border-pink-500 transition"
                />
              </div>

              {/* Photo Upload & Live Framing Tool */}
              <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="block uppercase font-mono text-pink-400 font-bold">
                    Artist Photo & Face Framing
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer transition text-xs">
                    <Upload className="w-3.5 h-3.5 text-pink-400" />
                    <span>{uploading ? "Uploading..." : "Upload New Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {!photoUrl ? (
                  <div className="pt-2">
                    <ArtistPortraitPlaceholder className="w-full h-44 rounded-2xl" />
                    <p className="text-[11px] text-zinc-500 font-mono text-center mt-2">
                      No custom photo uploaded. The default portrait silhouette will be used across lineup cards.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    {/* Live Preview Box */}
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-black border border-pink-500/30 shadow-inner group">
                      <Image
                        src={photoUrl}
                        alt="Face Framing Live Preview"
                        fill
                        className={`transition-all duration-150 ${
                          fitMode === "contain" ? "object-contain" : "object-cover"
                        }`}
                        style={{
                          objectPosition: `${focalX}% ${focalY}%`,
                          transform: fitMode === "cover" ? `scale(${zoom})` : undefined,
                          transformOrigin: `${focalX}% ${focalY}%`,
                        }}
                      />

                      {/* Face Target Guide Overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-2 border-pink-400/50 border-dashed" />
                      </div>

                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-black/70 text-[10px] font-mono text-white backdrop-blur">
                        Live Lineup Preview (Face Centering)
                      </div>
                    </div>

                    {/* Framing Adjustment Controls */}
                    <div className="space-y-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                      {/* Fit Mode Toggle */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-zinc-400">Display Mode:</span>
                        <div className="inline-flex rounded-lg p-0.5 bg-black/60 border border-white/10 text-xs font-mono">
                          <button
                            type="button"
                            onClick={() => setFitMode("cover")}
                            className={`px-3 py-1 rounded-md transition ${
                              fitMode === "cover" ? "bg-pink-500 text-white font-bold" : "text-zinc-400"
                            }`}
                          >
                            Cover & Center Face
                          </button>
                          <button
                            type="button"
                            onClick={() => setFitMode("contain")}
                            className={`px-3 py-1 rounded-md transition ${
                              fitMode === "contain" ? "bg-pink-500 text-white font-bold" : "text-zinc-400"
                            }`}
                          >
                            Fit Whole Photo
                          </button>
                        </div>
                      </div>

                      {fitMode === "cover" && (
                        <>
                          {/* Vertical Face Alignment (Top / Face to Bottom) */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-zinc-400">
                                Vertical Alignment (Face Position): {focalY}%
                              </span>
                              <div className="flex gap-1.5 text-[10px] font-mono">
                                <button
                                  type="button"
                                  onClick={() => setFocalY(15)}
                                  className={`px-2 py-0.5 rounded ${focalY === 15 ? "bg-pink-500/20 text-pink-400 border border-pink-500/40" : "bg-white/5 text-zinc-400"}`}
                                >
                                  Head/Face (15%)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFocalY(50)}
                                  className={`px-2 py-0.5 rounded ${focalY === 50 ? "bg-pink-500/20 text-pink-400 border border-pink-500/40" : "bg-white/5 text-zinc-400"}`}
                                >
                                  Center (50%)
                                </button>
                              </div>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={focalY}
                              onChange={(e) => setFocalY(Number(e.target.value))}
                              className="w-full accent-pink-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                              <span>Top of Head (0%)</span>
                              <span>Mid Body (50%)</span>
                              <span>Feet / Bottom (100%)</span>
                            </div>
                          </div>

                          {/* Horizontal Alignment */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-zinc-400">
                                Horizontal Alignment: {focalX}%
                              </span>
                              <button
                                type="button"
                                onClick={() => setFocalX(50)}
                                className="text-[10px] font-mono text-zinc-400 hover:text-white"
                              >
                                Center (50%)
                              </button>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={focalX}
                              onChange={(e) => setFocalX(Number(e.target.value))}
                              className="w-full accent-pink-500 cursor-pointer"
                            />
                          </div>

                          {/* Zoom Level */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-zinc-400">
                                Zoom Level: {zoom.toFixed(2)}x
                              </span>
                              <div className="flex gap-1.5 text-[10px] font-mono">
                                <button
                                  type="button"
                                  onClick={() => setZoom(1.0)}
                                  className={`px-2 py-0.5 rounded ${zoom === 1.0 ? "bg-pink-500/20 text-pink-400 border border-pink-500/40" : "bg-white/5 text-zinc-400"}`}
                                >
                                  1.0x
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setZoom(1.25)}
                                  className={`px-2 py-0.5 rounded ${zoom === 1.25 ? "bg-pink-500/20 text-pink-400 border border-pink-500/40" : "bg-white/5 text-zinc-400"}`}
                                >
                                  1.25x
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setZoom(1.5)}
                                  className={`px-2 py-0.5 rounded ${zoom === 1.5 ? "bg-pink-500/20 text-pink-400 border border-pink-500/40" : "bg-white/5 text-zinc-400"}`}
                                >
                                  1.5x
                                </button>
                              </div>
                            </div>
                            <input
                              type="range"
                              min="0.9"
                              max="2.0"
                              step="0.05"
                              value={zoom}
                              onChange={(e) => setZoom(Number(e.target.value))}
                              className="w-full accent-pink-500 cursor-pointer"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block uppercase font-mono text-zinc-400 mb-1 flex items-center justify-between">
                  <span>Number of Events Performed</span>
                  <span className="text-[10px] text-pink-400 font-normal">Past AFREQA sets</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={performedEventsCount}
                  onChange={(e) => setPerformedEventsCount(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="e.g. 4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-white text-sm focus:outline-none focus:border-pink-500 transition font-mono"
                />
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  Specify the total number of AFREQA festival editions and events this artist has headlined or performed at.
                </p>
              </div>

              <div>
                <label className="block uppercase font-mono text-zinc-400 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Pioneer of high-tempo melodic techno rhythms in Nairobi..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-white text-sm focus:outline-none focus:border-pink-500 transition"
                />
              </div>

              <div className="p-3 rounded-xl bg-afreqa-shadow border border-white/10 flex items-center gap-3">
                <input
                  id="fictional_check"
                  type="checkbox"
                  checked={isFictional}
                  onChange={(e) => setIsFictional(e.target.checked)}
                  className="rounded border-white/20 bg-black text-pink-500 accent-pink-500"
                />
                <label htmlFor="fictional_check" className="text-zinc-400 text-xs cursor-pointer">
                  Mark as sample / fictional data
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-afreqa-chrome-high/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs uppercase tracking-wider transition shadow-glow-pink disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Artist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* System Modal Popups & Notifications (Permanent DB Changes) */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        variant="danger"
        isLoading={saving}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
