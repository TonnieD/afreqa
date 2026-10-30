"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload, ArrowRight, Save } from "lucide-react";

interface TicketPhaseInput {
  id?: string;
  name: string;
  priceKes?: number | string | null;
  status: "UPCOMING" | "ON_SALE" | "SOLD_OUT";
  externalUrl?: string | null;
}

interface EventData {
  id?: string;
  title: string;
  slug: string;
  tagline?: string | null;
  description: string;
  posterUrl?: string | null;
  date: string;
  doorsOpen?: string | null;
  doorsClose?: string | null;
  venueName: string;
  venueAddress?: string | null;
  googleMapsUrl?: string | null;
  transportInfo?: string | null;
  agePolicy?: string | null;
  refundPolicy?: string | null;
  externalTicketUrl?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  ticketPhases?: TicketPhaseInput[];
}

export function EventForm({ initialData }: { initialData?: EventData }) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [tagline, setTagline] = useState(initialData?.tagline || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [posterUrl, setPosterUrl] = useState(initialData?.posterUrl || "");
  const [date, setDate] = useState(
    initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : ""
  );
  const [doorsOpen, setDoorsOpen] = useState(initialData?.doorsOpen || "18:00");
  const [doorsClose, setDoorsClose] = useState(initialData?.doorsClose || "06:00");
  const [venueName, setVenueName] = useState(initialData?.venueName || "");
  const [venueAddress, setVenueAddress] = useState(initialData?.venueAddress || "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(initialData?.googleMapsUrl || "");
  const [transportInfo, setTransportInfo] = useState(initialData?.transportInfo || "");
  const [agePolicy, setAgePolicy] = useState(
    initialData?.agePolicy || "Strictly 18+ with valid government ID"
  );
  const [refundPolicy, setRefundPolicy] = useState(initialData?.refundPolicy || "");
  const [externalTicketUrl, setExternalTicketUrl] = useState(
    initialData?.externalTicketUrl || "https://afreqanairobi.hustlesasa.shop/"
  );
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    initialData?.status || "DRAFT"
  );

  const [phases, setPhases] = useState<TicketPhaseInput[]>(
    initialData?.ticketPhases && initialData.ticketPhases.length > 0
      ? initialData.ticketPhases
      : [
          { name: "Early Bird", priceKes: 1500, status: "UPCOMING" },
          { name: "Phase 1", priceKes: 2000, status: "UPCOMING" },
          { name: "Final Release", priceKes: 2500, status: "UPCOMING" },
          { name: "Gate", priceKes: 3000, status: "UPCOMING" },
        ]
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
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

    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setPosterUrl(data.responsiveUrls?.medium || data.originalUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const addPhase = () => {
    setPhases([...phases, { name: "New Phase", priceKes: 2000, status: "UPCOMING" }]);
  };

  const updatePhase = (index: number, updates: Partial<TicketPhaseInput>) => {
    setPhases(phases.map((p, i) => (i === index ? { ...p, ...updates } : p)));
  };

  const removePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      title,
      slug,
      tagline,
      description,
      posterUrl,
      date: new Date(date).toISOString(),
      doorsOpen,
      doorsClose,
      venueName,
      venueAddress,
      googleMapsUrl,
      transportInfo,
      agePolicy,
      refundPolicy,
      externalTicketUrl,
      status,
      ticketPhases: phases,
    };

    try {
      const url = isEditing ? `/api/admin/events/${initialData?.id}` : "/api/admin/events";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save event");
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong saving event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Section 1: Basic Event Details */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6 space-y-4">
        <h3 className="font-bold text-base text-afreqa-chrome-high border-b border-afreqa-chrome-high/10 pb-3">
          1. Basic Event Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Afreqa: Resonance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="resonance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
            Tagline / Subtitle
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Where African Electronic Frequencies Meet Festival Fantasy"
            className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Experience an unforgettable high-energy rave under the Nairobi skyline..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              Publishing Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED (Live)</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Poster Image Uploader */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6 space-y-4">
        <h3 className="font-bold text-base text-afreqa-chrome-high border-b border-afreqa-chrome-high/10 pb-3">
          2. Official Poster Artwork (Sharp EXIF Stripping Pipeline)
        </h3>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative w-36 h-48 rounded-xl overflow-hidden bg-afreqa-shadow border border-white/10 shrink-0">
            {posterUrl ? (
              <Image src={posterUrl} alt="Poster Artwork" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-afreqa-silver-mid text-xs">
                <Upload className="w-6 h-6 mb-1 opacity-50" />
                <span>No poster</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <p className="text-xs text-afreqa-silver leading-relaxed">
              Upload a high-resolution poster (JPEG, PNG, or WebP). The server automatically strips EXIF GPS data and creates responsive, compressed derivatives.
            </p>

            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-afreqa-chrome-high text-xs font-mono font-bold cursor-pointer transition">
              <Upload className="w-4 h-4 text-afreqa-teal" />
              <span>{uploadingImage ? "Processing with sharp..." : "Choose Artwork"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>

            {posterUrl && (
              <p className="text-[11px] text-afreqa-teal font-mono truncate">
                Active Art: {posterUrl}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Date, Time & Venue */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6 space-y-4">
        <h3 className="font-bold text-base text-afreqa-chrome-high border-b border-afreqa-chrome-high/10 pb-3">
          3. Date, Schedule & Venue Coordinates
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              Event Date & Start Time *
            </label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              Doors Open
            </label>
            <input
              type="text"
              value={doorsOpen || ""}
              onChange={(e) => setDoorsOpen(e.target.value)}
              placeholder="18:00"
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              Doors Close / Curfew
            </label>
            <input
              type="text"
              value={doorsClose || ""}
              onChange={(e) => setDoorsClose(e.target.value)}
              placeholder="06:00"
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              Venue Name *
            </label>
            <input
              type="text"
              required
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="The Carnivore Grounds / Waterfront Karen"
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              Venue Physical Address
            </label>
            <input
              type="text"
              value={venueAddress || ""}
              onChange={(e) => setVenueAddress(e.target.value)}
              placeholder="Langata Road, Nairobi, Kenya"
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
            Google Maps Direct Link
          </label>
          <input
            type="url"
            value={googleMapsUrl || ""}
            onChange={(e) => setGoogleMapsUrl(e.target.value)}
            placeholder="https://maps.google.com/?q=Carnivore+Grounds"
            className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono"
          />
        </div>
      </div>

      {/* Section 4: Dynamic Ticket Phases */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-afreqa-chrome-high/10 pb-3">
          <div>
            <h3 className="font-bold text-base text-afreqa-chrome-high">
              4. Hybrid Ticket Phases (HustleSasa Synced)
            </h3>
            <p className="text-xs text-afreqa-silver-mid mt-0.5">
              Prices are NEVER hardcoded. Configure active sales tiers below.
            </p>
          </div>

          <button
            type="button"
            onClick={addPhase}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-afreqa-teal/15 text-afreqa-teal hover:bg-afreqa-teal/25 text-xs font-bold font-mono uppercase transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Phase</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
            Default HustleSasa Outbound URL
          </label>
          <input
            type="url"
            value={externalTicketUrl || ""}
            onChange={(e) => setExternalTicketUrl(e.target.value)}
            placeholder="https://afreqanairobi.hustlesasa.shop/"
            className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono mb-4"
          />
        </div>

        <div className="space-y-3">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-afreqa-shadow/90 border border-white/10 flex flex-col sm:flex-row items-center gap-3 text-xs"
            >
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={phase.name}
                  onChange={(e) => updatePhase(idx, { name: e.target.value })}
                  placeholder="Phase Name (e.g. Early Bird)"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-afreqa-chrome-high"
                />
              </div>

              <div className="w-full sm:w-32">
                <input
                  type="number"
                  value={phase.priceKes ?? ""}
                  onChange={(e) => updatePhase(idx, { priceKes: e.target.value })}
                  placeholder="Price (KES)"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-afreqa-chrome-high font-mono"
                />
              </div>

              <div className="w-full sm:w-36">
                <select
                  value={phase.status}
                  onChange={(e) =>
                    updatePhase(idx, {
                      status: e.target.value as "UPCOMING" | "ON_SALE" | "SOLD_OUT",
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-afreqa-chrome-high font-mono"
                >
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="ON_SALE">ON SALE</option>
                  <option value="SOLD_OUT">SOLD OUT</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => removePhase(idx)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 self-end sm:self-center transition"
                title="Remove phase"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-afreqa-chrome-high/10">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-afreqa-silver text-xs font-mono uppercase tracking-wider transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-afreqa-teal text-afreqa-shadow font-extrabold text-xs uppercase tracking-widest shadow-glow-teal hover:opacity-90 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? "Saving Edition..." : isEditing ? "Update Event" : "Publish Event"}</span>
        </button>
      </div>
    </form>
  );
}

