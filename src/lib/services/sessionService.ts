import { mockStore, generateId } from "@/lib/mock-data/store";
import { simulateLatency } from "@/lib/utils/mockLatency";
import { toPilgrimDTO } from "@/lib/services/pilgrimService";
import type { IdentificationMethod, Pilgrim } from "@/types/pilgrim";

/**
 * Session service — mock-data-backed for now.
 *
 * SWAP POINT: when PostgreSQL is connected, replace the array operations
 * below with the equivalent `prisma.session.*` calls shown in the
 * commented reference implementation at the bottom of this file. Every
 * function keeps the same name and signature, so `app/api/session/route.ts`
 * and `app/api/identify/route.ts` require zero changes.
 */

const SESSION_TTL_MINUTES = Number(process.env.SESSION_TTL_MINUTES ?? 120);

export async function createSession(pilgrimId: string, method: IdentificationMethod) {
  await simulateLatency(150, 350);

  const expiresAt = new Date(Date.now() + SESSION_TTL_MINUTES * 60 * 1000).toISOString();
  const session = {
    id: generateId("sess"),
    pilgrimId,
    identificationMethod: method,
    createdAt: new Date().toISOString(),
    expiresAt,
  };

  mockStore.sessions.push(session);

  const pilgrim = mockStore.pilgrims.find((p) => p.id === pilgrimId);
  if (pilgrim) pilgrim.lastVerificationMethod = method;

  return session;
}

/** Resolves a session token to its (still-valid) pilgrim, or null. */
export async function getPilgrimBySessionToken(
  token: string | undefined
): Promise<Pilgrim | null> {
  if (!token) return null;

  const session = mockStore.sessions.find((s) => s.id === token);
  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) return null;

  const pilgrim = mockStore.pilgrims.find((p) => p.id === session.pilgrimId);
  if (!pilgrim) return null;

  return toPilgrimDTO(pilgrim);
}

export async function destroySession(token: string | undefined) {
  if (!token) return;
  await simulateLatency(80, 200);
  mockStore.sessions = mockStore.sessions.filter((s) => s.id !== token);
}

/*
 * --- Reference Prisma implementation (for the future PostgreSQL phase) ---
 *
 * export async function createSession(pilgrimId: string, method: PrismaIdMethod) {
 *   const expiresAt = new Date(Date.now() + SESSION_TTL_MINUTES * 60 * 1000);
 *   const session = await prisma.session.create({
 *     data: { pilgrimId, identificationMethod: method, expiresAt },
 *   });
 *   await prisma.pilgrim.update({
 *     where: { id: pilgrimId },
 *     data: { lastVerificationMethod: method },
 *   });
 *   return session;
 * }
 *
 * export async function getPilgrimBySessionToken(token?: string) {
 *   if (!token) return null;
 *   const session = await prisma.session.findUnique({
 *     where: { id: token },
 *     include: { pilgrim: { include: { campaign: { include: { supervisor: true } }, camp: true } } },
 *   });
 *   if (!session || session.expiresAt < new Date()) return null;
 *   return toPilgrimDTO(session.pilgrim);
 * }
 *
 * export async function destroySession(token?: string) {
 *   if (!token) return;
 *   await prisma.session.deleteMany({ where: { id: token } });
 * }
 */
