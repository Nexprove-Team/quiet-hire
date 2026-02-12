import {
  usernameClient,
  multiSessionClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "@hackhyre/db/auth";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    multiSessionClient(),
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
