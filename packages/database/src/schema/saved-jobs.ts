import { pgTable, text, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { jobs } from "./jobs";

export const savedJobs = pgTable(
  "saved_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),

    savedAt: timestamp("saved_at").notNull().defaultNow(),
  },
  (t) => [unique().on(t.userId, t.jobId)]
);
