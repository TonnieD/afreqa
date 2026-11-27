export declare function isVideoUploadEnabled(): boolean;
/**
 * Checks if target directory has at least 3x the required file size in available disk space.
 */
export declare function checkDiskSpaceForUpload(uploadSizeBytes: number): Promise<{
    allowed: boolean;
    availableBytes: number;
    requiredBytes: number;
}>;
/**
 * Prunes abandoned Tus uploads older than maxAgeHours (default: 24h).
 */
export declare function cleanAbandonedTusUploads(maxAgeHours?: number): Promise<number>;
//# sourceMappingURL=tus.d.ts.map