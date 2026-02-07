import * as cheerio from "cheerio";
import type { ScrapeResult } from "../../base-scraper.js";

export function parseLeverJobs(
  html: string,
  companyName: string,
  sourceUrl: string
): ScrapeResult["jobs"] {
  const $ = cheerio.load(html);
  const jobs: ScrapeResult["jobs"] = [];

  // Lever job board layout: .posting elements
  $(".posting").each((_, el) => {
    const anchor = $(el).find("a.posting-title");
    const title = anchor.find("h5").text().trim();
    const location = $(el)
      .find(".posting-categories .sort-by-location, .location")
      .text()
      .trim();
    const department = $(el)
      .find(".posting-categories .sort-by-team, .department")
      .text()
      .trim();
    const href = anchor.attr("href");

    if (title) {
      jobs.push({
        title,
        company: companyName,
        location: location || null,
        description: department || null,
        source: "company-page",
        sourceUrl: href ?? sourceUrl,
        scrapedAt: new Date(),
        status: "open",
        skills: [],
      });
    }
  });

  return jobs;
}
