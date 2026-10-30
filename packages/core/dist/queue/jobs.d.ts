export declare const QUEUE_NAMES: {
    readonly EMAIL_VERIFICATION: "email:verification";
    readonly EMAIL_WELCOME: "email:welcome";
    readonly EMAIL_CAMPAIGN: "email:campaign";
    readonly CLEANUP_HOURLY: "cleanup:hourly";
};
export interface VerificationEmailPayload {
    subscriberId: string;
    email: string;
    firstName?: string | null;
    verifyUrl: string;
    tokenExpiresHours?: number;
}
export interface WelcomeEmailPayload {
    subscriberId: string;
    email: string;
    firstName?: string | null;
    whatsappCommunityUrl?: string;
    vcardUrl?: string;
}
export interface CampaignEmailPayload {
    campaignId: string;
    subscriberId: string;
    email: string;
    subject: string;
    html: string;
}
/**
 * Enqueue a verification email with 3 automatic retries and exponential backoff
 */
export declare function enqueueVerificationEmail(payload: VerificationEmailPayload): Promise<string | null>;
/**
 * Enqueue a welcome email with 3 automatic retries and exponential backoff
 */
export declare function enqueueWelcomeEmail(payload: WelcomeEmailPayload): Promise<string | null>;
/**
 * Enqueue a batch of campaign emails
 */
export declare function enqueueCampaignEmail(payload: CampaignEmailPayload): Promise<string | null>;
//# sourceMappingURL=jobs.d.ts.map