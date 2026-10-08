import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lat Tho Lat — Small contributions. Shared impact.",
  description: "A community crowdfunding platform for meaningful causes in Myanmar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return (
    <html lang="en">
      <body>
        <Navbar />
        {clerkConfigured ? <ClerkProvider>{children}</ClerkProvider> : children}
        <Footer />
      </body>
    </html>
  );
}
