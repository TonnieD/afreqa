import { describe, it, expect } from "vitest";
import { Readable } from "node:stream";
import sharp from "sharp";
import {
  LocalStorageProvider,
  R2StorageProvider,
  VercelBlobStorageProvider,
  getGalleryCapStatus,
  getGalleryMaxPhotos,
  getStorageDriverName,
  isValidTempUploadKey,
  processPhoto,
  resolveMediaUrl,
  type StorageProvider,
  type StorageUploadResult,
} from "../index.js";

class MockStorageProvider implements StorageProvider {
  readonly driver = "vercel-blob" as const;
  readonly store = new Map<string, { buffer: Buffer; mimeType: string }>();
  failOnKeyPattern?: string;

  async upload(
    buffer: Buffer,
    key: string,
    mimeType = "application/octet-stream",
  ): Promise<StorageUploadResult> {
    if (this.failOnKeyPattern && key.includes(this.failOnKeyPattern)) {
      throw new Error(`Simulated upload failure for ${key}`);
    }
    this.store.set(key, { buffer, mimeType });
    return {
      key,
      url: this.getUrl(key),
      size: buffer.length,
      mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  getUrl(key: string): string {
    return `https://mock.public.blob.vercel-storage.com/${key.replace(/^\/+/, "")}`;
  }

  async getStream(key: string): Promise<Readable> {
    const item = this.store.get(key);
    if (!item) throw new Error(`Missing key: ${key}`);
    return Readable.from(item.buffer);
  }

  async exists(key: string): Promise<boolean> {
    return this.store.has(key);
  }
}

describe("StorageProvider & Photo Pipeline", () => {
  it("processPhoto stores only 3 WebP variants (no original) and returns keys + URLs", async () => {
    const storage = new MockStorageProvider();
    const sampleJpg = await sharp({
      create: { width: 64, height: 64, channels: 3, background: { r: 235, g: 37, b: 144 } },
    })
      .jpeg()
      .toBuffer();

    const res = await processPhoto(sampleJpg, "test-slug", storage);

    expect(res.thumbKey).toBe("photos/test-slug-400w.webp");
    expect(res.mediumKey).toBe("photos/test-slug-1200w.webp");
    expect(res.fullKey).toBe("photos/test-slug-2400w.webp");
    expect(res.blurDataUrl.startsWith("data:image/webp;base64,")).toBe(true);
    expect(storage.store.size).toBe(3);
    expect(storage.store.has("photos/test-slug-original.webp")).toBe(false);
  });

  it("processPhoto cleans up partial uploads if one variant upload fails", async () => {
    const storage = new MockStorageProvider();
    storage.failOnKeyPattern = "2400w";
    const sampleJpg = await sharp({
      create: { width: 32, height: 32, channels: 3, background: { r: 10, g: 20, b: 30 } },
    })
      .jpeg()
      .toBuffer();

    await expect(processPhoto(sampleJpg, "fail-slug", storage)).rejects.toThrow(
      /Simulated upload failure/,
    );
    expect(storage.store.size).toBe(0);
  });

  it("resolveMediaUrl handles static paths, external URLs, and driver keys", () => {
    const mock = new MockStorageProvider();

    expect(resolveMediaUrl("static:/images/afreqa-live-crowd.jpg", mock)).toBe(
      "/images/afreqa-live-crowd.jpg",
    );
    expect(resolveMediaUrl("/images/hero.jpg", mock)).toBe("/images/hero.jpg");
    expect(resolveMediaUrl("https://cdn.example.com/a.webp", mock)).toBe(
      "https://cdn.example.com/a.webp",
    );
    expect(resolveMediaUrl("photos/abc-1200w.webp", mock)).toBe(
      "https://mock.public.blob.vercel-storage.com/photos/abc-1200w.webp",
    );

    const local = new LocalStorageProvider("./uploads", "/uploads");
    expect(resolveMediaUrl("photos/abc-1200w.webp", local)).toBe("/uploads/photos/abc-1200w.webp");
  });

  it("getGalleryCapStatus computes normal, warning (>=80%), and blocked (>=100%) states", () => {
    expect(getGalleryMaxPhotos({ GALLERY_MAX_PHOTOS: "100" })).toBe(100);
    expect(getGalleryMaxPhotos({})).toBe(100);

    const normal = getGalleryCapStatus(50, 100);
    expect(normal.isNearCap).toBe(false);
    expect(normal.isAtCap).toBe(false);

    const warning = getGalleryCapStatus(80, 100);
    expect(warning.isNearCap).toBe(true);
    expect(warning.isAtCap).toBe(false);

    const blocked = getGalleryCapStatus(100, 100);
    expect(blocked.isNearCap).toBe(false);
    expect(blocked.isAtCap).toBe(true);
  });

  it("storage driver selection and provider config validation fail clearly when misconfigured", () => {
    expect(getStorageDriverName({})).toBe("local");
    expect(getStorageDriverName({ STORAGE_DRIVER: "vercel-blob" })).toBe("vercel-blob");
    expect(getStorageDriverName({ STORAGE_DRIVER: "r2" })).toBe("r2");
    expect(() => getStorageDriverName({ STORAGE_DRIVER: "s3" })).toThrow(
      /Unsupported STORAGE_DRIVER/,
    );

    expect(() => new VercelBlobStorageProvider({ token: "" })).toThrow(/BLOB_READ_WRITE_TOKEN/);
    expect(() => new R2StorageProvider({ accountId: "" })).toThrow(/R2_ACCOUNT_ID/);
  });

  it("isValidTempUploadKey accepts only temp/originals/<filename> without traversal", () => {
    expect(isValidTempUploadKey("temp/originals/179577-uuid-photo.jpg")).toBe(true);
    expect(isValidTempUploadKey("temp/originals/../secret.jpg")).toBe(false);
    expect(isValidTempUploadKey("photos/abc.jpg")).toBe(false);
    expect(isValidTempUploadKey("https://example.com/temp/originals/a.jpg")).toBe(false);
  });
});
