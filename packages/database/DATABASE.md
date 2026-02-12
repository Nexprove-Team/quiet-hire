# HackHyre Database — Schema Reference & Usage Guide

## Overview

The `@hackhyre/db` package provides the complete database layer for HackHyre, a hiring workflow platform. It uses **Drizzle ORM** with **Neon PostgreSQL** (serverless) and **Better Auth** for authentication.

```
packages/database/
├── drizzle.config.ts          # Drizzle Kit configuration
├── drizzle/                   # Generated migrations (after db:generate)
├── src/
│   ├── env.ts                 # Type-safe env validation (t3-env + zod)
│   ├── client.ts              # Neon + Drizzle client instance
│   ├── auth.ts                # Better Auth server config
│   ├── index.ts               # Barrel export (db, env, all schema)
│   └── schema/
│       ├── index.ts           # Schema barrel export
│       ├── auth.ts            # user, session, account, verification
│       ├── companies.ts       # companies
│       ├── jobs.ts            # jobs + enums
│       ├── applications.ts    # applications + status enum
│       ├── candidate-profiles.ts
│       ├── talent-pool.ts
│       ├── interview-availability.ts
│       └── job-distributions.ts
└── DATABASE.md                # This file
```

---

## Environment Setup

### 1. Create a `.env` file

In the **monorepo root** (or in each app that uses `@hackhyre/db`), add:

```env
DATABASE_URL="postgresql://user:password@your-project.us-east-2.aws.neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="your-secret-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
```

Generate a secret:

```bash
openssl rand -base64 32
```

### 2. Get your Neon connection string

