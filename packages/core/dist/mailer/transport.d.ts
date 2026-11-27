import nodemailer from "nodemailer";
export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
}
/**
 * Checks whether a recipient address is permitted by the optional EMAIL_ALLOWLIST env var.
 * If EMAIL_ALLOWLIST is unset or empty, all valid recipients are allowed.
 */
export declare function isEmailAllowed(to: string, allowlistEnv?: string | undefined): boolean;
export declare const mailTransporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo, import("nodemailer/lib/smtp-transport/index.js").Options>;
export declare function sendEmail(options: SendEmailOptions): Promise<{
    messageId?: string;
    accepted?: string[];
    skippedAllowlist?: boolean;
}>;
//# sourceMappingURL=transport.d.ts.map