"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, Upload, Music, ExternalLink } from "lucide-react";

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

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingArtist(null);
    setName("");
    setSlug("");
    setBio("");
    setPosterUrl("");
    setGenresInput("Afro-Tech, Melodic House");
    setInstagramUrl("");
    setSoundcloudUrl("");
    setSpotifyUrl("");
    setIsFictional(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (artist: ArtistItem) => {
    setEditingArtist(artist);
    setName(artist.name);
    setSlug(artist.slug);
    setBio(artist.bio || "");
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

      setPosterUrl(data.responsiveUrls?.medium || data.originalUrl);
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

    const payload = {
      name,
      slug,
      bio,
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

      setModalOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, artistName: string) => {
    if (!confirm(`Are you sure you want to delete ${artistName}?`)) return;

    try {
      const res = await fetch(`/api/admin/artists/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete artist");
      setArtists(artists.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete artist.");
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-afreqa-teal text-afreqa-shadow font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-glow-teal"
        >
          <Plus className="w-4 h-4" />
          <span>Add Artist / DJ</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full bg-afreqa-shadow">
                {artist.photoUrl ? (
                  <Image src={artist.photoUrl} alt={artist.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-afreqa-silver-mid font-mono text-xs">
                    No Photo
                  </div>
                )}
                {artist.isFictional && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 border border-amber-500/40 text-amber-400 text-[10px] font-mono uppercase">
                    Sample / Placeholder
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-afreqa-chrome-high">{artist.name}</h3>
                  <span className="text-[11px] font-mono text-afreqa-silver-mid">/{artist.slug}</span>
                </div>

                {artist.bio && (
                  <p className="text-xs text-afreqa-silver line-clamp-2 leading-relaxed">
                    {artist.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {artist.genres.map((g, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-afreqa-teal"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-afreqa-chrome-high/5 flex items-center justify-between mt-4">
              <span className="text-[11px] text-afreqa-silver-mid font-mono">
                {artist.eventSlots.length} festival appearances
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(artist)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-afreqa-teal transition"
                  title="Edit artist"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(artist.id, artist.name)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                  title="Delete artist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Artist Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-crowd/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-afreqa-stage border border-afreqa-chrome-high/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-afreqa-chrome-high mb-4">
              {editingArtist ? `Edit ${editingArtist.name}` : "Add New Artist / DJ"}
            </h2>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-afreqa-silver mb-1">
                  Artist / Stage Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Sona Waves"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-afreqa-silver mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-afreqa-silver mb-1">
                  Genres (comma-separated)
                </label>
                <input
                  type="text"
                  value={genresInput}
                  onChange={(e) => setGenresInput(e.target.value)}
                  placeholder="Afro-Tech, Amapiano, Melodic Techno"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-afreqa-silver mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Pioneer of high-tempo afro-tech rhythms in Nairobi..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-afreqa-silver mb-1">
                  Press Photo (Stripped of GPS EXIF)
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-afreqa-chrome-high cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-afreqa-teal" />
                    <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {photoUrl && (
                    <span className="text-[11px] text-afreqa-teal font-mono truncate max-w-[200px]">
                      {photoUrl}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-afreqa-shadow border border-white/10 flex items-center gap-3">
                <input
                  id="fictional_check"
                  type="checkbox"
                  checked={isFictional}
                  onChange={(e) => setIsFictional(e.target.checked)}
                  className="rounded border-white/20 bg-black text-afreqa-teal"
                />
                <label htmlFor="fictional_check" className="text-afreqa-silver text-xs cursor-pointer">
                  Mark as sample / fictional data (displayed in CONTENT_TODO.md audit)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-afreqa-chrome-high/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full text-afreqa-silver hover:text-afreqa-chrome-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-afreqa-teal text-afreqa-shadow font-bold text-xs uppercase tracking-wider"
                >
                  {saving ? "Saving..." : "Save Artist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

