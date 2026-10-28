/**
 * Sanitizes and masks raw personal data (emails, phone numbers, passwords) in audit payloads.
 */
export declare function sanitizeAuditPayload(data: unknown): string;
export interface RecordAuditOptions {
    userId?: string | null;
    userEmail?: string | null;
    action: string;
    resource: string;
    resourceId?: string | null;
    payload?: unknown;
    ipAddress?: string | null;
    userAgent?: string | null;
}
export declare function recordAuditLog(options: RecordAuditOptions): Promise<void>;
//# sourceMappingURL=audit.d.ts.map