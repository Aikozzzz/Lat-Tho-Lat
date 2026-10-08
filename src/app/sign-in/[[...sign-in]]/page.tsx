import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <div className="grid min-h-[70vh] place-items-center bg-[#f3f2ec] p-6"><SignIn /></div>;
  }
  return <DemoAuthPage title="Sign in is ready for Clerk" detail="Add Clerk keys to .env.local to enable real account sessions." action="Create a local demo session" />;
}

function DemoAuthPage({ title, detail, action }: { title: string; detail: string; action: string }) {
  return <div className="grid min-h-[70vh] place-items-center bg-[#f3f2ec] p-6"><div className="w-full max-w-md rounded-[28px] border border-[#e3e2da] bg-white p-8 text-center shadow-[0_20px_60px_rgba(19,34,56,0.08)]"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e7e5ff] text-[#5964d9]">✦</div><h1 className="mt-6 text-2xl font-bold tracking-[-0.04em] text-[#132238]">{title}</h1><p className="mt-3 text-sm leading-6 text-[#737b89]">{detail}</p><a href="/dashboard" className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#132238] px-5 text-sm font-semibold text-white transition hover:bg-[#203854]">{action}</a></div></div>;
}
