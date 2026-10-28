import fs from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { StorageProvider, StorageUploadResult } from "./StorageProvider.js";

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;
  private publicPrefix: string;

  constructor(baseDir?: string, publicPrefix?: string) {
    this.baseDir = path.resolve(baseDir || process.env.STORAGE_UPLOAD_DIR || "./uploads");
    this.publicPrefix = publicPrefix || process.env.STORAGE_PUBLIC_URL_PREFIX || "/uploads";
  }

  private resolveSafePath(key: string): string {
    const safeKey = key.replace(/^(\.\.(\/|\\|$))+/, "").replace(/^[/\\]+/, "");
    const resolved = path.resolve(this.baseDir, safeKey);
    if (!resolved.startsWith(this.baseDir)) {
      throw new Error(`Security Exception: Access denied outside upload directory for key: ${key}`);
    }
    return resolved;
  }

  async upload(buffer: Buffer, key: string, mimeType?: string): Promise<StorageUploadResult> {
    const targetPath = this.resolveSafePath(key);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, buffer);

    return {
      key,
      url: this.getUrl(key),
      size: buffer.length,
      mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    const targetPath = this.resolveSafePath(key);
    if (existsSync(targetPath)) {
      await fs.unlink(targetPath);
    }
  }

  getUrl(key: string): string {
    const cleanKey = key.replace(/\\/g, "/").replace(/^\/+/, "");
    const cleanPrefix = this.publicPrefix.replace(/\/+$/, "");
    return `${cleanPrefix}/${cleanKey}`;
  }

  async getStream(key: string): Promise<Readable> {
    const targetPath = this.resolveSafePath(key);
    if (!existsSync(targetPath)) {
      throw new Error(`File not found: ${key}`);
    }
    return createReadStream(targetPath);
  }

  async exists(key: string): Promise<boolean> {
    const targetPath = this.resolveSafePath(key);
    return existsSync(targetPath);
  }
}

let storageInstance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!storageInstance) {
    storageInstance = new LocalStorageProvider();
  }
  return storageInstance;
}

