import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export type AppUser = {
  id: string;
  clerkId: string;
  role: "MEMBER" | "ADMIN";
};

const demoUser: AppUser = {
  id: "demo-member",
  clerkId: "demo-member",
  role: process.env.DEMO_ADMIN === "true" ? "ADMIN" : "MEMBER",
};

function clerkIsConfigured() {
  return Boolean(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
}

export async function getCurrentAppUser(): Promise<AppUser | null> {
  if (!clerkIsConfigured()) return demoUser;

  const { userId } = await auth();
  if (!userId) return null;

  if (!db) return { id: userId, clerkId: userId, role: "MEMBER" };

  const user = await db.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: { clerkId: userId },
    select: { id: true, clerkId: true, role: true },
  });

  return user;
}

export async function requireCurrentAppUser() {
  const user = await getCurrentAppUser();
  if (!user) throw new Error("You must be signed in to continue.");
  return user;
}

export function isClerkConfigured() {
  return clerkIsConfigured();
}
