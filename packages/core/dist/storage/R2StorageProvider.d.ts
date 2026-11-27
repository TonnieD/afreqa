import { Readable } from "node:stream";
import type { StorageDriverName, StorageProvider, StorageUploadResult } from "./StorageProvider.js";
export interface R2StorageConfig {
    accountId?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucket?: string;
    publicBaseUrl?: string;
}
/**
 * @experimental UNTESTED optional Cloudflare R2 adapter (S3-compatible SigV4 over fetch).
 * Kept disabled by default (`STORAGE_DRIVER` defaults to `local` or `vercel-blob`).
 * NOTE: If R2 is ever enabled for production, replace this hand-rolled SigV4 adapter
 * with the official `@aws-sdk/client-s3` SDK for full multipart/retry/signing coverage.
 */
export declare class R2StorageProvider implements StorageProvider {
    readonly driver: StorageDriverName;
    private readonly accountId;
    private readonly accessKeyId;
    private readonly secretAccessKey;
    private readonly bucket;
    private readonly publicBaseUrl;
    constructor(config?: R2StorageConfig);
    private endpointForKey;
    private signHeaders;
    upload(buffer: Buffer, key: string, mimeType?: string): Promise<StorageUploadResult>;
    delete(key: string): Promise<void>;
    getUrl(key: string): string;
    getStream(key: string): Promise<Readable>;
    exists(key: string): Promise<boolean>;
}
//# sourceMappingURL=R2StorageProvider.d.ts.map