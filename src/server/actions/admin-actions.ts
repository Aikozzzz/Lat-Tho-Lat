"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentAppUser } from "@/lib/auth";
import { assertAdmin } from "@/lib/permissions";
import { reviewCampaign } from "@/server/services/campaign-service";
import { reviewDonation } from "@/server/services/donation-service";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

export async function reviewCampaignAction(formData: FormData) {
  const user = await requireCurrentAppUser();
  assertAdmin(user);
  const campaignId = value(formData, "campaignId");
  const status = value(formData, "status");
  if (!campaignId || !["ACTIVE", "REJECTED"].includes(status)) throw new Error("Invalid campaign review.");
  await reviewCampaign({ campaignId, status: status as "ACTIVE" | "REJECTED", reason: value(formData, "reason") }, user);
  revalidatePath("/admin");
  revalidatePath("/campaigns");
}

export async function reviewDonationAction(formData: FormData) {
  const user = await requireCurrentAppUser();
  assertAdmin(user);
  const donationId = value(formData, "donationId");
  const status = value(formData, "status");
  if (!donationId || !["VERIFIED", "REJECTED"].includes(status)) throw new Error("Invalid donation review.");
  await reviewDonation({ donationId, status: status as "VERIFIED" | "REJECTED", reason: value(formData, "reason") }, user);
  revalidatePath("/admin");
  revalidatePath("/campaigns");
}
