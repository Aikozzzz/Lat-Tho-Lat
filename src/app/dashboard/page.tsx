import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, HeartHandshake, Plus, WalletCards } from "lucide-react";
import { requirePageUser } from "@/lib/auth";
import { listOwnedCampaigns } from "@/server/services/campaign-service";
import { listDonationsForUser } from "@/server/services/donation-service";
import { formatMMK, getProgress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CampaignForm } from "@/components/dashboard/campaign-form";
import { UpdateForm } from "@/components/dashboard/update-form";
import { submitCampaignAction } from "@/server/actions/campaign-actions";

export default async function DashboardPage() {
  const user = await requirePageUser("/dashboard");
  const [ownedCampaigns, donations] = await Promise.all([listOwnedCampaigns(user), listDonationsForUser(user)]);

  return (
    <main className="bg-[#f3f2ec] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#777f8c]">Your giving space</p><h1 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-[#132238] sm:text-5xl">Hello, neighbour.</h1><p className="mt-4 text-sm leading-6 text-[#727b89]">Follow the causes you support, or bring a new one to life.</p></div>
          <Link href="/campaigns"><Button variant="secondary"><ArrowRight size={15} />Explore active causes</Button></Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[22px] bg-[#132238] p-5 text-white"><WalletCards size={18} className="text-[#ff9f89]" /><p className="mt-6 text-2xl font-bold tracking-[-0.05em]">{donations.length}</p><p className="mt-1 text-xs text-[#aab3c1]">contributions recorded</p></div>
          <div className="rounded-[22px] bg-white p-5"><HeartHandshake size={18} className="text-[#5964d9]" /><p className="mt-6 text-2xl font-bold tracking-[-0.05em] text-[#132238]">{formatMMK(donations.reduce((sum, donation) => sum + Number(donation.amount), 0))}</p><p className="mt-1 text-xs text-[#858c97]">MMK contributed</p></div>
          <div className="rounded-[22px] bg-white p-5"><CheckCircle2 size={18} className="text-[#2e9870]" /><p className="mt-6 text-2xl font-bold tracking-[-0.05em] text-[#132238]">{ownedCampaigns.length}</p><p className="mt-1 text-xs text-[#858c97]">campaigns you organize</p></div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7c8491]">Your contributions</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#132238]">A record of your hands</h2></div>
            <div className="mt-5 grid gap-3">
              {donations.length ? donations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between gap-4 rounded-2xl border border-[#e3e2da] bg-white p-4">
                  <div><p className="text-sm font-bold text-[#132238]">{"campaign" in donation ? donation.campaign.title : "Community contribution"}</p><p className="mt-1 flex items-center gap-1 text-xs text-[#858c97]"><Clock3 size={12} />{"createdAt" in donation ? new Date(donation.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Just now"}</p></div>
                  <div className="text-right"><p className="text-sm font-bold text-[#132238]">{formatMMK(Number(donation.amount))} MMK</p><span className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${donation.status === "VERIFIED" ? "bg-[#dff7eb] text-[#287b5f]" : "bg-[#fff0bd] text-[#8f7112]"}`}>{donation.status}</span></div>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-[#d4d3ca] bg-white/60 p-8 text-sm leading-6 text-[#7b8390]">Your contribution history will appear here after you support a campaign.</div>}
            </div>
          </section>
          <div className="grid gap-6" id="new-campaign"><CampaignForm />{ownedCampaigns[0] && <UpdateForm campaignId={ownedCampaigns[0].id} />}</div>
        </div>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7c8491]">Organizer view</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#132238]">Your campaigns</h2></div><a href="#new-campaign" className="inline-flex items-center gap-1 text-sm font-bold text-[#5964d9]"><Plus size={15} />New campaign</a></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">{ownedCampaigns.map((campaign) => { const progress = getProgress(campaign.raised, campaign.goal); return <article key={campaign.id} className="rounded-2xl border border-[#e3e2da] bg-white p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a909a]">{campaign.category}</p><h3 className="mt-2 text-lg font-bold tracking-[-0.03em] text-[#132238]">{campaign.title}</h3></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${campaign.status === "ACTIVE" ? "bg-[#dff7eb] text-[#287b5f]" : "bg-[#fff0bd] text-[#8f7112]"}`}>{campaign.status}</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-[#ecebe5]"><div className="h-full rounded-full bg-[#5964d9]" style={{ width: `${progress}%` }} /></div><div className="mt-2 flex justify-between text-xs text-[#858c97]"><span>{formatMMK(campaign.raised)} MMK raised</span><span>{progress}%</span></div>{["DRAFT", "REJECTED"].includes(campaign.status) && <form action={submitCampaignAction} className="mt-4"><input type="hidden" name="campaignId" value={campaign.id} /><button className="w-full rounded-full border border-[#deddd6] bg-white px-4 py-2.5 text-xs font-semibold text-[#5964d9] transition hover:border-[#5964d9]">Submit for review</button></form>}</article>; })}</div>
        </section>
      </div>
    </main>
  );
}
