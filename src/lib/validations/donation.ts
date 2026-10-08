import { z } from "zod";

const wholeKyat = z.string().trim().regex(/^[1-9]\d{0,17}$/, "Enter a positive whole-kyat amount");

export const donationSchema = z.object({
  campaignId: z.string().min(1),
  amount: wholeKyat.refine((value) => Number(value) >= 1000, "The minimum contribution is 1,000 MMK"),
  paymentMethod: z.enum(["KBZPAY", "WAVEPAY", "BANK_TRANSFER"]),
  paymentReference: z.string().trim().min(3).max(100),
  isAnonymous: z.coerce.boolean().default(false),
  idempotencyKey: z.string().uuid().optional(),
});

export type DonationInput = z.infer<typeof donationSchema>;
