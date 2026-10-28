import { hash, verify } from "@node-rs/argon2";

const ARGON2_OPTIONS = {
  memoryCost: 19456, // 19 MB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export async function hashPassword(plainText: string): Promise<string> {
  return hash(plainText, ARGON2_OPTIONS);
}

export async function verifyPassword(plainText: string, passwordHash: string): Promise<boolean> {
  try {
    return await verify(passwordHash, plainText, ARGON2_OPTIONS);
  } catch {
    return false;
  }
}

