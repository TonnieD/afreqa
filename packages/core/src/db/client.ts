import { PrismaClient } from "@prisma/client";

declare global {
  var __afreqa_db__: PrismaClient | undefined;
}

export const db: PrismaClient =
  globalThis.__afreqa_db__ ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__afreqa_db__ = db;
}

export * from "@prisma/client";
