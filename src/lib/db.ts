import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForDb = globalThis as unknown as { latThoLatDb?: PrismaClient };

function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

export const db = globalForDb.latThoLatDb ?? createDb();

if (process.env.NODE_ENV !== "production" && db) {
  globalForDb.latThoLatDb = db;
}

export function hasDatabase() {
  return Boolean(db);
}

export function requireDb() {
  if (!db) {
    throw new Error("Database is not configured. Add DATABASE_URL to enable persistence.");
  }
  return db;
}
