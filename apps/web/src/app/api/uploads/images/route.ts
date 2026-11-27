import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  ALLOWED_PHOTO_MIME_TYPES,
  MAX_PHOTO_UPLOAD_BYTES,
  db,
  getGalleryCapStatus,
  getStorageProvider,
  hasPermission,
  logger,
  processPhoto,
  resolveMediaUrl,
} from "@afreqa/core";
import { getSessionUser } from "@/lib/auth";
import { assertSameOrigin } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;

  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasPermission(user.role, "gallery:write")) {
    return NextResponse.json({ error: "Forbidden: gallery:write permission required" }, { status: 403 });
  }

  const currentCount = await db.mediaAsset.count({ where: { type: "PHOTO" } });
  const cap = getGalleryCapStatus(currentCount);
  if (cap.isAtCap) {
    return NextResponse.json(
      {
        error: `Gallery photo limit reached (${cap.currentCount}/${cap.maxPhotos}).`,
        cap,
      },
      { status: 409 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const albumId = (formData.get("albumId") as string | null) || null;
    const caption = (formData.get("caption") as string | null) || null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!ALLOWED_PHOTO_MIME_TYPES.includes(file.type as (typeof ALLOWED_PHOTO_MIME_TYPES)[number])) {
      return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
    }

    if (file.size > MAX_PHOTO_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Image exceeds 15 MB limit" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 48) || "photo";
    const slugPrefix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${baseName}`;

    const storage = getStorageProvider();
    const processed = await processPhoto(buffer, slugPrefix, storage);

    const asset = await db.mediaAsset.create({
      data: {
        albumId,
        type: "PHOTO",
        status: "READY",
        filename: file.name,
        originalUrl: processed.fullKey,
        responsiveUrls: {
          thumb: processed.thumbKey,
          medium: processed.mediumKey,
          full: processed.fullKey,
        },
        blurHash: processed.blurDataUrl,
        width: processed.width,
        height: processed.height,
        mimeType: "image/webp",
        caption,
      },
    });

    return NextResponse.json(
      {
        success: true,
        asset: {
          id: asset.id,
          filename: asset.filename,
          width: asset.width,
          height: asset.height,
          blurHash: asset.blurHash,
          thumbUrl: resolveMediaUrl(processed.thumbKey, storage),
          mediumUrl: resolveMediaUrl(processed.mediumKey, storage),
          fullUrl: resolveMediaUrl(processed.fullKey, storage),
        },
        cap: getGalleryCapStatus(currentCount + 1),
      },
      { status: 201 },
    );
  } catch (err) {
    logger.error("Image processing upload error", err);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
