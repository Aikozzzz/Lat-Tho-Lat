"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroyCurrentSession, getSafeRedirectPath } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";
import type { AuthActionState } from "@/lib/action-state";

function databaseError() {
  return { status: "error" as const, message: "Authentication needs a configured DATABASE_URL. Add it to .env.local and try again." };
}

function isUniqueConstraintError(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "P2002");
}

export async function signInAction(_previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your sign-in details." };
  if (!db) return databaseError();

  let user: { id: string; passwordHash: string } | null;
  try {
    user = await db.user.findUnique({ where: { email: parsed.data.email }, select: { id: true, passwordHash: true } });
  } catch {
    return { status: "error", message: "Authentication storage is unavailable. Apply the database migration and try again." };
  }
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { status: "error", message: "Email or password is incorrect." };
  }

  try {
    await createSession(user.id);
  } catch {
    return { status: "error", message: "We could not start your session. Please try again." };
  }

  redirect(getSafeRedirectPath(formData.get("next")));
}

export async function signUpAction(_previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your account details." };
  if (!db) return databaseError();

  let user: { id: string };
  try {
    user = await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
        role: "USER",
      },
      select: { id: true },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) return { status: "error", message: "An account already exists for that email." };
    return { status: "error", message: "We could not create your account. Please try again." };
  }

  try {
    await createSession(user.id);
  } catch {
    return { status: "error", message: "Your account was created, but we could not start a session. Please sign in." };
  }

  redirect(getSafeRedirectPath(formData.get("next")));
}

export async function signOutAction() {
  await destroyCurrentSession();
  redirect("/");
}
