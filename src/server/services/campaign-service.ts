import "server-only";

import { CampaignStatus } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { campaigns, type Campaign } from "@/lib/data";
import type { AppUser } from "@/lib/auth";

export type PublicCampaign = Campaign & {
  status: string;
  description: string;
};

export type CampaignUpdateView = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export type CampaignDetail = PublicCampaign & {
  updates: CampaignUpdateView[];
};

const fallbackDescription = "A community-led campaign making a practical difference for neighbours in Myanmar.";

function mapDemoCampaign(campaign: Campaign): PublicCampaign {
  return { ...campaign, status: "ACTIVE", description: campaign.summary };
}

function mapDatabaseCampaign(row: {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  imageUrl: string | null;
  goalAmount: unknown;
  deadline: Date;
  status: string;
  organizer: { clerkId: string };
  donations: Array<{ amount: unknown }>;
}) : PublicCampaign {
  const raised = row.donations.reduce((total, donation) => total + Number(donation.amount), 0);
  const goal = Number(row.goalAmount);
  const source = campaigns.find((campaign) => campaign.id === row.id);
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    location: row.location ?? "Myanmar",
    organizer: row.organizer.clerkId === "demo-member" ? "Lat Tho Lat member" : "Community organizer",
    organizerRole: "Community organizer",
    raised,
    goal,
    donors: row.donations.length,
    daysLeft: Math.max(0, Math.ceil((row.deadline.getTime() - Date.now()) / 86_400_000)),
    image: row.imageUrl ?? source?.image ?? "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85",
    imageAlt: source?.imageAlt ?? "A community campaign image",
    accent: source?.accent ?? "lavender",
    summary: row.description.slice(0, 180),
    status: row.status === "COMPLETED" ? "COMPLETED" : "ACTIVE",
    description: row.description || fallbackDescription,
  };
}

export async function listPublicCampaigns(): Promise<PublicCampaign[]> {
  if (!db) return campaigns.map(mapDemoCampaign);

  const rows = await db.campaign.findMany({
    where: { status: { in: [CampaignStatus.ACTIVE, CampaignStatus.COMPLETED] } },
    include: {
      organizer: { select: { clerkId: true } },
      donations: { where: { status: "VERIFIED" }, select: { amount: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(mapDatabaseCampaign);
}

export async function getPublicCampaign(id: string): Promise<CampaignDetail | null> {
  if (!db) {
    const campaign = campaigns.find((item) => item.id === id);
    return campaign ? { ...mapDemoCampaign(campaign), updates: [] } : null;
  }

  const row = await db.campaign.findFirst({
    where: { id, status: { in: [CampaignStatus.ACTIVE, CampaignStatus.COMPLETED] } },
    include: {
      organizer: { select: { clerkId: true } },
      donations: { where: { status: "VERIFIED" }, select: { amount: true } },
      updates: { orderBy: { createdAt: "desc" }, select: { id: true, title: true, content: true, createdAt: true } },
    },
  });
  if (!row) return null;

  return {
    ...mapDatabaseCampaign(row),
    updates: row.updates.map((update) => ({ ...update, createdAt: update.createdAt.toISOString() })),
  };
}

export async function createCampaign(input: {
  title: string;
  description: string;
  category: string;
  location: string;
  goalAmount: string;
  deadline: Date;
  imageUrl?: string;
}, user: AppUser) {
  if (!db) {
    return { id: `demo-campaign-${Date.now()}`, status: "DRAFT" as const };
  }

  const row = await db.campaign.create({
    data: {
      ...input,
      imageUrl: input.imageUrl || null,
      goalAmount: input.goalAmount,
      organizerId: user.id,
    },
    select: { id: true, status: true },
  });
  return row;
}

export async function publishCampaignUpdate(input: { campaignId: string; title: string; content: string }, user: AppUser) {
  if (!db) return { id: `demo-update-${Date.now()}` };

  const campaign = await db.campaign.findUnique({ select: { organizerId: true }, where: { id: input.campaignId } });
  if (!campaign || campaign.organizerId !== user.id) throw new Error("You can only update your own campaign.");

  return db.campaignUpdate.create({
    data: { campaignId: input.campaignId, title: input.title, content: input.content, authorId: user.id },
    select: { id: true },
  });
}

export async function listOwnedCampaigns(user: AppUser) {
  if (!db) return campaigns.slice(0, 2).map(mapDemoCampaign);
  const rows = await db.campaign.findMany({
    where: { organizerId: user.id },
    include: {
      organizer: { select: { clerkId: true } },
      donations: { where: { status: "VERIFIED" }, select: { amount: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((row) => ({ ...mapDatabaseCampaign({ ...row, status: row.status === "COMPLETED" ? "COMPLETED" : "ACTIVE" }), status: row.status }));
}

export async function submitCampaignForReview(campaignId: string, user: AppUser) {
  if (!db) return { id: campaignId, status: "PENDING_REVIEW" as const };
  const campaign = await db.campaign.findUnique({ select: { organizerId: true, status: true }, where: { id: campaignId } });
  if (!campaign || campaign.organizerId !== user.id) throw new Error("You can only submit your own campaign.");
  if (!["DRAFT", "REJECTED"].includes(campaign.status)) throw new Error("Only a draft or rejected campaign can be submitted.");
  return db.campaign.update({ where: { id: campaignId }, data: { status: "PENDING_REVIEW", rejectionReason: null }, select: { id: true, status: true } });
}

export async function listPendingCampaigns() {
  if (!db) return campaigns.slice(1, 2).map(mapDemoCampaign);
  return db.campaign.findMany({
    where: { status: "PENDING_REVIEW" },
    include: {
      organizer: { select: { clerkId: true } },
      donations: { where: { status: "VERIFIED" }, select: { amount: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function reviewCampaign(input: { campaignId: string; status: "ACTIVE" | "REJECTED"; reason?: string }, reviewer: AppUser) {
  if (!db) return { id: input.campaignId, status: input.status };
  const [campaign] = await db.$transaction([
    db.campaign.update({
      where: { id: input.campaignId },
      data: {
        status: input.status,
        rejectionReason: input.status === "REJECTED" ? input.reason ?? "Not approved" : null,
        reviewedAt: new Date(),
        reviewedById: reviewer.id,
      },
    }),
    db.auditLog.create({ data: { actorId: reviewer.id, action: `CAMPAIGN_${input.status}`, entityType: "Campaign", entityId: input.campaignId, metadata: input.reason ? { reason: input.reason } : undefined } }),
  ]);
  return campaign;
}
