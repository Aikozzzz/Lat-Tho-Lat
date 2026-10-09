import { HandHeart, Menu, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AppUser } from "@/lib/auth";
import { signOutAction } from "@/server/actions/auth-actions";

export function Navbar({ user }: { user: AppUser | null }) {
  return (
    <header className="relative z-20 border-b border-[#e8e7e0]/80 bg-[#faf9f6]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="#top" className="group flex items-center gap-3" aria-label="Lat Tho Lat home">
          <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#132238] text-[#ff8b73] shadow-[0_8px_16px_rgba(19,34,56,0.12)] transition group-hover:rotate-[-5deg]">
            <HandHeart size={20} strokeWidth={2.3} />
          </span>
          <span className="leading-none">
            <span className="block text-[15px] font-extrabold tracking-[-0.03em] text-[#132238]">Lat Tho Lat</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7d8290]">hands to hands</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          <Link href="/campaigns" className="text-sm font-medium text-[#566071] transition hover:text-[#132238]">Explore causes</Link>
          <a href="#how-it-works" className="text-sm font-medium text-[#566071] transition hover:text-[#132238]">How it works</a>
          <a href="#stories" className="text-sm font-medium text-[#566071] transition hover:text-[#132238]">Our impact</a>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <button className="grid h-10 w-10 place-items-center rounded-full text-[#566071] transition hover:bg-[#f0f0eb] hover:text-[#132238]" aria-label="Search campaigns">
            <Search size={18} strokeWidth={1.8} />
          </button>
          {user ? <>
            <Link href="/dashboard"><Button variant="dark" size="sm"><Sparkles size={14} />Start a campaign</Button></Link>
            {user.role === "ADMIN" && <Link href="/admin" className="text-xs font-bold text-[#5964d9] hover:underline">Admin</Link>}
            <span className="hidden max-w-[120px] truncate text-xs font-semibold text-[#687181] xl:inline" title={user.email}>{user.name ?? user.email}</span>
            <form action={signOutAction}><button type="submit" className="text-xs font-bold text-[#737b89] transition hover:text-[#132238]">Sign out</button></form>
          </> : <>
            <Link href="/sign-in"><Button variant="secondary" size="sm">Sign in</Button></Link>
            <Link href="/sign-up"><Button variant="dark" size="sm"><Sparkles size={14} />Join Lat Tho Lat</Button></Link>
          </>}
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full text-[#132238] sm:hidden" aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}
