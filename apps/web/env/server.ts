import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";


export const env = createEnv({
    server: {
        DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
        TRIGGER_SECRET_KEY: z.string(),
        TRIGGER_PROJECT_ID: z.string(),
        BETTER_AUTH_SECRET: z.string(),
        BETTER_AUTH_URL: z.url(),
        GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1, "GOOGLE_GENERATIVE_AI_API_KEY is required"),
        BLOB_READ_WRITE_TOKEN: z.string().min(1, "BLOB_READ_WRITE_TOKEN is required"),
    },
    experimental__runtimeEnv: process.env,
});
