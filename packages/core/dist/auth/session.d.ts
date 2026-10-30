import type { Session, Role } from "@prisma/client";
export declare const SESSION_COOKIE_NAME = "afreqa_session";
export declare const SESSION_DURATION_DAYS = 7;
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: Role;
    mustChangePassword: boolean;
    totpEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare function createSession(userId: string, meta?: {
    userAgent?: string | null;
    ipAddress?: string | null;
}): Promise<Session>;
export declare function validateSession(sessionToken: string): Promise<{
    session: Session;
    user: AuthUser;
} | null>;
export declare function invalidateSession(sessionToken: string): Promise<void>;
export declare function invalidateAllUserSessions(userId: string): Promise<void>;
//# sourceMappingURL=session.d.ts.map