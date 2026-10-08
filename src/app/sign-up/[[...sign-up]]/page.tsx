import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <div className="grid min-h-[70vh] place-items-center bg-[#f3f2ec] p-6"><SignUp /></div>;
  }
  return <div className="grid min-h-[70vh] place-items-center bg-[#f3f2ec] p-6"><div className="w-full max-w-md rounded-[28px] border border-[#e3e2da] bg-white p-8 text-center shadow-[0_20px_60px_rgba(19,34,56,0.08)]"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#dff7eb] text-[#2e986f]">✦</div><h1 className="mt-6 text-2xl font-bold tracking-[-0.04em] text-[#132238]">Create your giving account</h1><p className="mt-3 text-sm leading-6 text-[#737b89]">Clerk sign-up is configured and ready. Add keys to `.env.local` to enable it; demo mode can still explore the app.</p><a href="/dashboard" className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#132238] px-5 text-sm font-semibold text-white transition hover:bg-[#203854]">Continue in demo mode</a></div></div>;
}
