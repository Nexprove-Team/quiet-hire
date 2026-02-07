import {
  pgTable,
  pgEnum,
  text,
  varchar,
  boolean,
  real,
  integer,
  timestamp,
  json,
  uniqueIndex,
  index,
  serial,
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────────

export const sourceEnum = pgEnum("source", [
  "linkedin",
  "twitter",
  "company-page",
  "manual",
]);

export const locationTypeEnum = pgEnum("location_type", [
  "remote",
  "hybrid",
  "onsite",
]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "entry",
  "mid",
  "senior",
  "lead",
  "executive",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "open",
  "paused",
  "filled",
]);

export const companySizeEnum = pgEnum("company_size", [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
]);

export const scrapeStatusEnum = pgEnum("scrape_status", [
  "running",
  "completed",
  "failed",
  "partial",
]);

export const scrapePlatformEnum = pgEnum("scrape_platform", [
  "linkedin",
  "twitter",
  "company-page",
]);

// ── Recruiters ─────────────────────────────────────────────

export const recruiters = pgTable(
  "recruiters",
  {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    role: varchar("role", { length: 255 }),
    company: varchar("company", { length: 255 }),
    email: varchar("email", { length: 255 }),
    linkedinUrl: text("linkedin_url"),
    twitterHandle: varchar("twitter_handle", { length: 100 }),
    location: varchar("location", { length: 255 }),
    jobTypes: json("job_types").$type<string[]>().default([]),
    source: sourceEnum("source").notNull(),
    sourceUrl: text("source_url"),
    scrapedAt: timestamp("scraped_at"),
    verified: boolean("verified").default(false).notNull(),
    confidence: real("confidence").default(0.5).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("recruiters_linkedin_url_idx").on(table.linkedinUrl),
    index("recruiters_full_name_company_idx").on(table.fullName, table.company),
    index("recruiters_company_idx").on(table.company),
  ]
);

// ── Companies ──────────────────────────────────────────────

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  website: text("website"),
  careersPageUrl: text("careers_page_url"),
  linkedinUrl: text("linkedin_url"),
  twitterHandle: varchar("twitter_handle", { length: 100 }),
  industry: varchar("industry", { length: 255 }),
  size: companySizeEnum("size"),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Job Listings ───────────────────────────────────────────

export const jobListings = pgTable(
  "job_listings",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    company: varchar("company", { length: 255 }).notNull(),
    description: text("description"),
    location: varchar("location", { length: 255 }),
    locationType: locationTypeEnum("location_type"),
    employmentType: employmentTypeEnum("employment_type"),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    salaryCurrency: varchar("salary_currency", { length: 10 }).default("USD"),
    skills: json("skills").$type<string[]>().default([]),
    experienceLevel: experienceLevelEnum("experience_level"),
    source: sourceEnum("source").notNull(),
    sourceUrl: text("source_url"),
    postedAt: timestamp("posted_at"),
    scrapedAt: timestamp("scraped_at"),
    status: jobStatusEnum("status").default("open").notNull(),
    recruiterId: integer("recruiter_id").references(() => recruiters.id),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("job_listings_source_url_idx").on(table.sourceUrl),
    index("job_listings_title_idx").on(table.title),
    index("job_listings_company_idx").on(table.company),
  ]
);

// ── Scrape Runs (audit trail) ──────────────────────────────

export const scrapeRuns = pgTable("scrape_runs", {
  id: serial("id").primaryKey(),
  platform: scrapePlatformEnum("platform").notNull(),
  status: scrapeStatusEnum("status").notNull(),
  query: text("query").notNull(),
  totalFound: integer("total_found").default(0).notNull(),
  totalSaved: integer("total_saved").default(0).notNull(),
  totalSkipped: integer("total_skipped").default(0).notNull(),
  totalErrors: integer("total_errors").default(0).notNull(),
  errors: json("errors").$type<string[]>().default([]),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Type exports ───────────────────────────────────────────

export type Recruiter = typeof recruiters.$inferSelect;
export type NewRecruiter = typeof recruiters.$inferInsert;

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;

export type JobListing = typeof jobListings.$inferSelect;
export type NewJobListing = typeof jobListings.$inferInsert;

export type ScrapeRun = typeof scrapeRuns.$inferSelect;
export type NewScrapeRun = typeof scrapeRuns.$inferInsert;
