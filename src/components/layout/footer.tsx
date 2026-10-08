import { HandHeart, Instagram, Mail, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#e8e7e0] bg-[#f3f2ec]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-12 lg:py-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#132238] text-[#ff8b73]"><HandHeart size={18} /></span>
            <span className="font-extrabold tracking-[-0.03em] text-[#132238]">Lat Tho Lat</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-6 text-[#6e7481]">Small contributions. Shared impact. A kinder way to move good ideas forward in Myanmar.</p>
          <div className="mt-6 flex gap-2">
            <a href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#697182] transition hover:text-[#132238]" aria-label="Instagram"><Instagram size={15} /></a>
            <a href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#697182] transition hover:text-[#132238]" aria-label="Twitter"><Twitter size={15} /></a>
            <a href="mailto:hello@lattholat.org" className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#697182] transition hover:text-[#132238]" aria-label="Email us"><Mail size={15} /></a>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8a8e98]">Discover</p>
          <div className="mt-5 grid gap-3 text-sm text-[#626b79]"><a href="#campaigns" className="hover:text-[#132238]">All causes</a><a href="#campaigns" className="hover:text-[#132238]">This week</a><a href="#stories" className="hover:text-[#132238]">Impact stories</a></div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8a8e98]">Get involved</p>
          <div className="mt-5 grid gap-3 text-sm text-[#626b79]"><a href="#how-it-works" className="hover:text-[#132238]">Start a campaign</a><a href="#how-it-works" className="hover:text-[#132238]">Give together</a><a href="#how-it-works" className="hover:text-[#132238]">Community guide</a></div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8a8e98]">We care about</p>
          <div className="mt-5 grid gap-3 text-sm text-[#626b79]"><a href="#" className="hover:text-[#132238]">Trust & safety</a><a href="#" className="hover:text-[#132238]">Fees & payments</a><a href="#" className="hover:text-[#132238]">Contact support</a></div>
        </div>
      </div>
      <div className="border-t border-[#e5e4dc] px-5 py-5 text-center text-xs text-[#8a8e98] sm:px-8">© 2026 Lat Tho Lat · Built hand to hand, heart to heart.</div>
    </footer>
  );
}
