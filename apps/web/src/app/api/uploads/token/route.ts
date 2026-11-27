import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import {
  ALLOWED_PHOTO_MIME_TYPES,
  MAX_PHOTO_UPLOAD_BYTES,
  db,
  getGalleryCapStatus,
  getStorageDriverName,
  hasPermission,
  isValidTempUploadKey,
  logger,
} from "@afreqa/core";
import { getSessionUser } from "@/lib/auth";
import { assertSameOrigin } from "@/lib/csrf";

export const dynamic = "force-dynamic";

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
        error: `Gallery photo limit reached (${cap.currentCount}/${cap.maxPhotos}). Delete existing photos or increase GALLERY_MAX_PHOTOS before uploading more.`,
        cap,
      },
      { status: 409 },
    );
  }

  const driver = getStorageDriverName();
  if (driver !== "vercel-blob") {
    return NextResponse.json({
      mode: "local",
      uploadUrl: "/api/uploads/images",
      cap,
    });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Storage misconfigured: BLOB_READ_WRITE_TOKEN is missing." },
      { status: 503 },
    );
  }

  try {
    const body = (await req.json()) as HandleUploadBody;
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const cleanPath = pathname.replace(/^\/+/, "");
        if (!isValidTempUploadKey(cleanPath)) {
          throw new Error("Invalid upload key: must match temp/originals/<filename>");
        }

        // Record pending upload by exact key so cron can clean orphans without list()
        await db.pendingUpload.create({
          data: {
            key: cleanPath,
            userId: user.id,
            status: "PENDING",
          },
        });

        return {
          allowedContentTypes: [...ALLOWED_PHOTO_MIME_TYPES],
          maximumSizeInBytes: MAX_PHOTO_UPLOAD_BYTES,
          addRandomSuffix: false,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({
            userId: user.id,
          }),
        };
      },
      onUploadCompleted: async () => {
        // Not used: processing is triggered explicitly by the admin client via /api/uploads/process
        // with session + gallery:write + Origin checks.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    logger.error("Failed to issue client upload token", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to initialize upload" },
      { status: 400 },
    );
  }
}
