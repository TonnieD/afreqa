import { Readable } from "node:stream";

export type StorageDriverName = "local" | "vercel-blob" | "r2";

export interface StorageUploadResult {
  key: string;
  url: string;
  size: number;
  mimeType?: string;
}

export interface StorageProvider {
  readonly driver: StorageDriverName;
  upload(buffer: Buffer, key: string, mimeType?: string): Promise<StorageUploadResult>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
  getStream(key: string): Promise<Readable>;
  exists(key: string): Promise<boolean>;
}

/**
 * Resolves a stored media reference (static path, external URL, or storage key)
 * into a browser-usable URL.
 */
export function resolveMediaUrl(
  keyOrUrl: string | null | undefined,
  provider?: Pick<StorageProvider, "getUrl">,
): string {
  if (!keyOrUrl) return "";
  const trimmed = keyOrUrl.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("static:")) {
    const rest = trimmed.slice("static:".length);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }

  if (trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (provider) {
    return provider.getUrl(trimmed);
  }

  const normalized = trimmed.replace(/^\/+/, "");
  const driver = (process.env.STORAGE_DRIVER || "local").toLowerCase();
  if (driver === "vercel-blob") {
    const base = (process.env.BLOB_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
    return base ? `${base}/${normalized}` : `/${normalized}`;
  }
  if (driver === "r2") {
    const base = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
    return base ? `${base}/${normalized}` : `/${normalized}`;
  }
  const prefix = (process.env.STORAGE_PUBLIC_URL_PREFIX || "/uploads").replace(/\/+$/, "");
  return `${prefix}/${normalized}`;
}
