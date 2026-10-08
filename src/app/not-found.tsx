import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-[65vh] place-items-center bg-[#f3f2ec] p-6"><div className="max-w-md text-center"><p className="text-6xl font-bold tracking-[-0.08em] text-[#5964d9]">404</p><h1 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-[#132238]">That page has moved on.</h1><p className="mt-3 text-sm leading-6 text-[#737b89]">The campaign or page you are looking for is not available.</p><Link href="/" className="mt-7 inline-flex rounded-full bg-[#132238] px-5 py-3 text-sm font-semibold text-white">Back home</Link></div></main>;
}
