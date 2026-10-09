"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { Banknote, Check, CheckCircle2, ChevronRight, CreditCard, LockKeyhole, UserRound, X, Zap } from "lucide-react";
import type { Campaign } from "@/lib/data";
import { formatMMK, getProgress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { createDonationAction } from "@/server/actions/donation-actions";
import { initialDonationActionState } from "@/lib/action-state";

type DonationDialogProps = {
  campaign: Campaign | null;
  onClose: () => void;
};

const presets = [10000, 25000, 50000, 100000];
const paymentMethods = [
  { id: "KBZPAY", label: "KBZPay", detail: "Pay with your KBZPay wallet", icon: Zap },
  { id: "WAVEPAY", label: "Wave Money", detail: "Pay with your Wave wallet", icon: Banknote },
  { id: "BANK_TRANSFER", label: "Bank transfer", detail: "Upload proof after sending", icon: CreditCard },
];

export function DonationDialog({ campaign, onClose }: DonationDialogProps) {
  const [amount, setAmount] = useState(presets[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [anonymous, setAnonymous] = useState(false);
  const [paymentReference, setPaymentReference] = useState("demo-reference");
  const [actionState, formAction, pending] = useActionState(createDonationAction, initialDonationActionState);

  useEffect(() => {
    if (!campaign) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [campaign]);

  useEffect(() => {
    if (!campaign) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [campaign, onClose]);

  if (!campaign) return null;
  const finalAmount = customAmount ? Number(customAmount.replace(/\D/g, "")) || 0 : amount;
  const progress = getProgress(campaign.raised, campaign.goal);
  const submitted = actionState.status === "success";

  return (
    <div data-testid="donation-dialog" className="fixed inset-0 z-50 flex items-end justify-center bg-[#132238]/45 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="donation-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] bg-[#faf9f6] shadow-[0_20px_80px_rgba(19,34,56,0.25)] sm:rounded-[28px]">
        <div className="flex items-center justify-between border-b border-[#e8e7e0] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#132238]"><LockKeyhole size={15} className="text-[#43a779]" />Your contribution is private by default</div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-[#727988] transition hover:bg-[#efeee8] hover:text-[#132238]" aria-label="Close donation form"><X size={18} /></button>
        </div>

        {submitted ? (
          <div className="grid min-h-[470px] place-items-center px-6 py-12 text-center sm:px-16">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#dff7eb] text-[#23966f]"><CheckCircle2 size={31} /></div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-[#6a7280]">Thank you, hand to hand</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#132238]">Your support is on its way.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#727a89]">We&apos;ll review your payment and let you know when your {formatMMK(finalAmount)} MMK contribution is verified.</p>
              <Button className="mt-8" onClick={onClose}>Back to campaigns</Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px]">
            <form data-testid="donation-form" action={formAction} className="p-5 sm:p-8">
              <input type="hidden" name="campaignId" value={campaign.id} />
              <input type="hidden" name="amount" value={String(finalAmount)} />
              <input type="hidden" name="paymentMethod" value={paymentMethod} />
              <input type="hidden" name="isAnonymous" value={String(anonymous)} />
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7c8491]">Support a cause</p>
              <h2 id="donation-title" className="mt-2 max-w-xl text-2xl font-bold tracking-[-0.04em] text-[#132238] sm:text-3xl">Choose an amount for {campaign.title}</h2>

              <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {presets.map((preset) => <button data-testid={`donation-preset-${preset}`} type="button" key={preset} onClick={() => { setAmount(preset); setCustomAmount(""); }} className={`h-12 rounded-xl border text-sm font-bold transition ${!customAmount && amount === preset ? "border-[#5964d9] bg-[#eeedff] text-[#5147a6]" : "border-[#dfded8] bg-white text-[#495365] hover:border-[#5964d9]"}`}>{formatMMK(preset)} MMK</button>)}
              </div>
              <label className="mt-3 block text-xs font-semibold text-[#687181]">Or enter another amount
                <div className={`mt-2 flex h-12 items-center rounded-xl border bg-white px-4 transition ${customAmount ? "border-[#5964d9] ring-2 ring-[#5964d9]/10" : "border-[#dfded8]"}`}><span className="text-sm font-bold text-[#8b919d]">MMK</span><input value={customAmount} onChange={(event) => setCustomAmount(event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="0" className="ml-3 w-full bg-transparent text-base font-bold text-[#132238] outline-none placeholder:text-[#c0c2c7]" aria-label="Custom donation amount" /></div>
              </label>

              <div className="mt-7">
                <div className="flex items-center justify-between"><p className="text-sm font-bold text-[#132238]">How will you send it?</p><span className="text-xs text-[#8a909a]">Step 1 of 2</span></div>
                <div className="mt-3 grid gap-2">
                  {paymentMethods.map(({ id, label, detail, icon: Icon }) => <button type="button" key={id} onClick={() => setPaymentMethod(id)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${paymentMethod === id ? "border-[#5964d9] bg-[#f3f2ff]" : "border-[#dfded8] bg-white hover:border-[#a7a4d9]"}`}><span className={`grid h-9 w-9 place-items-center rounded-lg ${paymentMethod === id ? "bg-[#5964d9] text-white" : "bg-[#f0f0eb] text-[#6d7582]"}`}><Icon size={16} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-[#2a3850]">{label}</span><span className="block text-xs text-[#7c8490]">{detail}</span></span>{paymentMethod === id && <span className="grid h-5 w-5 place-items-center rounded-full bg-[#5964d9] text-white"><Check size={12} /></span>}</button>)}
                </div>
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#e3e2db] bg-white p-3"><input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#5964d9]" /><span><span className="block text-sm font-semibold text-[#334056]">Give anonymously</span><span className="mt-0.5 block text-xs leading-5 text-[#89909b]">Your name won&apos;t appear on the public campaign page.</span></span><UserRound size={16} className="ml-auto mt-0.5 text-[#8a909a]" /></label>

              <label className="mt-5 block text-xs font-semibold text-[#687181]">Payment reference
                <input name="paymentReference" value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#dfded8] bg-white px-4 text-sm font-semibold text-[#132238] outline-none transition focus:border-[#5964d9] focus:ring-2 focus:ring-[#5964d9]/10" placeholder="e.g. transfer reference" />
              </label>

              {actionState.status === "error" && <p role="alert" className="mt-4 rounded-xl bg-[#fff0ee] px-4 py-3 text-xs font-semibold leading-5 text-[#b65343]">{actionState.message}</p>}
              <Button data-testid="donation-submit" className="mt-6 w-full" size="lg" disabled={pending || finalAmount < 1000}>{pending ? "Recording contribution…" : <>Continue with {formatMMK(finalAmount || 0)} MMK <ChevronRight size={17} /></>}</Button>
              <p className="mt-3 text-center text-[11px] leading-5 text-[#9297a0]">Contributions are recorded as pending until a reviewer verifies the payment reference.</p>
            </form>
            <aside className="border-t border-[#e8e7e0] bg-[#f2f1eb] p-5 sm:p-7 lg:border-l lg:border-t-0">
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="relative h-36"><Image src={campaign.image} alt="" fill sizes="360px" className="object-cover" /></div><div className="p-4"><p className="line-clamp-2 text-sm font-bold leading-5 text-[#132238]">{campaign.title}</p><div className="mt-4 flex items-center justify-between text-xs"><span className="font-bold text-[#132238]">{formatMMK(campaign.raised)} MMK</span><span className="text-[#747c89]">of {formatMMK(campaign.goal)} MMK</span></div><ProgressBar value={progress} className="mt-2" /><div className="mt-3 flex items-center justify-between text-xs text-[#858c97]"><span>{progress}% funded</span><span>{campaign.donors} supporters</span></div></div></div>
              <div className="mt-5 rounded-2xl border border-[#dfded7] bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#7e8692]">Your contribution</p><div className="mt-3 flex items-end justify-between"><span className="text-sm text-[#707887]">Amount</span><span className="text-xl font-bold tracking-[-0.03em] text-[#132238]">{formatMMK(finalAmount || 0)} MMK</span></div><div className="mt-3 border-t border-[#efeee8] pt-3 text-xs leading-5 text-[#858c97]">You can change the amount at any time before confirming.</div></div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
