"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { AlertTriangle, CheckCircle2, ImagePlus, Loader2, Upload } from "lucide-react";

interface AlbumOption {
  id: string;
  title: string;
}

interface RecentPhoto {
  id: string;
  filename: string;
  thumbUrl: string;
  caption: string | null;
}

interface CapStatus {
  currentCount: number;
  maxPhotos: number;
  ratio: number;
  isNearCap: boolean;
  isAtCap: boolean;
}

interface GalleryUploaderProps {
  initialCap: CapStatus;
  driver: "local" | "vercel-blob" | "r2";
  albums: AlbumOption[];
  initialPhotos: RecentPhoto[];
}

export function GalleryUploader({
  initialCap,
  driver,
  albums,
  initialPhotos,
}: GalleryUploaderProps) {
  const [cap, setCap] = useState<CapStatus>(initialCap);
  const [photos, setPhotos] = useState<RecentPhoto[]>(initialPhotos);
  const [albumId, setAlbumId] = useState<string>(albums[0]?.id || "");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setStatusMsg(null);

    if (cap.isAtCap) {
      setErrorMsg(
        `Gallery cap reached (${cap.currentCount}/${cap.maxPhotos}). Delete existing photos or raise GALLERY_MAX_PHOTOS.`,
      );
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("File exceeds the 15 MB maximum upload size.");
      return;
    }

    setUploading(true);
    try {
      let data: {
        asset?: { id: string; filename: string; thumbUrl: string };
        cap?: CapStatus;
        error?: string;
      };

      if (driver === "vercel-blob") {
        setStatusMsg("Uploading original directly to Vercel Blob...");
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const uniqueId =
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2, 10);
        const key = `temp/originals/${Date.now()}-${uniqueId}-${safeName}`;
        const blob = await upload(key, file, {
          access: "public",
          handleUploadUrl: "/api/uploads/token",
          multipart: false,
        });

        setStatusMsg("Generating WebP variants & LQIP...");
        const processRes = await fetch("/api/uploads/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: blob.pathname.replace(/^\/+/, ""),
            filename: file.name,
            mimeType: file.type,
            albumId: albumId || null,
            caption: caption.trim() || null,
          }),
        });
        data = await processRes.json();
        if (!processRes.ok) {
          throw new Error(data.error || "Failed to process uploaded photo");
        }
      } else {
        setStatusMsg("Uploading & generating WebP variants...");
        const formData = new FormData();
        formData.append("file", file);
        if (albumId) formData.append("albumId", albumId);
        if (caption.trim()) formData.append("caption", caption.trim());

        const res = await fetch("/api/uploads/images", {
          method: "POST",
          body: formData,
        });
        data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to upload photo");
        }
      }

      if (data.cap) {
        setCap(data.cap);
      }
      if (data.asset) {
        setPhotos((prev) => [
          {
            id: data.asset!.id,
            filename: data.asset!.filename,
            thumbUrl: data.asset!.thumbUrl,
            caption: caption.trim() || null,
          },
          ...prev,
        ]);
      }
      setCaption("");
      setStatusMsg(`Uploaded ${file.name} (3 WebP variants created).`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
      setStatusMsg(null);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const pct = Math.min(100, Math.round(cap.ratio * 100));

  return (
    <div className="space-y-6">
      {/* Cap Status Banner */}
      <div className="p-5 rounded-xl bg-afreqa-void border border-afreqa-chrome-high/10 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-afreqa-chrome-high">
            Gallery Photo Quota ({driver})
          </span>
          <span className="font-mono text-afreqa-silver-mid">
            {cap.currentCount} / {cap.maxPhotos} photos ({pct}%)
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full transition-all ${
              cap.isAtCap
                ? "bg-red-500"
                : cap.isNearCap
                  ? "bg-amber-400"
                  : "bg-afreqa-teal"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {cap.isNearCap && (
          <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Approaching demo photo limit ({cap.currentCount}/{cap.maxPhotos}). Consider pruning unused photos before hitting the cap.
            </span>
          </div>
        )}
        {cap.isAtCap && (
          <div className="flex items-center gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Gallery cap reached ({cap.currentCount}/{cap.maxPhotos}). Uploads are blocked until photos are removed or GALLERY_MAX_PHOTOS is increased.
            </span>
          </div>
        )}
      </div>

      {/* Single-Photo Upload Form */}
      <div className="p-6 rounded-xl bg-afreqa-void border border-afreqa-chrome-high/10 space-y-4">
        <div className="flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-afreqa-teal" />
          <h2 className="font-display font-bold text-lg text-afreqa-chrome-high">
            Upload Photo (1 per request, max 15 MB)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-afreqa-silver-mid mb-1.5">
              Target Album
            </label>
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              disabled={uploading || cap.isAtCap}
              className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-sm text-white"
            >
              <option value="">Unassigned</option>
              {albums.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-afreqa-silver-mid mb-1.5">
              Caption (optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Main stage crowd at midnight"
              disabled={uploading || cap.isAtCap}
              maxLength={300}
              className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-sm text-white"
            />
          </div>
        </div>

        <label
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed text-sm font-medium transition ${
            uploading || cap.isAtCap
              ? "border-white/10 text-zinc-500 cursor-not-allowed bg-black/20"
              : "border-afreqa-teal/50 text-afreqa-teal hover:bg-afreqa-teal/10 cursor-pointer"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{statusMsg || "Processing..."}</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Select JPEG, PNG, WebP, or AVIF photo</span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            disabled={uploading || cap.isAtCap}
            className="hidden"
          />
        </label>

        {!uploading && statusMsg && (
          <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Recent Photos Preview */}
      {photos.length > 0 && (
        <div className="p-6 rounded-xl bg-afreqa-void border border-afreqa-chrome-high/10 space-y-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-afreqa-silver-mid">
            Recent Uploaded Photos ({photos.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {photos.map((p) => (
              <div
                key={p.id}
                className="rounded-lg overflow-hidden bg-black/50 border border-white/10"
              >
                <img
                  src={p.thumbUrl}
                  alt={p.caption || p.filename}
                  className="w-full aspect-square object-cover"
                />
                <p className="p-1.5 text-[10px] font-mono text-zinc-400 truncate">
                  {p.caption || p.filename}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
