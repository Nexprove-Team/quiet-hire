import { getConfig } from "./config.js";
import { runScraper } from "./orchestrator.js";
import type { ScraperOptions } from "./scrapers/base-scraper.js";

async function getScraperForPlatform(platform: string) {
  switch (platform) {
    case "linkedin": {
      const { LinkedInScraper } = await import("./scrapers/linkedin/index.js");
      return new LinkedInScraper();
    }
    case "twitter": {
      const { TwitterScraper } = await import("./scrapers/twitter/index.js");
      return new TwitterScraper();
    }
    case "company-page": {
      const { CompanyPageScraper } = await import(
        "./scrapers/company-page/index.js"
      );
      return new CompanyPageScraper();
    }
    default:
      console.error(
        `Unknown platform: "${platform}". Use: linkedin, twitter, company-page`
      );
      process.exit(1);
  }
}

function parseArgs(args: string[]) {
  const flagValue = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx >= 0 ? args[idx + 1] : undefined;
  };

  return {
    platform: flagValue("--platform"),
    query: flagValue("--query"),
    maxResults: flagValue("--max") ? parseInt(flagValue("--max")!, 10) : 50,
    dryRun: args.includes("--dry-run"),
  };
}

function printUsage() {
  console.log(`
QuietHire Scraper Bot

Usage:
  tsx src/index.ts --platform <platform> --query <search> [options]

Platforms:
  linkedin       Search recruiters via Proxycurl API
  twitter        Search hiring tweets via X API v2
  company-page   Scrape career pages (Greenhouse, Lever, etc.)

Options:
  --platform     Required. The platform to scrape.
  --query        Required. Search query or URL(s), comma-separated.
  --max <n>      Max results to collect (default: 50).
  --dry-run      Parse and validate without saving to database.

Examples:
  tsx src/index.ts --platform company-page --query "https://boards.greenhouse.io/stripe"
  tsx src/index.ts --platform linkedin --query "Stripe,Vercel" --max 20
  tsx src/index.ts --platform twitter --query "tech recruiter hiring" --dry-run
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.platform || !args.query) {
    printUsage();
    process.exit(args.platform || args.query ? 1 : 0);
  }

  // Validate config (will exit with error if env is invalid)
  getConfig();

  const scraper = await getScraperForPlatform(args.platform);
  const options: ScraperOptions = {
    query: args.query,
    maxResults: args.maxResults,
    dryRun: args.dryRun,
  };

  if (args.dryRun) {
    console.log("[DRY RUN] Results will not be saved to database.\n");
  }

  await runScraper(scraper, options);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
