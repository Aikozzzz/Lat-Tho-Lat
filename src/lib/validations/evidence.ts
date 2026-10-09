import { z } from "zod";

export const evidenceSchema = z.object({
  donationId: z.string().min(1),
  storageKey: z.string().trim().min(3).max(500),
  contentType: z.enum(["image/jpeg", "image/png", "application/pdf"]),
  sizeBytes: z.coerce.number().int().positive().max(10_000_000),
  checksum: z.string().trim().max(128).optional(),
});
