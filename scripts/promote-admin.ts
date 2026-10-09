import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error("Usage: npm run db:promote-admin -- user@example.com");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to promote an administrator.");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  try {
    const user = await db.user.update({
      where: { email },
      data: { role: "ADMIN" },
      select: { email: true, role: true },
    });
    console.log(`${user.email} is now ${user.role}.`);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      throw new Error(`No account exists for ${email}. Have the user sign up first.`);
    }
    throw error;
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
