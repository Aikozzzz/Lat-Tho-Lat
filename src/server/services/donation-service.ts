import "server-only";

import { db } from "@/lib/db";
import type { AppUser } from "@/lib/auth";
import { campaigns } from "@/lib/data";

type PendingDonationInput = {
  campaignId: string;
  amount: string;
  paymentMethod: "KBZPAY" | "WAVEPAY" | "BANK_TRANSFER";
  paymentReference: string;
  isAnonymous: boolean;
  idempotencyKey: string;
};

const demoDonations = new Map<string, { id: string; campaignId: string; donorId: string; amount: string; status: "PENDING" }>();

function assertDemoCampaignIsEligible(campaignId: string) {
  const campaign = campaigns.find((item) => item.id === campaignId);
  if (!campaign) throw new Error("That campaign could not be found.");
  if (campaign.daysLeft <= 0) throw new Error("This campaign is no longer accepting contributions.");
  return campaign;
}

export async function createPendingDonation(input: PendingDonationInput, user: AppUser) {
  if (!db) {
    assertDemoCampaignIsEligible(input.campaignId);
    const existing = demoDonations.get(input.idempotencyKey);
    if (existing && existing.donorId !== user.id) throw new Error("This submission key is already in use.");
    if (existing) return existing;
    const donation = { id: `demo-donation-${Date.now()}`, campaignId: input.campaignId, donorId: user.id, amount: input.amount, status: "PENDING" as const };
    demoDonations.set(input.idempotencyKey, donation);
    return donation;
  }

  const campaign = await db.campaign.findUnique({ select: { status: true, deadline: true }, where: { id: input.campaignId } });
  if (!campaign || campaign.status !== "ACTIVE" || campaign.deadline <= new Date()) {
    throw new Error("This campaign is not currently accepting contributions.");
  }

  const existing = await db.donation.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
  if (existing) {
    if (existing.donorId !== user.id) throw new Error("This submission key is already in use.");
    return existing;
  }

  const duplicateReference = await db.donation.findFirst({
    where: { paymentMethod: input.paymentMethod, paymentReference: input.paymentReference, status: { in: ["PENDING", "VERIFIED"] } },
    select: { id: true },
  });
  if (duplicateReference) throw new Error("That payment reference has already been submitted for review.");

  return db.donation.create({
    data: {
      campaignId: input.campaignId,
      donorId: user.id,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      paymentReference: input.paymentReference,
      isAnonymous: input.isAnonymous,
      idempotencyKey: input.idempotencyKey,
    },
  });
}

export async function listDonationsForUser(user: AppUser) {
  if (!db) return Array.from(demoDonations.values()).filter((donation) => donation.donorId === user.id);

  return db.donation.findMany({
    where: { donorId: user.id },
    include: { campaign: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function listPendingDonations() {
  if (!db) return Array.from(demoDonations.values());
  return db.donation.findMany({
    where: { status: "PENDING" },
    include: { campaign: { select: { title: true } }, donor: { select: { clerkId: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function reviewDonation(input: { donationId: string; status: "VERIFIED" | "REJECTED"; reason?: string }, reviewer: AppUser) {
  if (!db) return { id: input.donationId, status: input.status };
  const [donation] = await db.$transaction([
    db.donation.update({
      where: { id: input.donationId },
      data: {
        status: input.status,
        rejectionReason: input.status === "REJECTED" ? input.reason ?? "Not approved" : null,
        reviewedAt: new Date(),
        reviewedById: reviewer.id,
        verifiedAt: input.status === "VERIFIED" ? new Date() : null,
      },
    }),
    db.auditLog.create({ data: { actorId: reviewer.id, action: `DONATION_${input.status}`, entityType: "Donation", entityId: input.donationId, metadata: input.reason ? { reason: input.reason } : undefined } }),
  ]);
  return donation;
}
