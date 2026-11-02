"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Upload,
  ArrowRight,
  Save,
  Music,
  Radio,
  Clock,
  Sparkles,
  ChevronUp,
  ChevronDown,
  UserPlus,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export interface TicketPhaseInput {
  id?: string;
  name: string;
  priceKes?: number | string | null;
  status: "UPCOMING" | "ON_SALE" | "SOLD_OUT";
  externalUrl?: string | null;
}

export interface LineupSlotInput {
  id?: string;
  artistId: string;
  stageName: string;
  setStartTime: string;
  setEndTime: string;
  sortOrder?: number;
  artist?: {
    id: string;
    name: string;
    genres?: string[];
    photoUrl?: string | null;
  };
}

export interface ArtistOption {
  id: string;
  name: string;
  slug: string;
  genres: string[];
  photoUrl?: string | null;
}

export interface EventData {
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
  lineupDroppingSoon?: boolean;
  ticketPhases?: TicketPhaseInput[];
  lineup?: LineupSlotInput[];
}

export function EventForm({
  initialData,
  availableArtists: initialArtists = [],
}: {
  initialData?: EventData;
  availableArtists?: ArtistOption[];
}) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  // Form Fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [tagline, setTagline] = useState(initialData?.tagline || "");
  
  // Clean description of hidden metadata flags
  const initialCleanDescription = initialData?.description
    ? initialData.description.replace(/<!--\s*LINEUP_DROPPING_SOON\s*-->/g, "").trim()
    : "";
  const [description, setDescription] = useState(initialCleanDescription);
  const [posterUrl, setPosterUrl] = useState(initialData?.posterUrl || "");

  // Pure calendar date picker (YYYY-MM-DD)
  const initialDateStr = initialData?.date
    ? new Date(initialData.date).toISOString().slice(0, 10)
    : "";
  const [date, setDate] = useState(initialDateStr);

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
    initialData?.status || "PUBLISHED"
  );

  // Lineup Dropping Soon flag
  const [lineupDroppingSoon, setLineupDroppingSoon] = useState<boolean>(
    initialData?.lineupDroppingSoon ??
      (initialData?.description?.includes("<!-- LINEUP_DROPPING_SOON -->") || !isEditing)
  );

  // Ticket Phases
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

  // Lineup Slots
  const [lineup, setLineup] = useState<LineupSlotInput[]>(initialData?.lineup || []);

  // Available Artists state (can be expanded via inline artist creation)
  const [artists, setArtists] = useState<ArtistOption[]>(initialArtists);
  const [loadingArtists, setLoadingArtists] = useState(false);

  // Quick Inline Artist Creator Modal
  const [showNewArtistModal, setShowNewArtistModal] = useState(false);
  const [newArtistName, setNewArtistName] = useState("");
  const [newArtistGenres, setNewArtistGenres] = useState("Afro-Tech, Melodic Techno");
  const [newArtistBio, setNewArtistBio] = useState("");
  const [newArtistPhoto, setNewArtistPhoto] = useState("");
  const [creatingArtist, setCreatingArtist] = useState(false);
  const [targetSlotIndexForNewArtist, setTargetSlotIndexForNewArtist] = useState<number | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Fetch artists if not supplied through props
  useEffect(() => {
    if (artists.length === 0) {
      setLoadingArtists(true);
      fetch("/api/admin/artists")
        .then((res) => (res.ok ? res.json() : []))
        .then((data: ArtistOption[]) => {
          if (Array.isArray(data)) {
            setArtists(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingArtists(false));
    }
  }, [artists.length]);

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
      setUploadingImage(false);
    }
  };

  // Ticket phase helpers
  const addPhase = () => {
    setPhases([...phases, { name: "New Phase", priceKes: 2000, status: "UPCOMING" }]);
  };

  const updatePhase = (index: number, updates: Partial<TicketPhaseInput>) => {
    setPhases(phases.map((p, i) => (i === index ? { ...p, ...updates } : p)));
  };

  const removePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  // Lineup management helpers
  const addLineupSlot = () => {
    const defaultArtistId = artists[0]?.id || "";
    setLineup([
      ...lineup,
      {
        artistId: defaultArtistId,
        stageName: "Tomorrowland Mainstage",
        setStartTime: "22:00",
        setEndTime: "00:00",
        sortOrder: lineup.length,
      },
    ]);
  };

  const updateLineupSlot = (index: number, updates: Partial<LineupSlotInput>) => {
    setLineup(lineup.map((slot, i) => (i === index ? { ...slot, ...updates } : slot)));
  };

  const removeLineupSlot = (index: number) => {
    setLineup(lineup.filter((_, i) => i !== index));
  };

  const moveLineupSlot = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= lineup.length) return;

    const copy = [...lineup];
    const item = copy[index];
    if (!item) return;

    copy.splice(index, 1);
    copy.splice(newIndex, 0, item);

    // Reassign sortOrder
    const reordered = copy.map((slot, idx) => ({ ...slot, sortOrder: idx }));
    setLineup(reordered);
  };

  // Quick inline artist creation
  const handleCreateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtistName.trim()) return;

    setCreatingArtist(true);
    setError(null);

    const generatedSlug = newArtistName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const genresArray = newArtistGenres
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/admin/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newArtistName.trim(),
          slug: generatedSlug,
          genres: genresArray,
          bio: newArtistBio.trim() || undefined,
          photoUrl: newArtistPhoto.trim() || undefined,
          isFictional: false,
        }),
      });

      const newArtist = await res.json();
      if (!res.ok) {
        throw new Error(newArtist.error || "Failed to create artist");
      }

      // Add to available artists list
      const updatedArtists = [...artists, newArtist].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setArtists(updatedArtists);

      // If triggered from a specific slot, select this new artist immediately
      if (targetSlotIndexForNewArtist !== null) {
        updateLineupSlot(targetSlotIndexForNewArtist, {
          artistId: newArtist.id,
          artist: newArtist,
        });
      }

      setShowNewArtistModal(false);
      setNewArtistName("");
      setNewArtistBio("");
      setNewArtistPhoto("");
      setSuccessNotice(`Added artist: ${newArtist.name}`);
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating artist");
    } finally {
      setCreatingArtist(false);
      setTargetSlotIndexForNewArtist(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!date) {
      setError("Please pick an event date.");
      setSubmitting(false);
      return;
    }

    // Embed Lineup Dropping Soon marker into description cleanly
    let finalDescription = description.trim();
    if (lineupDroppingSoon) {
      finalDescription = `${finalDescription}\n\n<!-- LINEUP_DROPPING_SOON -->`;
    }

    // Construct ISO date string incorporating pure calendar date + doorsOpen
    let isoDate = "";
    try {
      const timePart =
        doorsOpen && /^\d{1,2}:\d{2}/.test(doorsOpen.trim())
          ? doorsOpen.trim().slice(0, 5)
          : "18:00";
      const [hours, mins] = timePart.split(":");
      const paddedHours = (hours || "18").padStart(2, "0");
      const paddedMins = (mins || "00").padStart(2, "0");
      isoDate = new Date(`${date}T${paddedHours}:${paddedMins}:00Z`).toISOString();
    } catch {
      isoDate = new Date(`${date}T18:00:00Z`).toISOString();
    }

    const payload = {
      title,
      slug,
      tagline,
      description: finalDescription,
      posterUrl,
      date: isoDate,
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
      lineup: lineup.map((slot, idx) => ({
        artistId: slot.artistId,
        stageName: slot.stageName || "Main Stage",
        setStartTime: slot.setStartTime,
        setEndTime: slot.setEndTime,
        sortOrder: typeof slot.sortOrder === "number" ? slot.sortOrder : idx,
      })),
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* SECTION 1: Basic Event Details & Status */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6 space-y-5">
        <h3 className="font-bold text-base text-afreqa-chrome-high border-b border-afreqa-chrome-high/10 pb-3">
          1. Basic Event Information & Status
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

        {/* Status Selector */}
        <div className="pt-2">
          <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1.5 font-bold">
            Event Publishing Lifecycle Status
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED")
            }
            className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/20 text-afreqa-chrome-high text-sm focus:outline-none focus:border-amber-400 transition font-mono font-bold"
          >
            <option value="PUBLISHED">PUBLISHED (Upcoming Live Gathering)</option>
            <option value="ARCHIVED">PASSED (Concluded Gathering / Past Chronicle)</option>
            <option value="DRAFT">DRAFT (Internal Preview Only)</option>
          </select>
          <p className="text-[11px] text-afreqa-silver-mid font-mono mt-1.5 leading-relaxed">
            {status === "PUBLISHED" &&
              "🟢 PUBLISHED: Live on the homepage spotlight and listed under Upcoming Gatherings."}
            {status === "ARCHIVED" &&
              "🟣 PASSED: Moved to 'Past Editions & Sonic Archives' with past chronicle styling."}
            {status === "DRAFT" &&
              "🟡 DRAFT: Hidden from public view. Visible only to authenticated administrators."}
          </p>
        </div>
      </div>

      {/* SECTION 2: Poster Image Artwork */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6 space-y-4">
        <h3 className="font-bold text-base text-afreqa-chrome-high border-b border-afreqa-chrome-high/10 pb-3">
          2. Official Poster Artwork (Sharp Pipeline)
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
              Upload the festival poster (JPEG, PNG, or WebP). The system automatically optimizes and creates high-fidelity derivatives.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-afreqa-chrome-high text-xs font-mono font-bold cursor-pointer transition">
                <Upload className="w-4 h-4 text-afreqa-teal" />
                <span>{uploadingImage ? "Processing artwork..." : "Upload Poster File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              {posterUrl && (
                <button
                  type="button"
                  onClick={() => setPosterUrl("")}
                  className="px-3 py-2 text-xs font-mono text-rose-400 hover:text-rose-300 transition"
                >
                  Clear Poster
                </button>
              )}
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-mono text-afreqa-silver-mid mb-1">
                Or Direct Image URL / Local Asset Path
              </label>
              <input
                type="text"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="/images/afreqa-nye-banner.jpg or https://..."
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono focus:border-afreqa-teal outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Pure Calendar Date & Operating Times (No Time in Date!) */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6 space-y-4">
        <div className="border-b border-afreqa-chrome-high/10 pb-3">
          <h3 className="font-bold text-base text-afreqa-chrome-high flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>3. Calendar Date & Operating Times</span>
          </h3>
          <p className="text-xs text-afreqa-silver-mid mt-0.5">
            Times are defined via Doors Open and Curfew — the calendar date field is pure date.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              Event Calendar Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-amber-400 transition font-mono"
            />
            <span className="text-[10px] text-afreqa-silver-mid font-mono mt-1 block">
              Day of the gathering (YYYY-MM-DD)
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              Doors Open
            </label>
            <input
              type="text"
              value={doorsOpen || ""}
              onChange={(e) => setDoorsOpen(e.target.value)}
              placeholder="18:00 (or 6:00 PM)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono"
            />
            <span className="text-[10px] text-afreqa-silver-mid font-mono mt-1 block">
              Gate opening timestamp
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              Doors Close / Curfew
            </label>
            <input
              type="text"
              value={doorsClose || ""}
              onChange={(e) => setDoorsClose(e.target.value)}
              placeholder="06:00 (or 6:00 AM)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono"
            />
            <span className="text-[10px] text-afreqa-silver-mid font-mono mt-1 block">
              Festival conclusion time
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
              Venue Name *
            </label>
            <input
              type="text"
              required
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="Parklands Road, Westlands / Alloy Bar & Lounge"
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
              placeholder="Westlands, Nairobi, Kenya"
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
            Google Maps Link
          </label>
          <input
            type="url"
            value={googleMapsUrl || ""}
            onChange={(e) => setGoogleMapsUrl(e.target.value)}
            placeholder="https://maps.google.com/?q=..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono"
          />
        </div>
      </div>

      {/* SECTION 4: Festival Lineup & "Lineup Dropping Soon" Option */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-afreqa-chrome-high/10 pb-4">
          <div>
            <h3 className="font-bold text-base text-afreqa-chrome-high flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-400" />
              <span>4. Festival Lineup & Stage Programming</span>
            </h3>
            <p className="text-xs text-afreqa-silver-mid mt-0.5">
              Add artists, assign stages, and specify set start & end times
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTargetSlotIndexForNewArtist(null);
                setShowNewArtistModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono transition border border-white/10"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>+ New Artist</span>
            </button>

            <button
              type="button"
              onClick={addLineupSlot}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-mono uppercase transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lineup Slot</span>
            </button>
          </div>
        </div>

        {/* LINEUP DROPPING SOON TOGGLE CARD */}
        <div
          onClick={() => setLineupDroppingSoon(!lineupDroppingSoon)}
          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start sm:items-center justify-between gap-4 select-none ${
            lineupDroppingSoon
              ? "bg-amber-500/10 border-amber-500/40 shadow-glow-amber"
              : "bg-black/40 border-white/10 hover:border-white/20"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-xl mt-0.5 sm:mt-0 ${
                lineupDroppingSoon
                  ? "bg-amber-500 text-black font-bold"
                  : "bg-white/5 text-zinc-400"
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Lineup Dropping Soon Mode
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    lineupDroppingSoon
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {lineupDroppingSoon ? "ENABLED" : "OFF / REVEALED"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {lineupDroppingSoon
                  ? "Active: The public page displays the animated 'Lineup Dropping Soon' teaser card. You can configure and save artist slots below without exposing them prematurely."
                  : "Revealed: The public event page will showcase the official artists, stage names, and set times configured below."}
              </p>
            </div>
          </div>

          <div
            className={`w-12 h-6 rounded-full p-1 transition-colors shrink-0 ${
              lineupDroppingSoon ? "bg-amber-500" : "bg-zinc-700"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-black transition-transform ${
                lineupDroppingSoon ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* LINEUP SLOTS LIST */}
        {lineup.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl bg-black/30 border border-white/5">
            <Radio className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">No lineup slots created yet.</p>
            <p className="text-[11px] text-zinc-500 mt-1">
              Click &quot;Add Lineup Slot&quot; to begin programming this festival edition.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lineup.map((slot, idx) => {
              const currentArtist = artists.find((a) => a.id === slot.artistId);

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-afreqa-shadow/90 border border-white/10 flex flex-col md:flex-row items-start md:items-center gap-3 text-xs"
                >
                  {/* Slot order badge */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="w-6 h-6 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center font-mono font-bold text-amber-400 text-[11px]">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveLineupSlot(idx, "up")}
                        className="text-zinc-500 hover:text-white disabled:opacity-30 p-0.5"
                        title="Move up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === lineup.length - 1}
                        onClick={() => moveLineupSlot(idx, "down")}
                        className="text-zinc-500 hover:text-white disabled:opacity-30 p-0.5"
                        title="Move down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Artist Select */}
                  <div className="flex-1 w-full min-w-[200px]">
                    <label className="block text-[10px] font-mono uppercase text-afreqa-silver-mid mb-1">
                      Artist
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={slot.artistId}
                        onChange={(e) => updateLineupSlot(idx, { artistId: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-semibold text-xs focus:border-amber-400 outline-none"
                      >
                        {artists.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} {a.genres?.length ? `(${a.genres.join(", ")})` : ""}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          setTargetSlotIndexForNewArtist(idx);
                          setShowNewArtistModal(true);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 border border-white/10 shrink-0"
                        title="Create New Artist"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stage Name */}
                  <div className="w-full md:w-56">
                    <label className="block text-[10px] font-mono uppercase text-afreqa-silver-mid mb-1">
                      Stage
                    </label>
                    <input
                      type="text"
                      value={slot.stageName}
                      onChange={(e) => updateLineupSlot(idx, { stageName: e.target.value })}
                      placeholder="e.g. Main Stage"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  {/* Set Start Time */}
                  <div className="w-full md:w-28">
                    <label className="block text-[10px] font-mono uppercase text-afreqa-silver-mid mb-1">
                      Start Time
                    </label>
                    <input
                      type="text"
                      value={slot.setStartTime}
                      onChange={(e) => updateLineupSlot(idx, { setStartTime: e.target.value })}
                      placeholder="22:00"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  {/* Set End Time */}
                  <div className="w-full md:w-28">
                    <label className="block text-[10px] font-mono uppercase text-afreqa-silver-mid mb-1">
                      End Time
                    </label>
                    <input
                      type="text"
                      value={slot.setEndTime}
                      onChange={(e) => updateLineupSlot(idx, { setEndTime: e.target.value })}
                      placeholder="00:00"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeLineupSlot(idx)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 self-end md:self-center transition mt-2 md:mt-0"
                    title="Remove slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 5: Dynamic Ticket Phases (HustleSasa Synced) */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-afreqa-chrome-high/10 pb-3">
          <div>
            <h3 className="font-bold text-base text-afreqa-chrome-high">
              5. Hybrid Ticket Phases (HustleSasa Synced)
            </h3>
            <p className="text-xs text-afreqa-silver-mid mt-0.5">
              Live inventory tiers linked to external HustleSasa ticket checkout.
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

      {/* SUBMIT BUTTON BAR */}
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
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-widest shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>
            {submitting
              ? "Saving Event..."
              : isEditing
              ? "Update Festival Edition"
              : "Publish Festival Edition"}
          </span>
        </button>
      </div>

      {/* QUICK INLINE ARTIST CREATOR MODAL */}
      {showNewArtistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#161922] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>Quick Add Artist</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowNewArtistModal(false)}
                className="text-zinc-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Artist Name *
                </label>
                <input
                  type="text"
                  required
                  value={newArtistName}
                  onChange={(e) => setNewArtistName(e.target.value)}
                  placeholder="e.g. Nayäkaze or Coco Kahi"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Genres (Comma separated)
                </label>
                <input
                  type="text"
                  value={newArtistGenres}
                  onChange={(e) => setNewArtistGenres(e.target.value)}
                  placeholder="Afro-Tech, Melodic Techno, Amapiano"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-amber-400 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Photo URL (Optional)
                </label>
                <input
                  type="text"
                  value={newArtistPhoto}
                  onChange={(e) => setNewArtistPhoto(e.target.value)}
                  placeholder="/images/artist-photo.jpg or https://..."
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-amber-400 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Short Bio (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newArtistBio}
                  onChange={(e) => setNewArtistBio(e.target.value)}
                  placeholder="Atmospheric melodies and driving percussive electronics..."
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowNewArtistModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={creatingArtist || !newArtistName.trim()}
                onClick={handleCreateArtist}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase font-mono tracking-wider disabled:opacity-50 transition"
              >
                {creatingArtist ? "Creating..." : "Save & Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
