export type EvidenceInput = {
  donationId: string;
  storageKey: string;
  contentType: "image/jpeg" | "image/png" | "application/pdf";
  sizeBytes: number;
  checksum?: string;
};
