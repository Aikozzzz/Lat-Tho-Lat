import type { AppUser } from "@/lib/auth";

export function assertAdmin(user: AppUser) {
  if (user.role !== "ADMIN") throw new Error("Admin access is required.");
}

export function assertOwner(user: AppUser, ownerId: string) {
  if (user.id !== ownerId) throw new Error("You do not have access to this resource.");
}
