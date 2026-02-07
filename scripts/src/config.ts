import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  SCRAPER_DATABASE_URL: z.string().min(1),
  PROXYCURL_API_KEY: z.string().optional(),
  TWITTER_BEARER_TOKEN: z.string().optional(),
  RATE_LIMIT_REQUESTS_PER_MINUTE: z.coerce.number().default(30),
  HEADLESS: z.coerce.boolean().default(true),
});

export type Config = z.output<typeof envSchema>;

let _config: Config | null = null;

export function getConfig(): Config {
  if (!_config) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      console.error("Invalid environment configuration:");
      console.error(
        result.error.issues
          .map((i) => `  ${i.path.join(".")}: ${i.message}`)
          .join("\n")
      );
      process.exit(1);
    }
    _config = result.data;
  }
  return _config;
}
