import { z } from "zod";

export const campaignSchema = z.object({
  title: z.string().trim().min(8).max(120),
  description: z.string().trim().min(40).max(10_000),
  category: z.string().trim().min(2).max(50),
  location: z.string().trim().min(2).max(120),
  goalAmount: z.string().trim().regex(/^[1-9]\d{2,17}$/, "Enter a whole-MMK goal"),
  deadline: z.coerce.date().refine((date) => date > new Date(), "Choose a future deadline"),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type CampaignInput = z.infer<typeof campaignSchema>;
