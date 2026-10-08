"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Campaign } from "@/lib/data";
import { categories } from "@/lib/data";
import { CampaignCard } from "@/components/campaigns/campaign-card";

type CampaignGridProps = {
  campaigns: Campaign[];
  onDonate: (campaign: Campaign) => void;
};

export function CampaignGrid({ campaigns, onDonate }: CampaignGridProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [query, setQuery] = useState("");

  const filteredCampaigns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return campaigns.filter((campaign) => {
      const matchesCategory = activeCategory === "All causes" || campaign.category === activeCategory;
      const matchesQuery = !normalizedQuery || [campaign.title, campaign.category, campaign.location].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, campaigns, query]);

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Campaign categories">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2.5 text-xs font-semibold transition ${activeCategory === category ? "bg-[#132238] text-white" : "bg-white text-[#717887] hover:bg-[#eeeee8]"}`} role="tab" aria-selected={activeCategory === category}>{category}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-[#e1e0d8] bg-white px-4 text-sm text-[#818793] sm:w-64 sm:flex-none"><Search size={16} /><span className="sr-only">Search campaigns</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-[#132238] outline-none placeholder:text-[#a1a5ad]" placeholder="Search causes" /></label>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-[#e1e0d8] bg-white text-[#667080] transition hover:border-[#132238] hover:text-[#132238]" aria-label="Filter campaigns"><SlidersHorizontal size={16} /></button>
        </div>
      </div>
      {filteredCampaigns.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{filteredCampaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} onDonate={onDonate} />)}</div> : <div className="rounded-[24px] border border-dashed border-[#d9d8d0] bg-white px-6 py-16 text-center"><p className="font-semibold text-[#132238]">No causes match that search yet.</p><p className="mt-2 text-sm text-[#7e8592]">Try another category or a broader phrase.</p></div>}
    </div>
  );
}
