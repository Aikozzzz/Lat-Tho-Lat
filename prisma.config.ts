import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Prisma CLI normally reads `.env`, while Next.js reads `.env.local`.
// Load both so local development can use the same credentials as the app.
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DIRECT_URL") },
});
