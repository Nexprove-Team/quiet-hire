import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";


export const env = createEnv({
    server: {
        DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
        TRIGGER_SECRET_KEY: z.string(),
        TRIGGER_PROJECT_ID: z.string(),
        BETTER_AUTH_SECRET: z.string(),
        BETTER_AUTH_URL: z.url(),
    },
    experimental__runtimeEnv: process.env,
});
