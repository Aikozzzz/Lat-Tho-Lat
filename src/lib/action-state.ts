export type AuthActionState = {
  status: "idle" | "error";
  message: string;
};

export const initialAuthActionState: AuthActionState = { status: "idle", message: "" };

export type FormActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialFormActionState: FormActionState = { status: "idle", message: "" };

export type DonationActionState = {
  status: "idle" | "success" | "error";
  message: string;
  donationId?: string;
};

export const initialDonationActionState: DonationActionState = { status: "idle", message: "" };
