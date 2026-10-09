import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/password";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to seed the database.");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const organizer = await db.user.upsert({
    where: { email: "seed.organizer@lattholat.local" },
    update: {},
    create: { email: "seed.organizer@lattholat.local", name: "Lat Tho Lat member", passwordHash: await hashPassword("seed-password-change-me"), role: "USER" },
  });

  const seedCampaigns = [
    { id: "after-school-library", title: "A safe place to learn after school", category: "Education", location: "Hpa-an, Kayin", goalAmount: "7000000", description: "Help us turn an unused community room into a warm, well-stocked learning space for 60 children.", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85", days: 12 },
    { id: "village-water", title: "Clean water for 11 village homes", category: "Essential needs", location: "Myeik, Tanintharyi", goalAmount: "12000000", description: "A gravity-fed water line will make clean, reliable water accessible all year round.", imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1200&q=85", days: 8 },
    { id: "market-stall", title: "Restart a family market stall", category: "Livelihoods", location: "Mawlamyine, Mon", goalAmount: "5000000", description: "A small grant for stock and a new awning will help this family reopen their market stall.", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85", days: 21 },
  ];

  for (const campaign of seedCampaigns) {
    await db.campaign.upsert({
      where: { id: campaign.id },
      update: { title: campaign.title, description: campaign.description, category: campaign.category, location: campaign.location, imageUrl: campaign.imageUrl, goalAmount: campaign.goalAmount, deadline: new Date(Date.now() + campaign.days * 86_400_000), status: "ACTIVE" },
      create: { id: campaign.id, title: campaign.title, description: campaign.description, category: campaign.category, location: campaign.location, imageUrl: campaign.imageUrl, goalAmount: campaign.goalAmount, deadline: new Date(Date.now() + campaign.days * 86_400_000), status: "ACTIVE", organizerId: organizer.id },
    });
  }
}

main().finally(() => db.$disconnect());
