import { getConfig } from "../../config.js";
import { rateLimited } from "../../utils/rate-limiter.js";
import { withRetry } from "../../utils/retry.js";
import { createLogger } from "../../utils/logger.js";
import type { ScrapeResult } from "../base-scraper.js";

const log = createLogger("twitter");
const X_API_BASE = "https://api.twitter.com/2";

interface XSearchResponse {
  data?: Array<{
    id: string;
    text: string;
    author_id: string;
    created_at: string;
  }>;
  includes?: {
    users?: Array<{
      id: string;
      name: string;
      username: string;
      location?: string;
      description?: string;
      url?: string;
    }>;
  };
  meta?: {
    result_count: number;
    next_token?: string;
  };
}

const ROLE_PATTERNS = [
  /\b(technical recruiter)\b/i,
  /\b(talent acquisition\s*(?:manager|lead|specialist|partner)?)\b/i,
  /\b(hiring manager)\b/i,
  /\b(head of (?:people|talent|hr|recruiting))\b/i,
  /\b(hr\s*(?:manager|director|lead)?)\b/i,
  /\b(people ops)\b/i,
  /\b(recruiter)\b/i,
];

const JOB_TYPE_MAP: Record<string, string> = {
  engineer: "engineering",
  developer: "engineering",
  software: "engineering",
  frontend: "engineering",
  backend: "engineering",
  fullstack: "engineering",
  design: "design",
  designer: "design",
  product: "product",
  marketing: "marketing",
  sales: "sales",
  data: "data",
  devops: "engineering",
  sre: "engineering",
  ml: "data",
  ai: "data",
};

function extractRole(bio: string): string | null {
  for (const pattern of ROLE_PATTERNS) {
    const match = bio.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function extractJobTypes(bio: string): string[] {
  const types = new Set<string>();
  const lower = bio.toLowerCase();
  for (const [keyword, type] of Object.entries(JOB_TYPE_MAP)) {
    if (lower.includes(keyword)) types.add(type);
  }
  return [...types];
}

export async function searchHiringTweets(
  query: string,
  maxResults: number
): Promise<ScrapeResult["recruiters"]> {
  const config = getConfig();
  if (!config.TWITTER_BEARER_TOKEN) {
    throw new Error("TWITTER_BEARER_TOKEN required for Twitter scraping");
  }

  const searchQuery = `${query} (hiring OR "we're hiring" OR "join our team" OR "looking for" OR recruiter) -is:retweet`;

  const params = new URLSearchParams({
    query: searchQuery,
    max_results: String(Math.min(Math.max(maxResults, 10), 100)),
    "tweet.fields": "author_id,created_at",
    expansions: "author_id",
    "user.fields": "name,username,location,description,url",
  });

  log.info(`Searching X for: "${searchQuery}"`);

  const data = await withRetry(() =>
    rateLimited(async () => {
      const res = await fetch(
        `${X_API_BASE}/tweets/search/recent?${params}`,
        {
          headers: {
            Authorization: `Bearer ${config.TWITTER_BEARER_TOKEN}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`X API ${res.status}: ${await res.text()}`);
      }
      return res.json() as Promise<XSearchResponse>;
    })
  );

  const users = data.includes?.users ?? [];
  log.info(`Found ${users.length} unique users from ${data.meta?.result_count ?? 0} tweets`);

  // Deduplicate by username
  const seen = new Set<string>();
  const recruiters: ScrapeResult["recruiters"] = [];

  for (const user of users) {
    if (seen.has(user.username)) continue;
    seen.add(user.username);

    const bio = user.description ?? "";
    const role = extractRole(bio);

    recruiters.push({
      fullName: user.name,
      role,
      twitterHandle: `@${user.username}`,
      location: user.location ?? null,
      jobTypes: extractJobTypes(bio),
      source: "twitter",
      sourceUrl: `https://x.com/${user.username}`,
      scrapedAt: new Date(),
    });
  }

  return recruiters.slice(0, maxResults);
}
