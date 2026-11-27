import { Readable } from "node:stream";
import { put, del, head } from "@vercel/blob";
import type { StorageDriverName, StorageProvider, StorageUploadResult } from "./StorageProvider.js";

export interface VercelBlobConfig {
  token?: string;
  publicBaseUrl?: string;
}

export class VercelBlobStorageProvider implements StorageProvider {
  readonly driver: StorageDriverName = "vercel-blob";
  private readonly token: string;
  private readonly publicBaseUrl: string;

  constructor(config: VercelBlobConfig = {}) {
    this.token = config.token ?? process.env.BLOB_READ_WRITE_TOKEN ?? "";
    this.publicBaseUrl = (config.publicBaseUrl ?? process.env.BLOB_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "");
    if (!this.token) {
      throw new Error("BLOB_READ_WRITE_TOKEN is required when STORAGE_DRIVER=vercel-blob");
    }
  }

  async upload(buffer: Buffer, key: string, mimeType = "application/octet-stream"): Promise<StorageUploadResult> {
    const normalizedKey = key.replace(/^\/+/, "");
    const blob = await put(normalizedKey, buffer, {
      access: "public",
      contentType: mimeType,
      token: this.token,
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return {
      key: normalizedKey,
      url: blob.url,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    const target = /^https?:\/\//i.test(key) ? key : this.getUrl(key);
    await del(target, { token: this.token });
  }

  getUrl(key: string): string {
    if (/^https?:\/\//i.test(key) || key.startsWith("/")) {
      return key;
    }
    const normalized = key.replace(/^\/+/, "");
    if (!this.publicBaseUrl) {
      throw new Error("BLOB_PUBLIC_BASE_URL is required to resolve Vercel Blob keys to URLs");
    }
    return `${this.publicBaseUrl}/${normalized}`;
  }

  async getStream(key: string): Promise<Readable> {
    const url = this.getUrl(key);
    const res = await fetch(url);
    if (!res.ok || !res.body) {
      throw new Error(`Failed to fetch blob stream for ${key}: ${res.status} ${res.statusText}`);
    }
    return Readable.fromWeb(res.body as unknown as import("node:stream/web").ReadableStream);
  }

  async exists(key: string): Promise<boolean> {
    try {
      const target = /^https?:\/\//i.test(key) ? key : this.getUrl(key);
      await head(target, { token: this.token });
      return true;
    } catch {
      return false;
    }
  }
}
