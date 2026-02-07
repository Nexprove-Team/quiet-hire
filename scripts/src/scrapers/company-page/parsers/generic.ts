import * as cheerio from "cheerio";
import type { ScrapeResult } from "../../base-scraper.js";

const JOB_KEYWORDS =
  /engineer|developer|designer|manager|analyst|scientist|recruiter|coordinator|specialist|director|lead|intern/i;

export function parseGenericJobs(
  html: string,
  companyName: string,
  sourceUrl: string
): ScrapeResult["jobs"] {
  const $ = cheerio.load(html);
  const jobs: ScrapeResult["jobs"] = [];
  const seen = new Set<string>();

  // Strategy: find links that look like job postings
  $("a").each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href");

    if (!text || text.length < 5 || text.length > 200) return;
    if (!JOB_KEYWORDS.test(text)) return;

    // Deduplicate by title
    const key = text.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    const fullUrl = href?.startsWith("http")
      ? href
      : href
        ? new URL(href, sourceUrl).toString()
        : sourceUrl;

    jobs.push({
      title: text,
      company: companyName,
      source: "company-page",
      sourceUrl: fullUrl,
      scrapedAt: new Date(),
      status: "open",
      skills: [],
    });
  });

  return jobs;
}
