import {
  pgTable,
  text,
  timestamp,
  uuid,
  real,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { applications } from "./applications";

// ── Recruiter Relevance ─────────────────────────────────────────────────────────

export const recruiterRelevance = pgTable(
  "recruiter_relevance",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    recruiterId: text("recruiter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // AI relevance score (0–1)
    score: real("score").notNull(),

    // AI recommendation text
    feedback: text("feedback").notNull(),

    // Structured analysis
    strengths: jsonb("strengths").$type<string[]>().notNull().default([]),
    gaps: jsonb("gaps").$type<string[]>().notNull().default([]),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.applicationId, table.recruiterId)]
);
