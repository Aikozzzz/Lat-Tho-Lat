"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, HandHeart, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInAction, signUpAction } from "@/server/actions/auth-actions";
import { initialAuthActionState } from "@/lib/action-state";

type AuthFormProps = { nextPath?: string; mode: "sign-in" | "sign-up" };

export function AuthForm({ nextPath, mode }: AuthFormProps) {
  return mode === "sign-in" ? <SignInForm nextPath={nextPath} /> : <SignUpForm nextPath={nextPath} />;
}

function SignInForm({ nextPath }: { nextPath?: string }) {
  const [state, action, pending] = useActionState(signInAction, initialAuthActionState);
  return (
    <AuthShell eyebrow="Welcome back" title="Sign in to keep giving" detail="Continue supporting the causes that matter to you.">
      <form action={action} className="grid gap-4">
        <input type="hidden" name="next" value={nextPath ?? ""} />
        <AuthInput icon={Mail} label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        <AuthInput icon={LockKeyhole} label="Password" name="password" type="password" autoComplete="current-password" placeholder="Your password" />
        <AuthFeedback state={state} />
        <Button type="submit" size="lg" disabled={pending}>{pending ? "Signing in…" : <>Sign in <ArrowRight size={16} /></>}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-[#737b89]">New to Lat Tho Lat? <Link href="/sign-up" className="font-bold text-[#5964d9] hover:underline">Create an account</Link></p>
    </AuthShell>
  );
}

function SignUpForm({ nextPath }: { nextPath?: string }) {
  const [state, action, pending] = useActionState(signUpAction, initialAuthActionState);
  return (
    <AuthShell eyebrow="Join the circle" title="Create your giving account" detail="Every account starts as a user. Trusted administrators are promoted separately in the database.">
      <form action={action} className="grid gap-4">
        <input type="hidden" name="next" value={nextPath ?? ""} />
        <AuthInput icon={UserRound} label="Your name" name="name" type="text" autoComplete="name" placeholder="Your name" />
        <AuthInput icon={Mail} label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        <AuthInput icon={LockKeyhole} label="Password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" />
        <AuthInput icon={LockKeyhole} label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat your password" />
        <AuthFeedback state={state} />
        <Button type="submit" size="lg" disabled={pending}>{pending ? "Creating account…" : <>Create account <ArrowRight size={16} /></>}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-[#737b89]">Already have an account? <Link href="/sign-in" className="font-bold text-[#5964d9] hover:underline">Sign in</Link></p>
    </AuthShell>
  );
}

function AuthShell({ eyebrow, title, detail, children }: { eyebrow: string; title: string; detail: string; children: React.ReactNode }) {
  return <main className="grid min-h-[70vh] place-items-center bg-[#f3f2ec] px-5 py-12 sm:px-8"><div className="w-full max-w-md rounded-[28px] border border-[#e3e2da] bg-white p-6 shadow-[0_20px_60px_rgba(19,34,56,0.08)] sm:p-8"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#132238] text-[#ff8b73]"><HandHeart size={25} /></div><p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.15em] text-[#777f8c]">{eyebrow}</p><h1 className="mt-3 text-center text-3xl font-bold tracking-[-0.06em] text-[#132238]">{title}</h1><p className="mt-3 text-center text-sm leading-6 text-[#737b89]">{detail}</p><div className="mt-7">{children}</div></div></main>;
}

function AuthInput({ icon: Icon, label, name, type, autoComplete, placeholder }: { icon: typeof Mail; label: string; name: string; type: string; autoComplete: string; placeholder: string }) {
  return <label className="block text-xs font-semibold text-[#687181]">{label}<span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-[#deddd6] bg-[#faf9f6] px-3 transition focus-within:border-[#5964d9] focus-within:ring-2 focus-within:ring-[#5964d9]/10"><Icon size={16} className="shrink-0 text-[#8a909a]" /><input required name={name} type={type} autoComplete={autoComplete} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm text-[#132238] outline-none placeholder:text-[#a4a8af]" /></span></label>;
}

function AuthFeedback({ state }: { state: { status: string; message: string } }) {
  if (!state.message) return null;
  return <p role="alert" className="rounded-xl bg-[#fff0ee] px-4 py-3 text-xs font-semibold leading-5 text-[#b65343]">{state.message}</p>;
}
