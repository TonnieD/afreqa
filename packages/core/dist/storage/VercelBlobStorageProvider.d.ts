import { Readable } from "node:stream";
import type { StorageDriverName, StorageProvider, StorageUploadResult } from "./StorageProvider.js";
export interface VercelBlobConfig {
    token?: string;
    publicBaseUrl?: string;
}
export declare class VercelBlobStorageProvider implements StorageProvider {
    readonly driver: StorageDriverName;
    private readonly token;
    private readonly publicBaseUrl;
    constructor(config?: VercelBlobConfig);
    upload(buffer: Buffer, key: string, mimeType?: string): Promise<StorageUploadResult>;
    delete(key: string): Promise<void>;
    getUrl(key: string): string;
    getStream(key: string): Promise<Readable>;
    exists(key: string): Promise<boolean>;
}
//# sourceMappingURL=VercelBlobStorageProvider.d.ts.map