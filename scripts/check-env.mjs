import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

const checks = [
  ["DATABASE_URL", process.env.DATABASE_URL],
  ["DIRECT_URL", process.env.DIRECT_URL],
];

const missing = checks.filter(([, value]) => !value).map(([name]) => name);
if (missing.length) {
  console.warn(`Missing production configuration: ${missing.join(", ")}`);
  console.warn("Public demo data remains available, but database authentication is unavailable. Set STRICT_ENV=true to fail this check.");
  if (process.env.STRICT_ENV === "true") process.exitCode = 1;
} else {
  console.log("Environment configuration looks complete for self-managed auth and Neon.");
}
