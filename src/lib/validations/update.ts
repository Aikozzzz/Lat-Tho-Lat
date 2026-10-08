import { z } from "zod";

export const updateSchema = z.object({
  campaignId: z.string().min(1),
  title: z.string().trim().min(5).max(120),
  content: z.string().trim().min(20).max(10_000),
});
