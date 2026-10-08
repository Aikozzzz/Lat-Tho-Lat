"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDownRight, ArrowRight, CheckCircle2, HandHeart, HeartHandshake, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { campaigns as demoCampaigns, featuredCampaign as demoFeaturedCampaign } from "@/lib/data";
import type { Campaign } from "@/lib/data";
import { formatMMK, getProgress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ProgressRing } from "@/components/ui/progress-ring";
import { CampaignGrid } from "@/components/campaigns/campaign-grid";
import { DonationDialog } from "@/components/donations/donation-dialog";

const steps = [
  { number: "01", title: "Find something that matters", body: "Browse real community-led causes with clear goals, deadlines, and updates.", icon: Sparkles, color: "bg-[#fff0bd] text-[#8f7112]" },
  { number: "02", title: "Give what feels right", body: "Choose an amount in MMK, add a note, and keep your name private if you prefer.", icon: HandHeart, color: "bg-[#e7e5ff] text-[#5148aa]" },
  { number: "03", title: "See your impact move", body: "Every verified contribution updates the campaign total and helps organizers share progress.", icon: ArrowDownRight, color: "bg-[#dff7eb] text-[#23735c]" },
];

export function HomeExperience({ campaigns: loadedCampaigns }: { campaigns: Campaign[] }) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const visibleCampaigns = loadedCampaigns.length ? loadedCampaigns : demoCampaigns;
  const featuredCampaign = visibleCampaigns[0] ?? demoFeaturedCampaign;
  const featuredProgress = getProgress(featuredCampaign.raised, featuredCampaign.goal);

  return (
    <>
      <main id="top">
        <section className="relative overflow-hidden bg-[#faf9f6]">
          <div className="pointer-events-none absolute -left-40 -top-40 h-[460px] w-[460px] rounded-full bg-[#e7e5ff]/60 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 top-24 h-[420px] w-[420px] rounded-full bg-[#fff0bd]/70 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_0.87fr] lg:items-center lg:gap-16 lg:px-12 lg:pb-24 lg:pt-24">
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e4dc] bg-white/70 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.13em] text-[#6e7585] shadow-sm"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#dff7eb] text-[#32906d]"><Sparkles size={11} /></span> Community-powered giving in Myanmar</div>
              <h1 className="mt-7 max-w-[620px] text-[clamp(3rem,6vw,5.7rem)] font-bold leading-[0.98] tracking-[-0.075em] text-[#132238]">A little from each of us can change <span className="relative inline-block text-[#5964d9]">everything<span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#ffb49f]/65" /></span>.</h1>
              <p className="mt-7 max-w-[520px] text-base leading-7 text-[#687181] sm:text-lg">Lat Tho Lat brings people together around the causes that matter most. Give a little, follow the progress, and help good ideas take root.</p>
              <div className="mt-8 flex flex-wrap gap-3"><a href="#campaigns"><Button size="lg">Explore causes <ArrowRight size={17} /></Button></a><a href="#how-it-works"><Button variant="secondary" size="lg">How it works</Button></a></div>
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#747c8a]"><div className="flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#faf9f6] bg-[#f7cfbd] text-[10px] font-bold text-[#805d4c]">TM</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#faf9f6] bg-[#c9dcff] text-[10px] font-bold text-[#4d6593]">MZ</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#faf9f6] bg-[#d6f1df] text-[10px] font-bold text-[#317257]">EN</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#faf9f6] bg-[#132238] text-[10px] font-bold text-white">+2k</span></div><span><strong className="font-bold text-[#132238]">2,400+ neighbours</strong> have given together</span></div>
            </div>

            <div className="relative mx-auto w-full max-w-[510px] lg:ml-auto">
              <div className="absolute -right-4 -top-8 z-10 hidden rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_14px_35px_rgba(19,34,56,0.14)] sm:block"><div className="flex items-center gap-2 text-xs font-bold text-[#132238]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#dff7eb] text-[#2a976e]"><CheckCircle2 size={15} /></span>Verified campaign</div><p className="mt-1 pl-9 text-[11px] text-[#7d8592]">Every MMK is accounted for.</p></div>
              <div className="overflow-hidden rounded-[30px] border border-white/80 bg-white p-2 shadow-[0_28px_80px_rgba(55,61,89,0.16)]">
                <div className="relative h-[270px] overflow-hidden rounded-[23px] bg-[#e7e4ff]"><Image src={featuredCampaign.image} alt={featuredCampaign.imageAlt} fill sizes="(max-width: 1024px) 100vw, 510px" priority className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#132238]/65 via-transparent to-transparent" /><div className="absolute inset-x-5 top-5 flex items-center justify-between"><Badge className="bg-white/90">Featured this week</Badge><span className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#ff765f]"><HeartHandshake size={17} fill="currentColor" /></span></div><div className="absolute bottom-5 left-5 text-white"><p className="text-xs font-semibold text-white/75">{featuredCampaign.category} · {featuredCampaign.location}</p><h2 className="mt-1 max-w-[350px] text-2xl font-bold leading-7 tracking-[-0.04em]">{featuredCampaign.title}</h2></div></div>
                <div className="p-5 sm:p-6"><div className="flex items-center justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a909a]">Raised so far</p><p className="mt-1 text-2xl font-bold tracking-[-0.05em] text-[#132238]">{formatMMK(featuredCampaign.raised)} <span className="text-sm font-semibold tracking-normal text-[#7d8490]">MMK</span></p><p className="mt-1 text-xs text-[#818894]">of {formatMMK(featuredCampaign.goal)} MMK goal</p></div><ProgressRing value={featuredProgress} size={92} /></div><div className="mt-5"><ProgressBar value={featuredProgress} /><div className="mt-2 flex items-center justify-between text-xs text-[#848b96]"><span>{featuredCampaign.donors} neighbours have helped</span><span>{featuredCampaign.daysLeft} days left</span></div></div><Button className="mt-5 w-full" onClick={() => setSelectedCampaign(featuredCampaign)}>Support this cause <ArrowRight size={16} /></Button></div>
              </div>
              <div className="absolute -bottom-6 -left-5 hidden items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_14px_35px_rgba(19,34,56,0.12)] sm:flex"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#fff0bd] text-[#927314]"><UsersRound size={17} /></span><div><p className="text-xs font-bold text-[#132238]">A shared effort</p><p className="mt-0.5 text-[11px] text-[#7f8793]">Small gifts add up fast.</p></div></div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e6e5dd] bg-white" aria-label="Platform impact">
          <div className="mx-auto grid max-w-7xl gap-0 px-5 sm:px-8 md:grid-cols-3 lg:px-12">
            <div className="flex items-center gap-4 border-b border-[#efeee8] py-6 md:border-b-0 md:border-r md:pr-10"><span className="text-3xl font-bold tracking-[-0.06em] text-[#132238]">42</span><span className="text-xs leading-5 text-[#7a8290]">community causes<br />moving forward</span></div>
            <div className="flex items-center gap-4 border-b border-[#efeee8] py-6 md:border-b-0 md:border-r md:px-10"><span className="text-3xl font-bold tracking-[-0.06em] text-[#132238]">28.4M</span><span className="text-xs leading-5 text-[#7a8290]">MMK raised<br />hand to hand</span></div>
            <div className="flex items-center gap-4 py-6 md:pl-10"><span className="text-3xl font-bold tracking-[-0.06em] text-[#132238]">98%</span><span className="text-xs leading-5 text-[#7a8290]">of donors say they<br />feel part of the story</span></div>
          </div>
        </section>

        <section id="campaigns" className="bg-[#f3f2ec] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#777f8c]">Explore what&apos;s moving</p><h2 className="mt-3 max-w-[560px] text-4xl font-bold leading-[1.04] tracking-[-0.06em] text-[#132238] sm:text-5xl">Good things are already in motion.</h2></div><p className="max-w-sm text-sm leading-6 text-[#727b89]">Every campaign is community-led, reviewed for clarity, and built to share progress along the way.</p></div><div className="mt-10"><CampaignGrid campaigns={visibleCampaigns} onDonate={setSelectedCampaign} /></div></div>
        </section>

        <section id="how-it-works" className="bg-[#faf9f6] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-7xl"><div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#777f8c]">Good giving, made simple</p><h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-[-0.06em] text-[#132238] sm:text-5xl">One good turn makes the next one easier.</h2></div><div className="mt-12 grid gap-5 md:grid-cols-3">{steps.map(({ number, title, body, icon: Icon, color }) => <div key={number} className="rounded-[24px] border border-[#e7e6df] bg-white p-6 shadow-[0_12px_30px_rgba(34,42,58,0.03)]"><div className="flex items-center justify-between"><span className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}><Icon size={21} /></span><span className="text-xs font-bold tracking-[0.15em] text-[#b0b3b8]">{number}</span></div><h3 className="mt-7 text-lg font-bold tracking-[-0.03em] text-[#132238]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#7a8290]">{body}</p></div>)}</div></div>
        </section>

        <section id="stories" className="bg-[#132238] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c3c5ff]"><ShieldCheck size={15} /> Transparency is part of the product</div><h2 className="mt-5 max-w-md text-4xl font-bold leading-[1.05] tracking-[-0.06em] sm:text-5xl">Know where your kindness goes.</h2><p className="mt-6 max-w-md text-base leading-7 text-[#bbc2cf]">Campaign organizers share updates, verified contributions are counted in public progress, and your giving history stays in your hands.</p><a href="#campaigns" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#ff9f89] hover:text-[#ffb4a2]">See active campaigns <ArrowRight size={16} /></a></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-[24px] border border-white/10 bg-white/[0.07] p-6 sm:col-span-2"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8f98aa]">This month&apos;s shared progress</p><p className="mt-3 text-3xl font-bold tracking-[-0.06em]">7,842,000 <span className="text-sm font-semibold tracking-normal text-[#9ea8b8]">MMK</span></p></div><span className="rounded-full bg-[#dff7eb]/10 px-3 py-1.5 text-xs font-bold text-[#92e0c0]">+18.6%</span></div><div className="mt-6 grid h-20 grid-cols-12 items-end gap-2">{[34, 46, 38, 56, 48, 68, 62, 74, 65, 82, 74, 94].map((height, index) => <div key={index} className={`rounded-t-full ${index === 11 ? "bg-[#ff8c75]" : "bg-[#6b75e0]/70"}`} style={{ height: `${height}%` }} />)}</div><div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.12em] text-[#7e889a]"><span>May 01</span><span>May 31</span></div></div><div className="rounded-[24px] border border-white/10 bg-white/[0.07] p-5"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#fff0bd]/15 text-[#ffe18a]"><HeartHandshake size={17} /></span><p className="mt-5 text-2xl font-bold tracking-[-0.05em]">1,240</p><p className="mt-1 text-xs text-[#9ea8b8]">first-time givers</p></div><div className="rounded-[24px] border border-white/10 bg-white/[0.07] p-5"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#dff7eb]/15 text-[#92e0c0]"><CheckCircle2 size={17} /></span><p className="mt-5 text-2xl font-bold tracking-[-0.05em]">100%</p><p className="mt-1 text-xs text-[#9ea8b8]">campaigns with updates</p></div></div></div>
        </section>
      </main>
      <DonationDialog key={selectedCampaign?.id ?? "closed"} campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />
    </>
  );
}
