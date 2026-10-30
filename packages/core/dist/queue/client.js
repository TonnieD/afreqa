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
        max: 10,
        application_name: "afreqa-queue",
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
            logger_js_1.logger.info("pg-boss connected and started successfully.");
            const queues = [
                "email:verification",
                "email:welcome",
                "email:campaign",
                "cleanup:hourly",
            ];
            for (const q of queues) {
                try {
                    await boss.createQueue(q);
                }
                catch {
                    // ignore if already created
                }
            }
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