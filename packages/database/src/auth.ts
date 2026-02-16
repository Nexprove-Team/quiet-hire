import { env } from "../env";
import { db } from "./client";
import * as schema from "./schema";
import { betterAuth } from "better-auth";
import { tasks } from "@trigger.dev/sdk";
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
    autoSignInAfterVerification: true,
  },
  plugins: [
    username(),
    multiSession(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          void tasks.trigger("send-verification-email", {
            email,
            otp,
            type,
          });
        }
      },
      otpLength: 6,
      expiresIn: 10 * 60,
      sendVerificationOnSignUp: true,
    }),
  ],
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
      onboardingCompleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  advanced: {
    cookiePrefix: "hyre",
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseUrl: env.BETTER_AUTH_URL,
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
