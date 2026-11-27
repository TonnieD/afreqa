"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBossClient = getBossClient;
exports.getStartedBoss = getStartedBoss;
const pg_boss_1 = __importDefault(require("pg-boss"));
const logger_js_1 = require("../logger.js");
let bossInstance = globalThis.__afreqa_boss__ || null;
let isStarted = false;
let startPromise = null;
/**
 * Serverless-safe pg-boss client for web functions (enqueue-only / cron-fetch).
 * - Tiny connection pool (max: 2)
 * - Disables automatic schema migration (`migrate: false`), background
 *   supervision (`supervise: false`), and scheduling (`schedule: false`).
 * - Schema & queues are provisioned separately by `afreqa_owner` via `queue:init`.
 */
function getBossClient() {
    if (bossInstance) {
        return bossInstance;
    }
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is required to initialize pg-boss queue client.");
    }
    bossInstance = new pg_boss_1.default({
        connectionString,
        max: 2,
        migrate: false,
        supervise: false,
        schedule: false,
        application_name: "afreqa-web-enqueue",
    });
    bossInstance.on("error", (error) => {
        logger_js_1.logger.error("pg-boss client error", error);
    });
    if (process.env.NODE_ENV !== "production") {
        globalThis.__afreqa_boss__ = bossInstance;
    }
    return bossInstance;
}
async function getStartedBoss() {
    const boss = getBossClient();
    if (isStarted)
        return boss;
    if (startPromise)
        return startPromise;
    startPromise = (async () => {
        try {
            await boss.start();
            isStarted = true;
            logger_js_1.logger.info("pg-boss serverless client started (enqueue/cron mode).");
            return boss;
        }
        catch (err) {
            startPromise = null;
            logger_js_1.logger.error("Failed to start pg-boss client", err);
            throw err;
        }
    })();
    return startPromise;
}
//# sourceMappingURL=client.js.map