import {
  usernameClient,
  multiSessionClient,
  inferAdditionalFields,
  emailOTPClient
} from "better-auth/client/plugins";
import { env } from "@/env/client";
import type { auth } from "@hackhyre/db/auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    usernameClient(),
    multiSessionClient(),
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
