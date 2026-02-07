import { eq, and } from "drizzle-orm";
import { getDB, closeDB } from "./db/index.js";
import { recruiters, jobListings, scrapeRuns } from "./db/schema.js";
import type { Scraper, ScraperOptions, ScrapeResult } from "./scrapers/base-scraper.js";
import { createLogger } from "./utils/logger.js";

const log = createLogger("orchestrator");

async function isDuplicateRecruiter(
  db: ReturnType<typeof getDB>,
  recruiter: ScrapeResult["recruiters"][number]
): Promise<boolean> {
  if (recruiter.linkedinUrl) {
    const existing = await db
      .select({ id: recruiters.id })
      .from(recruiters)
      .where(eq(recruiters.linkedinUrl, recruiter.linkedinUrl))
      .limit(1);
    if (existing.length > 0) return true;
  }

  if (recruiter.fullName && recruiter.company) {
    const existing = await db
      .select({ id: recruiters.id })
      .from(recruiters)
      .where(
        and(
          eq(recruiters.fullName, recruiter.fullName),
          eq(recruiters.company, recruiter.company)
        )
      )
      .limit(1);
    if (existing.length > 0) return true;
  }

  return false;
}

async function isDuplicateJob(
  db: ReturnType<typeof getDB>,
  job: ScrapeResult["jobs"][number]
): Promise<boolean> {
  if (job.sourceUrl) {
    const existing = await db
      .select({ id: jobListings.id })
      .from(jobListings)
      .where(eq(jobListings.sourceUrl, job.sourceUrl))
      .limit(1);
    if (existing.length > 0) return true;
  }
  return false;
}

export async function runScraper(
  scraper: Scraper,
  options: ScraperOptions
): Promise<void> {
  const db = getDB();
  const startTime = Date.now();

  const [run] = await db
    .insert(scrapeRuns)
    .values({
      platform: scraper.platform,
      status: "running",
      query: options.query,
      startedAt: new Date(),
    })
    .returning();

  if (!run) {
    throw new Error("Failed to create scrape run record");
  }

  log.info(`Starting ${scraper.name} scrape: "${options.query}"`);

  let totalFound = 0;
  let totalSaved = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  const errors: string[] = [];

  try {
    const result = await scraper.scrape(options);

    totalFound = result.recruiters.length + result.jobs.length;
    errors.push(...result.errors);
    totalErrors += result.errors.length;

    // Persist recruiters
    for (const recruiter of result.recruiters) {
      try {
        if (await isDuplicateRecruiter(db, recruiter)) {
          totalSkipped++;
          log.debug(`Skipped duplicate recruiter: ${recruiter.fullName}`);
          continue;
        }

        if (!options.dryRun) {
          await db.insert(recruiters).values(recruiter);
        }
        totalSaved++;
        log.info(`${options.dryRun ? "[DRY RUN] " : ""}Saved recruiter: ${recruiter.fullName} (${recruiter.company ?? "unknown"})`);
      } catch (err) {
        totalErrors++;
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Recruiter "${recruiter.fullName}": ${msg}`);
        log.error(`Failed to save recruiter "${recruiter.fullName}": ${msg}`);
      }
    }

    // Persist jobs
    for (const job of result.jobs) {
      try {
        if (await isDuplicateJob(db, job)) {
          totalSkipped++;
          log.debug(`Skipped duplicate job: ${job.title}`);
          continue;
        }

        if (!options.dryRun) {
          await db.insert(jobListings).values(job);
        }
        totalSaved++;
        log.info(`${options.dryRun ? "[DRY RUN] " : ""}Saved job: ${job.title} at ${job.company}`);
      } catch (err) {
        totalErrors++;
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Job "${job.title}": ${msg}`);
        log.error(`Failed to save job "${job.title}": ${msg}`);
      }
    }

    // Update scrape run
    const durationMs = Date.now() - startTime;
    await db
      .update(scrapeRuns)
      .set({
        status: totalErrors > 0 ? "partial" : "completed",
        totalFound,
        totalSaved,
        totalSkipped,
        totalErrors,
        errors,
        completedAt: new Date(),
        durationMs,
      })
      .where(eq(scrapeRuns.id, run.id));

    log.info(
      `Finished. Found=${totalFound} Saved=${totalSaved} Skipped=${totalSkipped} Errors=${totalErrors} Duration=${durationMs}ms`
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await db
      .update(scrapeRuns)
      .set({
        status: "failed",
        totalFound,
        totalSaved,
        totalSkipped,
        totalErrors: totalErrors + 1,
        errors: [...errors, msg],
        completedAt: new Date(),
        durationMs: Date.now() - startTime,
      })
      .where(eq(scrapeRuns.id, run.id));

    log.error(`Fatal error: ${msg}`);
    throw error;
  } finally {
    await scraper.shutdown();
    await closeDB();
  }
}
