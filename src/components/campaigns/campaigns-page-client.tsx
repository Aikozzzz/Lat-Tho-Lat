"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Campaign } from "@/lib/data";
import { CampaignGrid } from "@/components/campaigns/campaign-grid";
import { DonationDialog } from "@/components/donations/donation-dialog";

export function CampaignsPageClient({ campaigns }: { campaigns: Campaign[] }) {
  const [selected, setSelected] = useState<Campaign | null>(null);
  return <main className="bg-[#f3f2ec] px-5 py-10 sm:px-8 lg:px-12 lg:py-16"><div className="mx-auto max-w-7xl"><Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#697181] transition hover:text-[#132238]"><ArrowLeft size={16} />Home</Link><div className="mt-8 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#777f8c]">All active causes</p><h1 className="mt-3 text-4xl font-bold leading-tight tracking-[-0.06em] text-[#132238] sm:text-6xl">Find a reason to lend a hand.</h1><p className="mt-5 text-base leading-7 text-[#727b89]">Browse campaigns from neighbours across Myanmar. Every card keeps the goal, progress, and next step in view.</p></div><div className="mt-12"><CampaignGrid campaigns={campaigns} onDonate={setSelected} /></div></div><DonationDialog key={selected?.id ?? "closed"} campaign={selected} onClose={() => setSelected(null)} /></main>;
}
