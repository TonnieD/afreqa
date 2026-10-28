"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const argon2_1 = require("@node-rs/argon2");
const ARGON2_OPTIONS = {
    memoryCost: 19456, // 19 MB
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
};
async function hashPassword(plainText) {
    return (0, argon2_1.hash)(plainText, ARGON2_OPTIONS);
}
async function verifyPassword(plainText, passwordHash) {
    try {
        return await (0, argon2_1.verify)(passwordHash, plainText, ARGON2_OPTIONS);
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=password.js.map