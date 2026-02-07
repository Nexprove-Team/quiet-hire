import { getConfig } from "../../config.js";
import { rateLimited } from "../../utils/rate-limiter.js";
import { withRetry } from "../../utils/retry.js";
import { createLogger } from "../../utils/logger.js";
import type { ScrapeResult } from "../base-scraper.js";

const log = createLogger("linkedin");
const PROXYCURL_BASE = "https://nubela.co/proxycurl/api";

interface ProxycurlSearchResult {
  results: Array<{
    linkedin_profile_url: string;
    profile: {
      full_name: string;
      headline: string;
      occupation: string;
      city: string;
      state: string;
      country: string;
      public_identifier: string;
    } | null;
  }>;
  next_page: string | null;
  total_result_count: number;
}

interface ProxycurlProfile {
  full_name: string;
  headline: string;
  occupation: string;
  city: string;
  state: string;
  country_full_name: string;
  linkedin_profile_url?: string;
  personal_emails: string[];
  experiences: Array<{
    company: string;
    title: string;
    location: string;
  }>;
}

export async function searchRecruiters(
  query: string,
  maxResults: number
): Promise<ScrapeResult["recruiters"]> {
  const config = getConfig();
  if (!config.PROXYCURL_API_KEY) {
    throw new Error("PROXYCURL_API_KEY required for LinkedIn scraping");
  }

  const params = new URLSearchParams({
    keyword_first_name: "",
    keyword_last_name: "",
    current_role_title: "recruiter",
    current_company_name: query,
    page_size: String(Math.min(maxResults, 10)),
  });

  log.info(`Searching Proxycurl for recruiters at "${query}"...`);

  const data = await withRetry(() =>
    rateLimited(async () => {
      const res = await fetch(
        `${PROXYCURL_BASE}/search/person/?${params}`,
        {
          headers: {
            Authorization: `Bearer ${config.PROXYCURL_API_KEY}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Proxycurl ${res.status}: ${await res.text()}`);
      }
      return res.json() as Promise<ProxycurlSearchResult>;
    })
  );

  log.info(`Found ${data.total_result_count} total results`);

  const recruiters: ScrapeResult["recruiters"] = [];

  for (const result of data.results.slice(0, maxResults)) {
    if (result.profile) {
      const p = result.profile;
      recruiters.push({
        fullName: p.full_name,
        role: p.occupation || p.headline,
        company: query,
        linkedinUrl: result.linkedin_profile_url,
        location: [p.city, p.state, p.country].filter(Boolean).join(", "),
        jobTypes: [],
        source: "linkedin",
        sourceUrl: result.linkedin_profile_url,
        scrapedAt: new Date(),
      });
    }
  }

  return recruiters;
}

export async function enrichProfile(
  linkedinUrl: string
): Promise<ScrapeResult["recruiters"][number] | null> {
  const config = getConfig();
  if (!config.PROXYCURL_API_KEY) return null;

  const params = new URLSearchParams({
    linkedin_profile_url: linkedinUrl,
    skills: "include",
  });

  const data = await withRetry(() =>
    rateLimited(async () => {
      const res = await fetch(
        `${PROXYCURL_BASE}/v2/linkedin?${params}`,
        {
          headers: {
            Authorization: `Bearer ${config.PROXYCURL_API_KEY}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Proxycurl ${res.status}: ${await res.text()}`);
      }
      return res.json() as Promise<ProxycurlProfile>;
    })
  );

  const currentJob = data.experiences?.[0];

  return {
    fullName: data.full_name,
    role: data.occupation || data.headline,
    company: currentJob?.company ?? null,
    email: data.personal_emails?.[0] ?? null,
    linkedinUrl,
    location: [data.city, data.state, data.country_full_name]
      .filter(Boolean)
      .join(", "),
    jobTypes: [],
    source: "linkedin",
    sourceUrl: linkedinUrl,
    scrapedAt: new Date(),
  };
}
