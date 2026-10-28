import { StorageProvider } from "../storage/StorageProvider.js";
import { getStorageProvider } from "../storage/LocalStorageProvider.js";

export interface ProcessedPhotoResult {
  width: number;
  height: number;
  format: string;
  blurDataUrl: string;
  originalKey: string;
  originalUrl: string;
  responsiveUrls: {
    thumb: string;
    medium: string;
    full: string;
  };
}

export async function processPhoto(
  buffer: Buffer,
  slugPrefix: string,
  storage: StorageProvider = getStorageProvider(),
): Promise<ProcessedPhotoResult> {
  const sharpModule = await import("sharp");
  const sharp = sharpModule.default;

  // 1. Inspect metadata
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Invalid or unreadable image format.");
  }

  const timestamp = Date.now();
  const safeSlug = slugPrefix.toLowerCase().replace(/[^a-z0-9_-]/g, "-");

  // 2. Generate Base64 Low Quality Image Placeholder (LQIP, 16px wide, stripped of metadata)
  const lqipBuffer = await sharp(buffer)
    .rotate() // Strips EXIF and applies auto-orientation
    .resize(16, null, { withoutEnlargement: true })
    .webp({ quality: 20 })
    .toBuffer();
  const blurDataUrl = `data:image/webp;base64,${lqipBuffer.toString("base64")}`;

  // 3. Process Responsive Renditions (WebP, EXIF GPS stripped)
  // Thumbnail (400w)
  const thumbBuffer = await sharp(buffer)
    .rotate()
    .resize(400, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const thumbKey = `photos/${safeSlug}-${timestamp}-thumb.webp`;
  const thumbUpload = await storage.upload(thumbBuffer, thumbKey, "image/webp");

  // Medium (1200w)
  const mediumBuffer = await sharp(buffer)
    .rotate()
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
  const mediumKey = `photos/${safeSlug}-${timestamp}-medium.webp`;
  const mediumUpload = await storage.upload(mediumBuffer, mediumKey, "image/webp");

  // Full HD (2400w)
  const fullBuffer = await sharp(buffer)
    .rotate()
    .resize(2400, null, { withoutEnlargement: true })
    .webp({ quality: 90 })
    .toBuffer();
  const fullKey = `photos/${safeSlug}-${timestamp}-full.webp`;
  const fullUpload = await storage.upload(fullBuffer, fullKey, "image/webp");

  // Also save the sanitized full original
  const originalKey = `photos/${safeSlug}-${timestamp}-original.webp`;
  const originalUpload = await storage.upload(fullBuffer, originalKey, "image/webp");

  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format || "webp",
    blurDataUrl,
    originalKey,
    originalUrl: originalUpload.url,
    responsiveUrls: {
      thumb: thumbUpload.url,
      medium: mediumUpload.url,
      full: fullUpload.url,
    },
  };
}
