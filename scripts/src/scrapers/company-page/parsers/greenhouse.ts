import * as cheerio from "cheerio";
import type { ScrapeResult } from "../../base-scraper.js";

export function parseGreenhouseJobs(
  html: string,
  companyName: string,
  sourceUrl: string
): ScrapeResult["jobs"] {
  const $ = cheerio.load(html);
  const jobs: ScrapeResult["jobs"] = [];

  // Greenhouse board layout: sections with .opening elements
  $(".opening").each((_, el) => {
    const anchor = $(el).find("a");
    const title = anchor.text().trim();
    const location = $(el).find(".location").text().trim();
    const href = anchor.attr("href");

    if (title) {
      const jobUrl = href?.startsWith("http")
        ? href
        : href
          ? `https://boards.greenhouse.io${href}`
          : sourceUrl;

      jobs.push({
        title,
        company: companyName,
        location: location || null,
        source: "company-page",
        sourceUrl: jobUrl,
        scrapedAt: new Date(),
        status: "open",
        skills: [],
      });
    }
  });

  // Fallback: some Greenhouse boards use different markup
  if (jobs.length === 0) {
    $("div[class*='opening'], tr[class*='job']").each((_, el) => {
      const anchor = $(el).find("a").first();
      const title = anchor.text().trim();
      const href = anchor.attr("href");

      if (title && title.length > 2) {
        jobs.push({
          title,
          company: companyName,
          source: "company-page",
          sourceUrl: href ?? sourceUrl,
          scrapedAt: new Date(),
          status: "open",
          skills: [],
        });
      }
    });
  }

  return jobs;
}
