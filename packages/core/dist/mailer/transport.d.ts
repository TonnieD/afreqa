import nodemailer from "nodemailer";
export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
}
export declare const mailTransporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo, import("nodemailer/lib/smtp-transport/index.js").Options>;
export declare function sendEmail(options: SendEmailOptions): Promise<{
    messageId?: string;
    accepted?: string[];
}>;
//# sourceMappingURL=transport.d.ts.map