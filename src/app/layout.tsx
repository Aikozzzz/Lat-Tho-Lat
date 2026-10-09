import type { Metadata } from "next";
import { getCurrentAppUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lat Tho Lat — Small contributions. Shared impact.",
  description: "A community crowdfunding platform for meaningful causes in Myanmar.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentAppUser();
  const content = <><Navbar user={user} />{children}<Footer /></>;
  return (
    <html lang="en">
      <body>
        {content}
      </body>
    </html>
  );
}
