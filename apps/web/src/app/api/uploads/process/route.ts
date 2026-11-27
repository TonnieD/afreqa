import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  ALLOWED_PHOTO_MIME_TYPES,
  MAX_PHOTO_UPLOAD_BYTES,
  db,
  getGalleryCapStatus,
  getStorageProvider,
  hasPermission,
  isValidTempUploadKey,
  logger,
  processPhoto,
  resolveMediaUrl,
  z,
} from "@afreqa/core";
import { getSessionUser } from "@/lib/auth";
import { assertSameOrigin } from "@/lib/csrf";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const processSchema = z.object({
  key: z.string().min(1).max(300),
  filename: z.string().min(1).max(200),
  mimeType: z.string().optional(),
  albumId: z.string().optional().nullable(),
  caption: z.string().max(300).optional().nullable(),
});

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

  let parsedBody: z.infer<typeof processSchema>;
  try {
    const json = await req.json();
    const res = processSchema.safeParse(json);
    if (!res.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: res.error.flatten() },
        { status: 400 },
      );
    }
    parsedBody = res.data;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const key = parsedBody.key.replace(/^\/+/, "");
  if (!isValidTempUploadKey(key)) {
    return NextResponse.json(
      { error: "Invalid storage key: must match temp/originals/<filename>" },
      { status: 400 },
    );
  }

  if (
    parsedBody.mimeType &&
    !ALLOWED_PHOTO_MIME_TYPES.includes(parsedBody.mimeType as (typeof ALLOWED_PHOTO_MIME_TYPES)[number])
  ) {
    return NextResponse.json(
      { error: `Unsupported image type "${parsedBody.mimeType}". Allowed: JPEG, PNG, WebP, AVIF.` },
      { status: 400 },
    );
  }

  const storage = getStorageProvider();
  const slugPrefix = crypto.createHash("sha256").update(key).digest("hex").slice(0, 16);
  const expectedFullKey = `photos/${slugPrefix}-2400w.webp`;

  // Idempotency check: if already processed for this key, return the existing MediaAsset
  const existingAsset = await db.mediaAsset.findFirst({
    where: { originalUrl: expectedFullKey, type: "PHOTO" },
  });
  if (existingAsset) {
    await db.pendingUpload.deleteMany({ where: { key } }).catch(() => {});
    const resp = existingAsset.responsiveUrls as { thumb?: string; medium?: string; full?: string } | null;
    const currentCount = await db.mediaAsset.count({ where: { type: "PHOTO" } });
    return NextResponse.json(
      {
        success: true,
        idempotent: true,
        asset: {
          id: existingAsset.id,
          filename: existingAsset.filename,
          width: existingAsset.width,
          height: existingAsset.height,
          blurHash: existingAsset.blurHash,
          thumbUrl: resolveMediaUrl(resp?.thumb || existingAsset.originalUrl, storage),
          mediumUrl: resolveMediaUrl(resp?.medium || existingAsset.originalUrl, storage),
          fullUrl: resolveMediaUrl(resp?.full || existingAsset.originalUrl, storage),
        },
        cap: getGalleryCapStatus(currentCount),
      },
      { status: 200 },
    );
  }

  const pending = await db.pendingUpload.findUnique({ where: { key } });
  if (!pending || pending.userId !== user.id) {
    return NextResponse.json(
      { error: "Pending upload not found for this user" },
      { status: 404 },
    );
  }

  const claimed = await db.pendingUpload.updateMany({
    where: { id: pending.id, status: "PENDING" },
    data: { status: "PROCESSING" },
  });
  if (claimed.count === 0) {
    return NextResponse.json(
      { error: "Upload is already being processed" },
      { status: 409 },
    );
  }

  const cleanupTempBlob = async () => {
    try {
      await storage.delete(key);
    } catch (cleanupErr) {
      logger.warn("Failed to delete temporary original blob", {
        key,
        error: String(cleanupErr),
      });
    }
  };

  const currentCount = await db.mediaAsset.count({ where: { type: "PHOTO" } });
  const cap = getGalleryCapStatus(currentCount);
  if (cap.isAtCap) {
    await cleanupTempBlob();
    await db.pendingUpload.delete({ where: { id: pending.id } }).catch(() => {});
    return NextResponse.json(
      {
        error: `Gallery photo limit reached (${cap.currentCount}/${cap.maxPhotos}).`,
        cap,
      },
      { status: 409 },
    );
  }

  try {
    const stream = await storage.getStream(key);
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    for await (const chunk of stream) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buf.length;
      if (totalBytes > MAX_PHOTO_UPLOAD_BYTES) {
        throw new Error("Uploaded file exceeds the 15 MB limit.");
      }
      chunks.push(buf);
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length === 0) {
      await cleanupTempBlob();
      await db.pendingUpload.delete({ where: { id: pending.id } }).catch(() => {});
      return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
    }

    const processed = await processPhoto(buffer, slugPrefix, storage);

    const asset = await db.mediaAsset.create({
      data: {
        albumId: parsedBody.albumId || null,
        type: "PHOTO",
        status: "READY",
        filename: parsedBody.filename,
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
        caption: parsedBody.caption || null,
      },
    });

    await db.pendingUpload.delete({ where: { id: pending.id } }).catch(() => {});
    await cleanupTempBlob();

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
    logger.error("Failed to process uploaded photo", err);
    await db.pendingUpload
      .update({ where: { id: pending.id }, data: { status: "PENDING" } })
      .catch(() => {});
    return NextResponse.json(
      { error: "Failed to process image. Please verify the file is a valid image." },
      { status: 500 },
    );
  }
}
