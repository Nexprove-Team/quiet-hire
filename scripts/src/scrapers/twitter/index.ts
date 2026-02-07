import type { Scraper, ScraperOptions, ScrapeResult } from "../base-scraper.js";
import { searchHiringTweets } from "./search.js";
import { createLogger } from "../../utils/logger.js";

const log = createLogger("twitter");

export class TwitterScraper implements Scraper {
  readonly platform = "twitter" as const;
  readonly name = "Twitter/X (API v2)";

  async scrape(options: ScraperOptions): Promise<ScrapeResult> {
    const errors: string[] = [];

    // Query can be a search term or comma-separated terms
    const queries = options.query.split(",").map((q) => q.trim());
    const allRecruiters: ScrapeResult["recruiters"] = [];

    const perQueryLimit = Math.ceil(
      (options.maxResults ?? 50) / queries.length
    );

    for (const query of queries) {
      try {
        log.info(`Searching for hiring tweets: "${query}"...`);
        const results = await searchHiringTweets(query, perQueryLimit);
        allRecruiters.push(...results);
        log.info(`Found ${results.length} recruiters for "${query}"`);
      } catch (err) {
        const msg = `Twitter search for "${query}": ${err instanceof Error ? err.message : String(err)}`;
        errors.push(msg);
        log.error(msg);
      }
    }

    return { recruiters: allRecruiters, jobs: [], errors };
  }

  async shutdown(): Promise<void> {
    // No persistent resources
  }
}
