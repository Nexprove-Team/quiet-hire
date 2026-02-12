import { db } from "./client";
import * as schema from "./schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { multiSession, username, emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true
  },
  plugins: [username(), multiSession(), emailOTP({
    overrideDefaultEmailVerification: true,
    async sendVerificationOTP({ email, otp, type, }) { },
    otpLength: 6,
    expiresIn: 10 * 60,
    sendVerificationOnSignUp: true,
  })],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "candidate",
        input: true,
      },
      companyName: {
        type: "string",
        required: false,
        input: true,
      },
      linkedinUrl: {
        type: "string",
        required: false,
        input: true,
      },
      twitterUrl: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  advanced: {
    cookiePrefix: "hyre",
    database: {
      generateId: () => crypto.randomUUID(),
    },
  }
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
