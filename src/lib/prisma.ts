import { PrismaClient } from "@prisma/client";

/**
 * Standard Next.js Prisma singleton pattern. In dev mode, Next.js hot-reloads
 * modules, which would otherwise create a new PrismaClient (and a new DB
 * connection pool) on every save. Stashing the instance on `globalThis`
 * avoids that.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
