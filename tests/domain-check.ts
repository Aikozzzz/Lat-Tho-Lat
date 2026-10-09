import assert from "node:assert/strict";
import { campaigns } from "../src/lib/data";
import { getProgress } from "../src/lib/utils";
import { donationSchema } from "../src/lib/validations/donation";
import { createPendingDonation } from "../src/server/services/donation-service";

async function main() {
  assert.equal(getProgress(50, 100), 50);
  assert.equal(getProgress(200, 100), 100);
  assert.equal(getProgress(-10, 100), 0);

  const valid = donationSchema.safeParse({ campaignId: campaigns[0].id, amount: "25000", paymentMethod: "KBZPAY", paymentReference: "kbz-123", isAnonymous: false });
  const invalid = donationSchema.safeParse({ campaignId: campaigns[0].id, amount: "99", paymentMethod: "KBZPAY", paymentReference: "x", isAnonymous: false });
  assert.equal(valid.success, true);
  assert.equal(invalid.success, false);

  const input = { campaignId: campaigns[0].id, amount: "25000", paymentMethod: "KBZPAY" as const, paymentReference: "demo-123", isAnonymous: false, idempotencyKey: "9f7c2c5a-2df2-4f67-9c92-7f0af9f01a10" };
  const user = { id: "test-user", email: "test@example.com", name: "Test User", role: "USER" as const };
  const first = await createPendingDonation(input, user);
  const retry = await createPendingDonation(input, user);
  assert.equal(first.id, retry.id);
  console.log("Domain checks passed: progress, validation, and demo idempotency.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
