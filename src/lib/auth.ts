import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const SESSION_COOKIE_NAME = "lat-tho-lat-session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
};

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function toAppUser(user: { id: string; email: string; name: string | null; role: "USER" | "ADMIN" }): AppUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export function getSafeRedirectPath(value: FormDataEntryValue | string | null | undefined, fallback = "/dashboard") {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}

export async function getCurrentAppUser(): Promise<AppUser | null> {
  if (!db) return null;

  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    select: {
      expiresAt: true,
      user: { select: { id: true, email: true, name: true, role: true } },
    },
  });

  if (!session || session.expiresAt <= new Date()) return null;
  return toAppUser(session.user);
}

export async function requireCurrentAppUser() {
  const user = await getCurrentAppUser();
  if (!user) throw new Error("You must be signed in to continue.");
  return user;
}

export async function requirePageUser(nextPath = "/dashboard") {
  const user = await getCurrentAppUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  return user;
}

export async function createSession(userId: string) {
  if (!db) throw new Error("Database authentication is not configured. Add DATABASE_URL first.");

  const token = randomBytes(32).toString("base64url");
  await db.session.create({
    data: {
      tokenHash: hashSessionToken(token),
      userId,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000),
    },
  });

  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (db && token) {
    await db.session.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
