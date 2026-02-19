import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { jobs } from "./jobs";
import { applications } from "./applications";

// ── Enums ──────────────────────────────────────────────────────────────────────

export const interviewStatusEnum = pgEnum("interview_status", [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
]);

export const interviewTypeEnum = pgEnum("interview_type", [
  "screening",
  "technical",
  "behavioral",
  "final",
]);

// ── Interviews ─────────────────────────────────────────────────────────────────

export const interviews = pgTable("interviews", {
  id: uuid("id").primaryKey().defaultRandom(),

  applicationId: uuid("application_id").references(() => applications.id, {
    onDelete: "set null",
  }),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  recruiterId: text("recruiter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  candidateId: text("candidate_id").references(() => user.id, {
    onDelete: "set null",
  }),

  // Denormalized candidate info (handles unregistered candidates)
  candidateEmail: text("candidate_email").notNull(),
  candidateName: text("candidate_name").notNull(),

  // Scheduling
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull().default(30),

  // Google Calendar integration
  meetLink: text("meet_link"),
  googleEventId: text("google_event_id"),

  // Interview details
  status: interviewStatusEnum("status").notNull().default("scheduled"),
  interviewType: interviewTypeEnum("interview_type")
    .notNull()
    .default("screening"),
  notes: text("notes"),
  feedback: text("feedback"),
  rating: integer("rating"), // 1-5

  // Reminder tracking
  reminderSent: boolean("reminder_sent").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