1. Go to [Neon Console](https://console.neon.tech)
2. Create a project (or select existing)
3. Copy the connection string from the dashboard
4. Paste into `DATABASE_URL`

---

## Schema Reference

### Authentication Tables (Better Auth)

These 4 tables are **required by Better Auth** and follow its exact schema conventions.

#### `user`

| Column           | Type              | Notes                                                     |
| ---------------- | ----------------- | --------------------------------------------------------- |
| `id`             | text PK           | Better Auth generates this                                |
| `name`           | text              | Required on signup                                        |
| `email`          | text (unique)     | Login identifier                                          |
| `email_verified` | boolean           | Default `false`                                           |
| `image`          | text              | Profile image URL                                         |
| `role`           | enum(`user_role`) | `recruiter` / `candidate` / `admin` — default `candidate` |
| `created_at`     | timestamp         | Auto-set                                                  |
| `updated_at`     | timestamp         | Auto-set                                                  |

#### `session`

| Column       | Type          | Notes          |
| ------------ | ------------- | -------------- |
| `id`         | text PK       |                |
| `expires_at` | timestamp     | Session expiry |
| `token`      | text (unique) | Session token  |
| `ip_address` | text          | Client IP      |
| `user_agent` | text          | Browser/client |
| `user_id`    | text FK→user  | Cascade delete |
| `created_at` | timestamp     |                |
| `updated_at` | timestamp     |                |

#### `account`

| Column                     | Type         | Notes                                 |
| -------------------------- | ------------ | ------------------------------------- |
| `id`                       | text PK      |                                       |
| `account_id`               | text         | Provider-specific ID                  |
| `provider_id`              | text         | `credential`, `google`, etc.          |
| `user_id`                  | text FK→user | Cascade delete                        |
| `access_token`             | text         | OAuth token                           |
| `refresh_token`            | text         | OAuth refresh                         |
| `id_token`                 | text         | OIDC ID token                         |
| `access_token_expires_at`  | timestamp    |                                       |
| `refresh_token_expires_at` | timestamp    |                                       |
| `scope`                    | text         | OAuth scopes                          |
| `password`                 | text         | Hashed password (email/password auth) |
| `created_at`               | timestamp    |                                       |
| `updated_at`               | timestamp    |                                       |

#### `verification`

| Column       | Type      | Notes          |
| ------------ | --------- | -------------- |
| `id`         | text PK   |                |
| `identifier` | text      | Email or phone |
| `value`      | text      | Token/code     |
| `expires_at` | timestamp | Token expiry   |
| `created_at` | timestamp |                |
| `updated_at` | timestamp |                |

### Domain Tables

#### `companies`

Stores company/organization info linked to recruiter accounts.

| Column        | Type         | Notes                 |
| ------------- | ------------ | --------------------- |
| `id`          | uuid PK      | Auto-generated        |
| `name`        | text         | Company name          |
| `website`     | text         | Nullable              |
| `logo_url`    | text         | Nullable              |
| `description` | text         | Nullable              |
| `created_by`  | text FK→user | Recruiter who created |
| `created_at`  | timestamp    |                       |
| `updated_at`  | timestamp    |                       |

#### `jobs`

Core table for job listings with HackHyre's transparency indicators.

| Column                  | Type               | Notes                                                 |
| ----------------------- | ------------------ | ----------------------------------------------------- |
| `id`                    | uuid PK            |                                                       |
| `title`                 | text               | Job title                                             |
| `slug`                  | text (unique)      | URL-friendly slug for public pages                    |
| `description`           | text               | Full job description (may be AI-generated)            |
| `company_id`            | uuid FK→companies  | Nullable                                              |
| `recruiter_id`          | text FK→user       | Job owner                                             |
| `status`                | enum(`job_status`) | `draft` / `open` / `paused` / `filled`                |
| `employment_type`       | enum               | `full_time` / `part_time` / `contract` / `internship` |
| `experience_level`      | enum               | `entry` / `mid` / `senior` / `lead` / `executive`     |
| `location`              | text               | Nullable                                              |
| `is_remote`             | boolean            | Default `false`                                       |
| `salary_min`            | integer            | Nullable                                              |
| `salary_max`            | integer            | Nullable                                              |
| `salary_currency`       | text               | Default `USD`                                         |
| `skills`                | jsonb              | Array of skill strings `["React", "Node.js"]`         |
| `first_published_at`    | timestamp          | When first made public (transparency)                 |
| `is_first_source`       | boolean            | Whether HackHyre was the first to publish             |
| `source`                | text               | `hackhyre` / `imported` / `admin`                     |
| `source_url`            | text               | Original URL for imported jobs                        |
| `shortlist_limit`       | integer            | Max candidates shown to recruiter (default 10)        |
| `show_linkedin`         | boolean            | Show recruiter's LinkedIn                             |
| `show_twitter`          | boolean            | Show recruiter's Twitter/X                            |
| `allow_direct_outreach` | boolean            | Allow candidates to contact directly                  |
| `created_at`            | timestamp          |                                                       |
| `updated_at`            | timestamp          |                                                       |

#### `applications`

Candidate applications with AI relevance scoring.

| Column               | Type                       | Notes                                                                           |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------- |
| `id`                 | uuid PK                    |                                                                                 |
| `job_id`             | uuid FK→jobs               | Cascade delete                                                                  |
| `candidate_id`       | text FK→user               | Nullable (guest applications)                                                   |
| `candidate_email`    | text                       | Always stored for contact                                                       |
| `candidate_name`     | text                       |                                                                                 |
| `resume_url`         | text                       | Uploaded resume                                                                 |
| `cover_letter`       | text                       | Optional                                                                        |
| `status`             | enum(`application_status`) | `pending` → `reviewing` → `shortlisted` → `interviewing` → `hired` / `rejected` |
| `relevance_score`    | real (float)               | AI-computed 0.0–1.0                                                             |
| `relevance_feedback` | text                       | Why relevant or not                                                             |
| `is_relevant`        | boolean                    | Pass/fail from instant check                                                    |
| `created_at`         | timestamp                  |                                                                                 |
| `updated_at`         | timestamp                  |                                                                                 |

#### `candidate_profiles`

Extended candidate info (one per user).

| Column             | Type                  | Notes                            |
| ------------------ | --------------------- | -------------------------------- |
| `id`               | uuid PK               |                                  |
| `user_id`          | text FK→user (unique) | One profile per user             |
| `headline`         | text                  | e.g., "Senior Frontend Engineer" |
| `bio`              | text                  |                                  |
| `resume_url`       | text                  |                                  |
| `portfolio_url`    | text                  |                                  |
| `linkedin_url`     | text                  |                                  |
| `twitter_url`      | text                  |                                  |
| `github_url`       | text                  |                                  |
| `skills`           | jsonb                 | `["TypeScript", "React"]`        |
| `experience_years` | integer               |                                  |
| `location`         | text                  |                                  |
| `is_open_to_work`  | boolean               | Default `true`                   |
| `created_at`       | timestamp             |                                  |
| `updated_at`       | timestamp             |                                  |

#### `talent_pool`

Consent-based candidate storage for rejected applicants who opt in.

| Column             | Type         | Notes                     |
| ------------------ | ------------ | ------------------------- |
| `id`               | uuid PK      |                           |
| `candidate_email`  | text         |                           |
| `candidate_name`   | text         |                           |
| `candidate_id`     | text FK→user | Nullable                  |
| `resume_url`       | text         |                           |
| `skills`           | jsonb        |                           |
| `consent_given`    | boolean      | GDPR compliance           |
| `consent_given_at` | timestamp    | When consent was recorded |
| `source_job_id`    | uuid FK→jobs | Which job led to opt-in   |
| `created_at`       | timestamp    |                           |

#### `interview_availability`

Recruiter's available time slots per job.

| Column         | Type         | Notes                  |
| -------------- | ------------ | ---------------------- |
| `id`           | uuid PK      |                        |
| `job_id`       | uuid FK→jobs | Cascade delete         |
| `recruiter_id` | text FK→user | Cascade delete         |
| `day_of_week`  | integer      | 0=Sunday, 6=Saturday   |
| `start_time`   | time         | e.g., `09:00`          |
| `end_time`     | time         | e.g., `17:00`          |
| `timezone`     | text         | Default `Africa/Lagos` |
| `is_active`    | boolean      | Default `true`         |
| `created_at`   | timestamp    |                        |

#### `job_distributions`

Tracks where each job has been distributed.

| Column         | Type                         | Notes                                                          |
| -------------- | ---------------------------- | -------------------------------------------------------------- |
| `id`           | uuid PK                      |                                                                |
| `job_id`       | uuid FK→jobs                 | Cascade delete                                                 |
| `channel`      | enum(`distribution_channel`) | `hackhyre` / `linkedin` / `twitter` / `company_page` / `other` |
| `external_url` | text                         | Link to external posting                                       |
| `posted_at`    | timestamp                    | When distributed                                               |
| `posted_by`    | text FK→user                 | Who posted                                                     |
| `status`       | enum(`distribution_status`)  | `active` / `removed`                                           |
| `created_at`   | timestamp                    |                                                                |

---

## Entity Relationships

```
user (Better Auth)
 ├── 1:N → session
 ├── 1:N → account
 ├── 1:1 → candidate_profiles
 ├── 1:N → companies (as creator)
 ├── 1:N → jobs (as recruiter)
 ├── 1:N → applications (as candidate)
 ├── 1:N → talent_pool (as candidate)
 ├── 1:N → interview_availability (as recruiter)
 └── 1:N → job_distributions (as poster)

companies
 └── 1:N → jobs

jobs
 ├── 1:N → applications
 ├── 1:N → interview_availability
 ├── 1:N → job_distributions
 └── 1:N → talent_pool (source)
```

---

## Database Migration Workflow

### Initial Setup (first time)

```bash
# From monorepo root — push schema directly to Neon
pnpm --filter @hackhyre/db db:push
```

This is the fastest way to get started. It pushes the schema directly to Neon without generating migration files.

### Production Workflow (recommended)

```bash
# 1. Generate migration SQL files
pnpm --filter @hackhyre/db db:generate

# 2. Review the generated SQL in packages/database/drizzle/

# 3. Apply migrations
pnpm --filter @hackhyre/db db:migrate
```

### Inspect Your Database

```bash
# Open Drizzle Studio (web-based DB browser)
pnpm --filter @hackhyre/db db:studio
```

### After Schema Changes

Whenever you modify files in `src/schema/`, re-run:

```bash
pnpm --filter @hackhyre/db db:generate
pnpm --filter @hackhyre/db db:migrate
```

---

## Usage from Apps

### Import the database client

```typescript
import { db } from "@hackhyre/db";
import { jobs, applications, user } from "@hackhyre/db/schema";
import { eq, desc } from "drizzle-orm";
```

### Query examples

**Get all open jobs:**

```typescript
const openJobs = await db
  .select()
  .from(jobs)
  .where(eq(jobs.status, "open"))
  .orderBy(desc(jobs.firstPublishedAt));
```

**Get a job by slug (for public page):**

```typescript
const [job] = await db
  .select()
  .from(jobs)
  .where(eq(jobs.slug, "senior-frontend-engineer"))
  .limit(1);
```

**Create a new application:**

```typescript
await db.insert(applications).values({
  jobId: "some-job-uuid",
  candidateEmail: "jane@example.com",
  candidateName: "Jane Doe",
  resumeUrl: "https://storage.example.com/resumes/jane.pdf",
  isRelevant: true,
  relevanceScore: 0.87,
  relevanceFeedback: "Strong match: 4/5 required skills present",
});
```

**Get transparency stats for a job:**

```typescript
import { count, eq, and } from "drizzle-orm";

const [stats] = await db
  .select({
    totalApplicants: count(),
  })
  .from(applications)
  .where(eq(applications.jobId, jobId));

const [reviewing] = await db
  .select({ count: count() })
  .from(applications)
  .where(
    and(eq(applications.jobId, jobId), eq(applications.status, "reviewing")),
  );

const [interviewing] = await db
  .select({ count: count() })
  .from(applications)
  .where(
    and(eq(applications.jobId, jobId), eq(applications.status, "interviewing")),
  );
```

**Add a candidate to the talent pool (after rejection opt-in):**

```typescript
await db.insert(talentPool).values({
  candidateEmail: "john@example.com",
  candidateName: "John Smith",
  candidateId: userId, // if they have an account
  skills: ["Python", "Django", "PostgreSQL"],
  consentGiven: true,
  consentGivenAt: new Date(),
  sourceJobId: rejectedJobId,
});
```

### Using Better Auth

**In your Next.js API route (e.g., `apps/web`):**

```typescript
import { auth } from "@hackhyre/db/auth";

// In your route handler
export const { GET, POST } = auth.handler;
```

**Client-side (in any app):**

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

// Usage in components
const { data: session } = authClient.useSession();
```

**Sign up with a role:**

```typescript
await authClient.signUp.email({
  email: "founder@startup.com",
  password: "secure-password",
  name: "Alex Founder",
  role: "recruiter", // custom field
});
```

---

## Enums Reference

| Enum Name              | Values                                                                     |
| ---------------------- | -------------------------------------------------------------------------- |
| `user_role`            | `recruiter`, `candidate`, `admin`                                          |
| `job_status`           | `draft`, `open`, `paused`, `filled`                                        |
| `employment_type`      | `full_time`, `part_time`, `contract`, `internship`                         |
| `experience_level`     | `entry`, `mid`, `senior`, `lead`, `executive`                              |
| `application_status`   | `pending`, `reviewing`, `shortlisted`, `interviewing`, `rejected`, `hired` |
| `distribution_channel` | `hackhyre`, `linkedin`, `twitter`, `company_page`, `other`                 |
| `distribution_status`  | `active`, `removed`                                                        |

---

## Package Exports

| Import Path           | What You Get                                         |
| --------------------- | ---------------------------------------------------- |
| `@hackhyre/db`        | `db` client, `env`, all tables & enums               |
| `@hackhyre/db/schema` | All tables & enums only                              |
| `@hackhyre/db/auth`   | Better Auth `auth` instance + `Session`/`User` types |
| `@hackhyre/db/client` | `db` client only                                     |

---

## TypeScript Types

Infer row types from any table:

```typescript
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { jobs, applications, user } from "@hackhyre/db/schema";

type Job = InferSelectModel<typeof jobs>;
type NewJob = InferInsertModel<typeof jobs>;
type Application = InferSelectModel<typeof applications>;
type User = InferSelectModel<typeof user>;
```

Or use Better Auth's inferred types:

```typescript
import type { Session, User } from "@hackhyre/db/auth";
```
