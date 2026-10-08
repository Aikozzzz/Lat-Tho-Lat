"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentAppUser } from "@/lib/auth";
import { campaignSchema } from "@/lib/validations/campaign";
import { updateSchema } from "@/lib/validations/update";
import { createCampaign, publishCampaignUpdate, submitCampaignForReview } from "@/server/services/campaign-service";

export type FormActionState = { status: "idle" | "success" | "error"; message: string };
export const initialFormActionState: FormActionState = { status: "idle", message: "" };

export async function createCampaignAction(_previous: FormActionState, formData: FormData): Promise<FormActionState> {
  const parsed = campaignSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    location: formData.get("location"),
    goalAmount: formData.get("goalAmount"),
    deadline: formData.get("deadline"),
    imageUrl: formData.get("imageUrl") ?? "",
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your campaign details." };
  try {
    const user = await requireCurrentAppUser();
    const campaign = await createCampaign(parsed.data, user);
    revalidatePath("/dashboard");
    return { status: "success", message: `Draft ${campaign.id} created. Add more details before submitting it for review.` };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "We could not create that campaign." };
  }
}

export async function publishCampaignUpdateAction(_previous: FormActionState, formData: FormData): Promise<FormActionState> {
  const parsed = updateSchema.safeParse({ campaignId: formData.get("campaignId"), title: formData.get("title"), content: formData.get("content") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your update." };
  try {
    const user = await requireCurrentAppUser();
    await publishCampaignUpdate(parsed.data, user);
    revalidatePath(`/campaigns/${parsed.data.campaignId}`);
    revalidatePath("/dashboard");
    return { status: "success", message: "Your progress update is live." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "We could not publish that update." };
  }
}

export async function submitCampaignAction(formData: FormData) {
  const campaignId = String(formData.get("campaignId") ?? "");
  if (!campaignId) throw new Error("A campaign ID is required.");
  const user = await requireCurrentAppUser();
  await submitCampaignForReview(campaignId, user);
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}
