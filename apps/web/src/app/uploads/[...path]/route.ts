import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: "File not specified" }, { status: 400 });
  }

  // Prevent directory traversal
  const safeRelativePath = segments
    .map((s) => s.replace(/[^a-zA-Z0-9._-]/g, ""))
    .join(path.sep);

  const baseUploadDir = path.resolve(process.env.STORAGE_UPLOAD_DIR || "./uploads");
  const filePath = path.resolve(baseUploadDir, safeRelativePath);

  // Security check: ensure path stays within baseUploadDir
  if (!filePath.startsWith(baseUploadDir)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}
