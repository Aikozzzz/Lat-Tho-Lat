import { listPublicCampaigns } from "@/server/services/campaign-service";
import { CampaignsPageClient } from "@/components/campaigns/campaigns-page-client";

export default async function CampaignsPage() {
  const campaigns = await listPublicCampaigns();
  return <CampaignsPageClient campaigns={campaigns} />;
}
