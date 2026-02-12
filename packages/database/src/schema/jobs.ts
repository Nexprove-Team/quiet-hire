import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { companies } from "./companies";

// ── Enums ──────────────────────────────────────────────────────────────────────

export const jobStatusEnum = pgEnum("job_status", [
  "draft",
  "open",
  "paused",
  "filled",
]);

export const employmentTypeEnum = pgEnum("employment_type", [
  "full_time",
  "part_time",
  "contract",
  "internship",
]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "entry",
  "mid",
  "senior",
  "lead",
  "executive",
]);

// ── Jobs ───────────────────────────────────────────────────────────────────────

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),

  // Relations
  companyId: uuid("company_id").references(() => companies.id, {
    onDelete: "set null",
  }),
  recruiterId: text("recruiter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Job details
  status: jobStatusEnum("status").notNull().default("draft"),
  employmentType: employmentTypeEnum("employment_type")
    .notNull()
    .default("full_time"),
  experienceLevel: experienceLevelEnum("experience_level")
    .notNull()
    .default("mid"),
  location: text("location"),
  isRemote: boolean("is_remote").notNull().default(false),

  // Compensation
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryCurrency: text("salary_currency").notNull().default("USD"),

  // Structured job data (ERD §1.2)
  requirements: jsonb("requirements").$type<string[]>().default([]),
  responsibilities: jsonb("responsibilities").$type<string[]>().default([]),

  // Skills (searchable tags)
  skills: jsonb("skills").$type<string[]>().default([]),

  // Transparency indicators (key differentiator)
  firstPublishedAt: timestamp("first_published_at"),
  isFirstSource: boolean("is_first_source").notNull().default(true),

  // Source tracking (admin imports)
  source: text("source").notNull().default("hackhyre"),
  sourceUrl: text("source_url"),

  // Recruiter preferences
  shortlistLimit: integer("shortlist_limit").notNull().default(10),
  showLinkedin: boolean("show_linkedin").notNull().default(false),
  showTwitter: boolean("show_twitter").notNull().default(false),
  allowDirectOutreach: boolean("allow_direct_outreach")
    .notNull()
    .default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
