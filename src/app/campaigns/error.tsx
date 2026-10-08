"use client";

export default function CampaignsError({ reset }: { reset: () => void }) {
  return <main className="grid min-h-[65vh] place-items-center bg-[#f3f2ec] p-6"><div className="max-w-md rounded-[28px] border border-[#e3e2da] bg-white p-8 text-center"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b65343]">Something went wrong</p><h1 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-[#132238]">We couldn&apos;t load these causes.</h1><p className="mt-3 text-sm leading-6 text-[#737b89]">Try again, or return to the homepage while we reconnect.</p><button onClick={reset} className="mt-6 rounded-full bg-[#132238] px-5 py-3 text-sm font-semibold text-white">Try again</button></div></main>;
}
