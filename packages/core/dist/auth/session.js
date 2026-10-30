"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_DURATION_DAYS = exports.SESSION_COOKIE_NAME = void 0;
exports.createSession = createSession;
exports.validateSession = validateSession;
exports.invalidateSession = invalidateSession;
exports.invalidateAllUserSessions = invalidateAllUserSessions;
const crypto_1 = __importDefault(require("crypto"));
const client_js_1 = require("../db/client.js");
const logger_js_1 = require("../logger.js");
exports.SESSION_COOKIE_NAME = "afreqa_session";
exports.SESSION_DURATION_DAYS = 7;
async function createSession(userId, meta) {
    const sessionToken = crypto_1.default.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + exports.SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);
    const session = await client_js_1.db.session.create({
        data: {
            sessionToken,
            userId,
            expires,
            userAgent: meta?.userAgent || null,
            ipAddress: meta?.ipAddress || null,
        },
    });
    return session;
}
async function validateSession(sessionToken) {
    if (!sessionToken || sessionToken.length < 32) {
        return null;
    }
    const session = await client_js_1.db.session.findUnique({
        where: { sessionToken },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    mustChangePassword: true,
                    totpEnabled: true,
                    totpSecret: false,
                    passwordHash: false,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });
    if (!session) {
        return null;
    }
    const now = new Date();
    if (session.expires < now) {
        // Delete expired session
        await client_js_1.db.session.delete({ where: { id: session.id } }).catch(() => { });
        return null;
    }
    // Auto-extend session if older than 1 day
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (session.createdAt < oneDayAgo) {
        await client_js_1.db.session
            .update({
            where: { id: session.id },
            data: {
                expires: new Date(now.getTime() + exports.SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000),
            },
        })
            .catch((err) => logger_js_1.logger.warn("Could not extend session expiry", { error: String(err) }));
    }
    return {
        session,
        user: session.user,
    };
}
async function invalidateSession(sessionToken) {
    await client_js_1.db.session.delete({ where: { sessionToken } }).catch(() => { });
}
async function invalidateAllUserSessions(userId) {
    await client_js_1.db.session.deleteMany({ where: { userId } }).catch(() => { });
}
//# sourceMappingURL=session.js.map