import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { jobs } from "./jobs";

// ── Enums ──────────────────────────────────────────────────────────────────────

export const distributionChannelEnum = pgEnum("distribution_channel", [
  "hackhyre",
  "linkedin",
  "twitter",
  "company_page",
  "other",
]);

export const distributionStatusEnum = pgEnum("distribution_status", [
  "active",
  "removed",
]);

// ── Job Distributions ──────────────────────────────────────────────────────────

export const jobDistributions = pgTable("job_distributions", {
  id: uuid("id").primaryKey().defaultRandom(),

  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  channel: distributionChannelEnum("channel").notNull(),
  externalUrl: text("external_url"),

  postedAt: timestamp("posted_at").notNull().defaultNow(),
  postedBy: text("posted_by").references(() => user.id, {
    onDelete: "set null",
  }),
  status: distributionStatusEnum("status").notNull().default("active"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
