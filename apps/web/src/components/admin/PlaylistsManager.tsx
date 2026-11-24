"use client";

import { useState } from "react";
import { Music, Plus, Trash2, Edit2, ExternalLink, Play, Radio, Sparkles, Check, Headphones } from "lucide-react";
import type { Playlist } from "@/lib/spotify";
import { AdminConfirmModal } from "@/components/admin/AdminConfirmModal";
import { AdminToast, type ToastMessage } from "@/components/admin/AdminToast";

export function PlaylistsManager({ initialPlaylists }: { initialPlaylists: Playlist[] }) {
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [curator, setCurator] = useState("Afreqa Curators");
  const [bpm, setBpm] = useState("128 – 132 BPM");
  const [soundReferences, setSoundReferences] = useState("");
  const [fanbaseRank, setFanbaseRank] = useState("");
  const [status, setStatus] = useState<"live" | "curating">("live");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // System On-Screen Popups (Replacing native browser confirm/alert)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: async () => {},
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const openNewModal = () => {
    setEditingPlaylist(null);
    setTitle("");
    setGenre("Progressive EDM");
    setSpotifyUrl("");
    setTagline("");
    setCurator("Afreqa Mainstage Curators");
    setBpm("128 – 132 BPM");
    setSoundReferences("");
    setFanbaseRank(`#${playlists.length + 1} Sound Pillar`);
    setStatus("live");
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (pl: Playlist) => {
    setEditingPlaylist(pl);
    setTitle(pl.title);
    setGenre(pl.genre);
    setSpotifyUrl(pl.spotifyUrl);
    setTagline(pl.tagline);
    setCurator(pl.curator);
    setBpm(pl.bpm || "");
    setSoundReferences(pl.soundReferences || "");
    setFanbaseRank(pl.fanbaseRank);
    setStatus(pl.status);
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      id: editingPlaylist?.id,
      title,
      genre,
      spotifyUrl,
      tagline,
      curator,
      bpm,
      soundReferences,
      fanbaseRank,
      status,
    };

    try {
      const method = editingPlaylist ? "PUT" : "POST";
      const res = await fetch("/api/admin/playlists", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save playlist");

      if (editingPlaylist) {
        setPlaylists(playlists.map((p) => (p.id === editingPlaylist.id ? data : p)));
      } else {
        setPlaylists([...playlists, data]);
      }

      setModalOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const promptDelete = (id: string, plTitle: string) => {
    setConfirmModal({
      isOpen: true,
      title: `Remove Playlist "${plTitle}"`,
      description: `Are you sure you want to permanently remove "${plTitle}" from the AFREQA Spotify curation? This will remove the playlist from public discovery immediately.`,
      onConfirm: async () => {
        setSaving(true);
        try {
          const res = await fetch(`/api/admin/playlists?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Failed to delete playlist");
          setPlaylists((prev) => prev.filter((p) => p.id !== id));
          setToast({
            type: "success",
            message: `Playlist "${plTitle}" was successfully removed.`,
          });
        } catch {
          setToast({
            type: "error",
            message: `Failed to remove playlist "${plTitle}".`,
          });
        } finally {
          setSaving(false);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-mono text-zinc-400">
            Total Playlists Curated: <span className="text-white font-bold">{playlists.length}</span>
          </h2>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs uppercase tracking-wider transition shadow-glow-pink"
        >
          <Plus className="w-4 h-4" />
          <span>Add Spotify Playlist</span>
        </button>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playlists.map((pl, idx) => (
          <div
            key={pl.id}
            className="rounded-3xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6 flex flex-col justify-between gap-5 hover:border-pink-500/30 transition shadow-xl relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 font-bold">
                    {pl.fanbaseRank.split("•")[0]?.trim() || `Pillar #${idx + 1}`}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    {pl.genre}
                  </span>
                  {pl.status === "live" ? (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Live
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-400">Curating</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(pl)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
                    title="Edit Playlist"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => promptDelete(pl.id, pl.title)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete Playlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {pl.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {pl.tagline}
                </p>
              </div>

              {pl.soundReferences && (
                <div className="text-[11px] font-mono text-zinc-500 pt-1">
                  <span className="text-zinc-400">Artists:</span> {pl.soundReferences}
                </div>
              )}

              {/* Embedded Spotify player preview */}
              <div className="pt-2">
                <iframe
                  src={`https://open.spotify.com/embed/${pl.spotifyUri}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl shadow"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">BPM: {pl.bpm || "128 BPM"}</span>
              <a
                href={pl.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 inline-flex items-center gap-1 transition"
              >
                <span>Open Spotify</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl bg-afreqa-stage border border-afreqa-chrome-high/20 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-pink-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  {editingPlaylist ? "Edit Spotify Playlist" : "Add Spotify Playlist"}
                </h3>
              </div>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Playlist Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. PROGRESSIVE EDM (Tomorrowland Anthems)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Spotify Share Link or Embed URI *
                </label>
                <input
                  type="text"
                  required
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  placeholder="https://open.spotify.com/playlist/... or playlist/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                />
                <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                  Paste standard share URL from Spotify app or web player.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Genre / Sub-genres
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Progressive House • Mainstage"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    BPM Range
                  </label>
                  <input
                    type="text"
                    value={bpm}
                    onChange={(e) => setBpm(e.target.value)}
                    placeholder="128 – 132 BPM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Tagline & Sonic Description
                </label>
                <textarea
                  rows={2}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Describe the energy and sonic experience of this playlist..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Sound References / Key Artists
                </label>
                <input
                  type="text"
                  value={soundReferences}
                  onChange={(e) => setSoundReferences(e.target.value)}
                  placeholder="e.g. Martin Garrix, Avicii, Swedish House Mafia"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Fanbase Rank / Hierarchy
                  </label>
                  <input
                    type="text"
                    value={fanbaseRank}
                    onChange={(e) => setFanbaseRank(e.target.value)}
                    placeholder="#1 Most Played • Largest Fanbase"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "live" | "curating")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
                  >
                    <option value="live">Live on Spotify</option>
                    <option value="curating">Curating / Upcoming</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs uppercase tracking-wider transition shadow-glow-pink disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingPlaylist ? "Update Playlist" : "Save Playlist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* System Modal Popups & Notifications */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText="Remove Playlist"
        variant="danger"
        isLoading={saving}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
