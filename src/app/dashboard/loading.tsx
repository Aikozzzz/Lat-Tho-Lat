export default function DashboardLoading() {
  return <main className="bg-[#f3f2ec] px-5 py-16 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><div className="h-10 w-72 animate-pulse rounded-2xl bg-[#e4e3dc]" /><div className="mt-10 grid gap-4 sm:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-[22px] bg-white/70" />)}</div></div></main>;
}
