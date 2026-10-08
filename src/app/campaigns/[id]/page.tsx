import { notFound } from "next/navigation";
import { getPublicCampaign } from "@/server/services/campaign-service";
import { CampaignDetailClient } from "@/components/campaigns/campaign-detail-client";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getPublicCampaign(id);
  if (!campaign) notFound();
  return <CampaignDetailClient campaign={campaign} />;
}
