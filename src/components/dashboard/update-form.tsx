"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { initialFormActionState, publishCampaignUpdateAction } from "@/server/actions/campaign-actions";

export function UpdateForm({ campaignId }: { campaignId: string }) {
  const [state, action, pending] = useActionState(publishCampaignUpdateAction, initialFormActionState);
  return <form action={action} className="rounded-[24px] border border-[#e4e3dc] bg-white p-5 sm:p-6"><input type="hidden" name="campaignId" value={campaignId} /><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7c8491]">Share progress</p><label className="mt-4 block text-xs font-semibold text-[#687181]">Update title<input name="title" required minLength={5} className="mt-2 h-11 w-full rounded-xl border border-[#deddd6] bg-[#faf9f6] px-3 text-sm text-[#132238] outline-none focus:border-[#5964d9]" placeholder="The first shelves are in" /></label><label className="mt-4 block text-xs font-semibold text-[#687181]">What changed?<textarea name="content" required minLength={20} rows={4} className="mt-2 w-full rounded-xl border border-[#deddd6] bg-[#faf9f6] px-3 py-3 text-sm leading-6 text-[#132238] outline-none focus:border-[#5964d9]" placeholder="Tell supporters what their contributions made possible." /></label>{state.message && <p role={state.status === "error" ? "alert" : "status"} className={`mt-4 rounded-xl px-4 py-3 text-xs font-semibold leading-5 ${state.status === "error" ? "bg-[#fff0ee] text-[#b65343]" : "bg-[#dff7eb] text-[#287b5f]"}`}>{state.message}</p>}<Button type="submit" className="mt-4 w-full" disabled={pending}>{pending ? "Publishing…" : "Publish update"}</Button></form>;
}
