import { HomeExperience } from "@/components/home/home-experience";
import { listPublicCampaigns } from "@/server/services/campaign-service";

export default async function Home() {
  const campaigns = await listPublicCampaigns();
  return <HomeExperience campaigns={campaigns} />;
}
