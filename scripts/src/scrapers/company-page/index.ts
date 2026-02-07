import type { Scraper, ScraperOptions, ScrapeResult } from "../base-scraper.js";
import { detectATS } from "./detector.js";
import { parseGreenhouseJobs } from "./parsers/greenhouse.js";
import { parseLeverJobs } from "./parsers/lever.js";
import { parseGenericJobs } from "./parsers/generic.js";
import { withRetry } from "../../utils/retry.js";
import { createLogger } from "../../utils/logger.js";

const log = createLogger("company-page");

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.text();
}

function extractCompanyName(url: string): string {
  try {
    const u = new URL(url);
    // boards.greenhouse.io/companyname
    if (u.hostname === "boards.greenhouse.io") {
      return u.pathname.split("/")[1] ?? "unknown";
    }
    // jobs.lever.co/companyname
    if (u.hostname === "jobs.lever.co") {
      return u.pathname.split("/")[1] ?? "unknown";
    }
    // Fallback: use hostname
    return u.hostname.replace("www.", "").split(".")[0] ?? "unknown";
  } catch {
    return "unknown";
  }
}

export class CompanyPageScraper implements Scraper {
  readonly platform = "company-page" as const;
  readonly name = "Company Career Pages";

  async scrape(options: ScraperOptions): Promise<ScrapeResult> {
    const urls = options.query.split(",").map((u) => u.trim());
    const allJobs: ScrapeResult["jobs"] = [];
    const errors: string[] = [];

    for (const url of urls) {
      try {
        log.info(`Fetching: ${url}`);
        const html = await withRetry(() => fetchPage(url));
        const companyName = extractCompanyName(url);
        const ats = detectATS(url, html);

        log.info(`Detected ATS: ${ats} for ${companyName}`);

        let jobs: ScrapeResult["jobs"];
        switch (ats) {
          case "greenhouse":
            jobs = parseGreenhouseJobs(html, companyName, url);
            break;
          case "lever":
            jobs = parseLeverJobs(html, companyName, url);
            break;
          default:
            jobs = parseGenericJobs(html, companyName, url);
        }

        const limited = options.maxResults
          ? jobs.slice(0, options.maxResults)
          : jobs;

        allJobs.push(...limited);
        log.info(`Found ${jobs.length} jobs at ${companyName} (keeping ${limited.length})`);
      } catch (err) {
        const msg = `Failed to scrape ${url}: ${err instanceof Error ? err.message : String(err)}`;
        errors.push(msg);
        log.error(msg);
      }
    }

    return { recruiters: [], jobs: allJobs, errors };
  }

  async shutdown(): Promise<void> {
    // No browser instance to close for static fetching
  }
}
