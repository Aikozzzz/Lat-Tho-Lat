export default function CampaignsLoading() {
  return <main className="bg-[#f3f2ec] px-5 py-16 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><div className="h-5 w-36 animate-pulse rounded-full bg-[#e4e3dc]" /><div className="mt-5 h-16 w-full max-w-xl animate-pulse rounded-2xl bg-[#e4e3dc]" /><div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[420px] animate-pulse rounded-[24px] bg-white/70" />)}</div></div></main>;
}
