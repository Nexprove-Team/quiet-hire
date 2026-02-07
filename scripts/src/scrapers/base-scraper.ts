import type { NewRecruiter, NewJobListing } from "../db/schema.js";

export interface ScrapeResult {
  recruiters: Omit<NewRecruiter, "id" | "createdAt" | "updatedAt">[];
  jobs: Omit<NewJobListing, "id" | "createdAt" | "updatedAt">[];
  errors: string[];
}

export interface ScraperOptions {
  query: string;
  maxResults?: number;
  dryRun?: boolean;
}

export interface Scraper {
  readonly platform: "linkedin" | "twitter" | "company-page";
  readonly name: string;
  scrape(options: ScraperOptions): Promise<ScrapeResult>;
  shutdown(): Promise<void>;
}
