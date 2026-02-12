import { z } from "zod";
export const emailVerificationSchema = z.object({
    email: z.email(),
    otp: z.string(),
})