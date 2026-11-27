"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_readline_1 = __importDefault(require("node:readline"));
const client_1 = require("@prisma/client");
const password_js_1 = require("../auth/password.js");
const audit_js_1 = require("../auth/audit.js");
const MIN_PASSWORD_LENGTH = 12;
function getArg(flag) {
    const prefix = `--${flag}=`;
    const found = process.argv.find((a) => a.startsWith(prefix));
    if (found)
        return found.slice(prefix.length);
    const idx = process.argv.indexOf(`--${flag}`);
    if (idx !== -1 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith("--")) {
        return process.argv[idx + 1];
    }
    return undefined;
}
function hasFlag(flag) {
    return process.argv.includes(`--${flag}`);
}
function promptLine(question, silent = false) {
    return new Promise((resolve) => {
        const rl = node_readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: Boolean(process.stdin.isTTY),
        });
        if (silent && process.stdin.isTTY) {
            // Mask echoed characters while typing password
            const origWrite = rl._writeToOutput;
            rl._writeToOutput = (str) => {
                if (str.includes(question)) {
                    process.stdout.write(question);
                }
            };
            rl.question(question, (answer) => {
                if (origWrite) {
                    rl._writeToOutput = origWrite;
                }
                process.stdout.write("\n");
                rl.close();
                resolve(answer);
            });
        }
        else {
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer);
            });
        }
    });
}
async function main() {
    const rawEmail = getArg("email") || process.env.ADMIN_EMAIL || (await promptLine("Admin email: "));
    const email = rawEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) {
        console.error("Error: A valid admin email address is required.");
        process.exit(1);
    }
    const password = getArg("password") ||
        process.env.ADMIN_PASSWORD ||
        (await promptLine(`Admin password (min ${MIN_PASSWORD_LENGTH} chars): `, true));
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
        console.error(`Error: Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
        process.exit(1);
    }
    const name = (getArg("name") || process.env.ADMIN_NAME || "Afreqa Administrator").trim();
    const roleInput = (getArg("role") || "SUPER_ADMIN").toUpperCase();
    const validRoles = [client_1.Role.SUPER_ADMIN, client_1.Role.ADMIN, client_1.Role.EDITOR, client_1.Role.SUPPORT];
    const role = validRoles.includes(roleInput) ? roleInput : client_1.Role.SUPER_ADMIN;
    const resetPassword = hasFlag("reset-password");
    const mustChangePassword = !hasFlag("no-must-change-password");
    // Prefer DIRECT_URL when running administrative CLI against Neon
    const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_OWNER_URL || process.env.DATABASE_URL;
    const prisma = new client_1.PrismaClient(dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined);
    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing && !resetPassword) {
            console.error(`Refusing to modify existing user "${email}". Pass --reset-password to update credentials.`);
            process.exit(1);
        }
        const passwordHash = await (0, password_js_1.hashPassword)(password);
        if (existing && resetPassword) {
            const updated = await prisma.user.update({
                where: { id: existing.id },
                data: {
                    passwordHash,
                    mustChangePassword,
                },
            });
            await prisma.session.deleteMany({ where: { userId: existing.id } });
            await (0, audit_js_1.recordAuditLog)({
                userId: updated.id,
                userEmail: updated.email,
                action: "ADMIN_CLI_RESET_PASSWORD",
                resource: "User",
                resourceId: updated.id,
                payload: { role: updated.role, mustChangePassword },
            });
            console.log(`✅ Reset password for ${updated.email} (role: ${updated.role}, mustChangePassword: ${mustChangePassword}).`);
        }
        else {
            const created = await prisma.user.create({
                data: {
                    email,
                    name,
                    passwordHash,
                    role,
                    mustChangePassword,
                },
            });
            await (0, audit_js_1.recordAuditLog)({
                userId: created.id,
                userEmail: created.email,
                action: "ADMIN_CLI_CREATE",
                resource: "User",
                resourceId: created.id,
                payload: { role: created.role, mustChangePassword },
            });
            console.log(`✅ Created admin ${created.email} (role: ${created.role}, mustChangePassword: ${mustChangePassword}).`);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}
main().catch((err) => {
    console.error("create-admin failed:", err instanceof Error ? err.message : String(err));
    process.exit(1);
});
//# sourceMappingURL=create-admin.js.map