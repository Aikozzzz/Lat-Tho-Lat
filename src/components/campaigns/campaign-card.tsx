import { ArrowUpRight, CheckCircle2, Clock3, MapPin, Users } from "lucide-react";
import Image from "next/image";
import type { Campaign } from "@/lib/data";
import { formatMMK, getProgress } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

const accentMap = {
  sun: "bg-[#fff0bd] text-[#765700]",
  lavender: "bg-[#ebe8ff] text-[#5147a6]",
  mint: "bg-[#dff7eb] text-[#23735c]",
  sky: "bg-[#dff2ff] text-[#236082]",
};

type CampaignCardProps = {
  campaign: Campaign;
  onDonate: (campaign: Campaign) => void;
};

export function CampaignCard({ campaign, onDonate }: CampaignCardProps) {
  const progress = getProgress(campaign.raised, campaign.goal);

  return (
    <article className="group overflow-hidden rounded-[24px] border border-[#e8e7e0] bg-white shadow-[0_12px_35px_rgba(34,42,58,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(34,42,58,0.1)]">
      <div className="relative h-48 overflow-hidden bg-[#e9e8e0]">
        <Image src={campaign.image} alt={campaign.imageAlt} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <Badge className={accentMap[campaign.accent]}>{campaign.category}</Badge>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/85 text-[#132238] backdrop-blur" aria-label="Verified campaign"><CheckCircle2 size={15} className="text-[#43a779]" /></span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-xs text-[#7b8290]"><MapPin size={13} />{campaign.location}</div>
        <h3 className="mt-2 min-h-[52px] text-[19px] font-bold leading-6 tracking-[-0.03em] text-[#132238]"><a href={`/campaigns/${campaign.id}`} className="transition hover:text-[#5964d9]">{campaign.title}</a></h3>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#737b88]">{campaign.summary}</p>

        <div className="mt-5">
          <div className="mb-2 flex items-end justify-between gap-2 text-xs">
            <span className="font-bold text-[#132238]"><span className="text-base">{formatMMK(campaign.raised)}</span> MMK raised</span>
            <span className="font-semibold text-[#697182]">{progress}%</span>
          </div>
          <ProgressBar value={progress} barClassName="bg-[#5964d9]" />
          <div className="mt-2 flex items-center justify-between text-xs text-[#8a909a]"><span>Goal {formatMMK(campaign.goal)} MMK</span><span className="flex items-center gap-1"><Users size={12} />{campaign.donors} supporters</span></div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#f0efe9] pt-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#e8e7ff] text-[11px] font-bold text-[#5650ae]">{campaign.organizer.split(" ").map((part) => part[0]).join("")}</div>
            <div><p className="text-xs font-semibold text-[#334056]">{campaign.organizer}</p><p className="text-[11px] text-[#8a909a]">{campaign.organizerRole}</p></div>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-[#8b6a12]"><Clock3 size={13} />{campaign.daysLeft} days</span>
        </div>
        <Button className="mt-4 w-full" size="md" onClick={() => onDonate(campaign)}><span>Support this cause</span><ArrowUpRight size={16} /></Button>
      </div>
    </article>
  );
}
