import type { Scraper, ScraperOptions, ScrapeResult } from "../base-scraper.js";
import { searchRecruiters } from "./search.js";
import { createLogger } from "../../utils/logger.js";

const log = createLogger("linkedin");

export class LinkedInScraper implements Scraper {
  readonly platform = "linkedin" as const;
  readonly name = "LinkedIn (Proxycurl)";

  async scrape(options: ScraperOptions): Promise<ScrapeResult> {
    const errors: string[] = [];

    // Query can be a company name or comma-separated list of companies
    const companies = options.query.split(",").map((c) => c.trim());
    const allRecruiters: ScrapeResult["recruiters"] = [];

    const perCompanyLimit = Math.ceil(
      (options.maxResults ?? 50) / companies.length
    );

    for (const company of companies) {
      try {
        log.info(`Searching recruiters at "${company}"...`);
        const results = await searchRecruiters(company, perCompanyLimit);
        allRecruiters.push(...results);
        log.info(`Found ${results.length} recruiters at "${company}"`);
      } catch (err) {
        const msg = `LinkedIn search for "${company}": ${err instanceof Error ? err.message : String(err)}`;
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
