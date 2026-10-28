import { NextRequest, NextResponse } from "next/server";
import { processPhoto, logger } from "@afreqa/core";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const prefix = (formData.get("prefix") as string) || "upload";

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type. Only JPEG, PNG, WebP, and AVIF are allowed." },
        { status: 415 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image file exceeds maximum allowable size of 15 MB." },
        { status: 413 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Run through sharp pipeline (strips EXIF GPS, produces responsive sizes + LQIP blur)
    const result = await processPhoto(buffer, prefix);

    logger.info("Successfully processed and stored image asset", {
      originalKey: result.originalKey,
      width: result.width,
      height: result.height,
    });

    return NextResponse.json({
      success: true,
      asset: result,
    });
  } catch (err) {
    logger.error("Failed to process uploaded image", err);
    return NextResponse.json(
      { error: "An error occurred while processing the image file." },
      { status: 500 },
    );
  }
}

