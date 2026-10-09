import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email address.");
const password = z.string().min(8, "Use at least 8 characters.").max(128, "Use 128 characters or fewer.");

export const signInSchema = z.object({
  email,
  password,
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name.").max(80, "Use 80 characters or fewer."),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
