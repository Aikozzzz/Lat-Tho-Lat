"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { donationSchema } from "@/lib/validations/donation";
import { requireCurrentAppUser } from "@/lib/auth";
import { createPendingDonation } from "@/server/services/donation-service";

export type DonationActionState = {
  status: "idle" | "success" | "error";
  message: string;
  donationId?: string;
};

export const initialDonationActionState: DonationActionState = { status: "idle", message: "" };

export async function createDonationAction(_previous: DonationActionState, formData: FormData): Promise<DonationActionState> {
  const raw = {
    campaignId: String(formData.get("campaignId") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    paymentMethod: String(formData.get("paymentMethod") ?? ""),
    paymentReference: String(formData.get("paymentReference") ?? ""),
    isAnonymous: formData.get("isAnonymous") === "true" || formData.get("isAnonymous") === "on",
    idempotencyKey: String(formData.get("idempotencyKey") ?? randomUUID()),
  };
  const parsed = donationSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your contribution details." };

  try {
    const user = await requireCurrentAppUser();
    const donation = await createPendingDonation({ ...parsed.data, idempotencyKey: parsed.data.idempotencyKey ?? randomUUID() }, user);
    revalidatePath("/campaigns");
    revalidatePath(`/campaigns/${parsed.data.campaignId}`);
    return { status: "success", message: "Your contribution is waiting for payment verification.", donationId: donation.id };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "We could not record that contribution." };
  }
}
