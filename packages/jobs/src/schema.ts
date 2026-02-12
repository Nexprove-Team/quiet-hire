import { z } from "zod";

export const emailVerificationSchema = z.object({
    email: z.email(),
    otp: z.string(),
    type: z.enum(["email-verification", "sign-in", "forget-password"]).default("email-verification").optional(),
});