"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, HeartHandshake, MapPin, ShieldCheck, Users } from "lucide-react";
import type { CampaignDetail } from "@/server/services/campaign-service";
import { formatMMK, getProgress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DonationDialog } from "@/components/donations/donation-dialog";

export function CampaignDetailClient({ campaign }: { campaign: CampaignDetail }) {
  const [donationOpen, setDonationOpen] = useState(false);
  const progress = getProgress(campaign.raised, campaign.goal);

  return (
    <>
      <main className="bg-[#f3f2ec]">
        <section className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-24 lg:pt-12">
          <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm font-semibold text-[#697181] transition hover:text-[#132238]"><ArrowLeft size={16} />Back to campaigns</Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_390px] lg:items-start lg:gap-12">
            <div>
              <div className="relative h-[330px] overflow-hidden rounded-[28px] bg-[#dfe2f5] shadow-[0_20px_55px_rgba(34,42,58,0.08)] sm:h-[430px]"><Image src={campaign.image} alt={campaign.imageAlt} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#132238]/55 via-transparent to-transparent" /><div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white"><div><Badge className="bg-white/90">{campaign.category}</Badge><h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.05em] sm:text-5xl">{campaign.title}</h1></div><span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-[#ff765f]"><HeartHandshake size={20} fill="currentColor" /></span></div></div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#6f7786]"><span className="inline-flex items-center gap-2"><MapPin size={15} />{campaign.location}</span><span className="inline-flex items-center gap-2"><Users size={15} />{campaign.donors} supporters</span><span className="inline-flex items-center gap-2"><Clock3 size={15} />{campaign.daysLeft} days left</span></div>
              <div className="mt-8 max-w-2xl"><p className="text-lg leading-8 text-[#3e4b60]">{campaign.description}</p><p className="mt-5 text-sm leading-7 text-[#707988]">This campaign is organized by <strong className="font-semibold text-[#132238]">{campaign.organizer}</strong> of {campaign.organizerRole}. Progress updates will show how contributions are being used, step by step.</p></div>
              <div className="mt-10 border-t border-[#dfded7] pt-8"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#737b89]"><ShieldCheck size={15} className="text-[#319875]" />Campaign updates</div>{campaign.updates.length ? <div className="mt-5 grid gap-4">{campaign.updates.map((update) => <article key={update.id} className="rounded-2xl border border-[#e4e3dc] bg-white p-5"><div className="flex items-center justify-between gap-4"><h2 className="font-bold text-[#132238]">{update.title}</h2><time className="text-xs text-[#8b919b]">{new Date(update.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time></div><p className="mt-3 text-sm leading-6 text-[#737b89]">{update.content}</p></article>)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-[#d3d2ca] bg-white/70 p-6 text-sm leading-6 text-[#7b8390]">The organizer has not published an update yet. Verified contributions still appear in the public progress total.</div>}</div>
            </div>

            <aside className="lg:sticky lg:top-6"><div className="rounded-[26px] border border-[#e2e1da] bg-white p-5 shadow-[0_16px_45px_rgba(34,42,58,0.08)] sm:p-6"><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a909a]">Raised so far</p><p className="mt-2 text-3xl font-bold tracking-[-0.06em] text-[#132238]">{formatMMK(campaign.raised)} <span className="text-sm font-semibold tracking-normal text-[#7f8792]">MMK</span></p><p className="mt-1 text-xs text-[#858c97]">of {formatMMK(campaign.goal)} MMK goal</p></div><span className="grid h-12 w-12 place-items-center rounded-full bg-[#e7e5ff] text-sm font-bold text-[#5148aa]">{progress}%</span></div><ProgressBar value={progress} className="mt-5" /><div className="mt-3 flex items-center justify-between text-xs text-[#858c97]"><span>{campaign.donors} supporters</span><span>{campaign.daysLeft} days left</span></div><Button className="mt-6 w-full" size="lg" onClick={() => setDonationOpen(true)}>Support this cause</Button><div className="mt-5 grid gap-3 border-t border-[#efeee8] pt-5 text-xs text-[#7d8591]"><div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#38a276]" />Campaign details are public</div><div className="flex items-center gap-2"><ShieldCheck size={15} className="text-[#38a276]" />Verified contributions only count</div><div className="flex items-center gap-2"><CalendarDays size={15} className="text-[#8d77c3]" />Deadline in {campaign.daysLeft} days</div></div></div></aside>
          </div>
        </section>
      </main>
      <DonationDialog campaign={donationOpen ? campaign : null} onClose={() => setDonationOpen(false)} />
    </>
  );
}
