"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentAppUser } from "@/lib/auth";
import { evidenceSchema } from "@/lib/validations/evidence";
import { attachDonationEvidence } from "@/server/services/donation-service";

export async function attachDonationEvidenceAction(formData: FormData) {
  const parsed = evidenceSchema.safeParse({
    donationId: formData.get("donationId"),
    storageKey: formData.get("storageKey"),
    contentType: formData.get("contentType"),
    sizeBytes: formData.get("sizeBytes"),
    checksum: formData.get("checksum") ?? undefined,
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid evidence metadata.");
  const user = await requireCurrentAppUser();
  await attachDonationEvidence(parsed.data, user);
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}
