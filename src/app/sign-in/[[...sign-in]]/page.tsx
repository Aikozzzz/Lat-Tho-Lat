import { AuthForm } from "@/components/auth/auth-form";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const params = await searchParams;
  const nextPath = Array.isArray(params.next) ? params.next[0] : params.next;
  return <AuthForm mode="sign-in" nextPath={nextPath} />;
}
