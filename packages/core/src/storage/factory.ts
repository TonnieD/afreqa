import { LocalStorageProvider } from "./LocalStorageProvider.js";
import { R2StorageProvider } from "./R2StorageProvider.js";
import type { StorageDriverName, StorageProvider } from "./StorageProvider.js";
import { VercelBlobStorageProvider } from "./VercelBlobStorageProvider.js";

export function getStorageDriverName(env: NodeJS.ProcessEnv = process.env): StorageDriverName {
  const raw = (env.STORAGE_DRIVER || "local").trim().toLowerCase();
  if (raw === "vercel-blob" || raw === "r2" || raw === "local") {
    return raw;
  }
  throw new Error(`Unsupported STORAGE_DRIVER="${raw}". Expected "local", "vercel-blob", or "r2".`);
}

let cachedProvider: StorageProvider | null = null;
let cachedDriverKey: string | null = null;

export function getStorageProvider(): StorageProvider {
  const driver = getStorageDriverName();
  const cacheKey = `${driver}:${process.env.STORAGE_UPLOAD_DIR || ""}:${process.env.BLOB_PUBLIC_BASE_URL || ""}:${process.env.R2_BUCKET || ""}`;
  if (cachedProvider && cachedDriverKey === cacheKey) {
    return cachedProvider;
  }

  if (driver === "vercel-blob") {
    cachedProvider = new VercelBlobStorageProvider();
  } else if (driver === "r2") {
    cachedProvider = new R2StorageProvider();
  } else {
    cachedProvider = new LocalStorageProvider();
  }

  cachedDriverKey = cacheKey;
  return cachedProvider;
}
