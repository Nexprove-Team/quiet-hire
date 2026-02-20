'use server'

import { eq, desc, ilike, gte, lte, and, or, sql, count } from 'drizzle-orm'
import { db, jobs, companies } from '@hackhyre/db'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PublicJobListItem {
  id: string
  title: string
  slug: string
  description: string
  location: string | null
  isRemote: boolean
  employmentType: string
  experienceLevel: string
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  skills: string[]
  requirements: string[]
  responsibilities: string[]
  createdAt: Date
  updatedAt: Date
  company: {
    id: string
    name: string
    logoUrl: string | null
  } | null
}

export interface TopCompany {
  id: string
  name: string
  logoUrl: string | null
  jobCount: number
}

export interface JobFilters {
  q?: string
  location?: string
  experience?: string
  salaryMin?: number
  salaryMax?: number
  recruiter?: string
  sort?: 'updated' | 'salary-high' | 'salary-low'
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mapRow(row: {
  job: typeof jobs.$inferSelect
  company: typeof companies.$inferSelect | null
}): PublicJobListItem {
  return {
    id: row.job.id,
    title: row.job.title,
    slug: row.job.slug,
    description: row.job.description,
    location: row.job.location,
    isRemote: row.job.isRemote,
    employmentType: row.job.employmentType,
    experienceLevel: row.job.experienceLevel,
    salaryMin: row.job.salaryMin,
    salaryMax: row.job.salaryMax,
    salaryCurrency: row.job.salaryCurrency,
    skills: row.job.skills ?? [],
    requirements: row.job.requirements ?? [],
    responsibilities: row.job.responsibilities ?? [],
    createdAt: row.job.createdAt,
    updatedAt: row.job.updatedAt,
    company: row.company
      ? {
          id: row.company.id,
          name: row.company.name,
          logoUrl: row.company.logoUrl,
        }
      : null,
  }
}

// ── Server Actions ────────────────────────────────────────────────────────────

export async function getPublicJobs(
  filters: JobFilters = {}
): Promise<PublicJobListItem[]> {
  const conditions = [eq(jobs.status, 'open')]

  // Full-text search with weighted tsvector + company name ILIKE fallback
  const searchVector = sql`(
    setweight(to_tsvector('english', coalesce(${jobs.title}, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(${jobs.description}, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(${jobs.skills}::text, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(${jobs.requirements}::text, '')), 'C')
  )`
  let tsquery: ReturnType<typeof sql> | null = null

  if (filters.q?.trim()) {
    tsquery = sql`websearch_to_tsquery('english', ${filters.q.trim()})`
    conditions.push(
      or(
        sql`${searchVector} @@ ${tsquery}`,
        ilike(companies.name, `%${filters.q.trim()}%`)
      )!
    )
  }

  // Location type filter
  if (filters.location && filters.location !== 'any') {
    if (filters.location === 'remote') {
      conditions.push(eq(jobs.isRemote, true))
    } else if (filters.location === 'onsite') {
      conditions.push(eq(jobs.isRemote, false))
    } else if (filters.location === 'hybrid') {
      conditions.push(eq(jobs.isRemote, true))
      conditions.push(sql`${jobs.location} IS NOT NULL`)
    }
  }

  // Experience level filter
  if (filters.experience && filters.experience !== 'any') {
    conditions.push(
      eq(
        jobs.experienceLevel,
        filters.experience as
          | 'entry'
          | 'mid'
          | 'senior'
          | 'lead'
          | 'executive'
      )
    )
  }

  // Salary range filter
  if (filters.salaryMin != null) {
    conditions.push(gte(jobs.salaryMin, filters.salaryMin))
  }
  if (filters.salaryMax != null) {
    conditions.push(lte(jobs.salaryMax, filters.salaryMax))
  }

  // Recruiter (company name) filter
  if (filters.recruiter) {
    conditions.push(eq(companies.name, filters.recruiter))
  }

  // Sort — relevance-rank when searching, otherwise by updatedAt
  let orderBy
  switch (filters.sort) {
    case 'salary-high':
      orderBy = desc(jobs.salaryMax)
      break
    case 'salary-low':
      orderBy = sql`${jobs.salaryMin} ASC NULLS LAST`
      break
    default:
      if (tsquery) {
        orderBy = sql`ts_rank(${searchVector}, ${tsquery}) DESC`
      } else {
        orderBy = desc(jobs.updatedAt)
      }
  }

  const rows = await db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(and(...conditions))
    .orderBy(orderBy)

  return rows.map(mapRow)
}

export async function getJobById(
  id: string
): Promise<PublicJobListItem | null> {
  const rows = await db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.id, id))
    .limit(1)

  const row = rows[0]
  if (!row) return null
  return mapRow(row)
}

export async function getCompanyJobs(
  companyName: string
): Promise<PublicJobListItem[]> {
  const rows = await db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(and(eq(jobs.status, 'open'), eq(companies.name, companyName)))
    .orderBy(desc(jobs.updatedAt))

  return rows.map(mapRow)
}

export async function getFeaturedJobs(): Promise<PublicJobListItem[]> {
  const rows = await db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.status, 'open'))
    .orderBy(desc(jobs.salaryMax), desc(jobs.createdAt))
    .limit(5)

  return rows.map(mapRow)
}

export interface CompanyProfile {
  id: string
  name: string
  description: string | null
  website: string | null
  logoUrl: string | null
  createdAt: Date
  jobCount: number
}

export async function getCompanyByName(
  name: string
): Promise<CompanyProfile | null> {
  const rows = await db
    .select({
      id: companies.id,
      name: companies.name,
      description: companies.description,
      website: companies.website,
      logoUrl: companies.logoUrl,
      createdAt: companies.createdAt,
      jobCount: count(jobs.id),
    })
    .from(companies)
    .leftJoin(
      jobs,
      and(eq(jobs.companyId, companies.id), eq(jobs.status, 'open'))
    )
    .where(eq(companies.name, name))
    .groupBy(
      companies.id,
      companies.name,
      companies.description,
      companies.website,
      companies.logoUrl,
      companies.createdAt
    )
    .limit(1)

  const row = rows[0]
  if (!row) return null
  return { ...row, jobCount: Number(row.jobCount) }
}

export async function getTopCompanies(): Promise<TopCompany[]> {
  const rows = await db
    .select({
      id: companies.id,
      name: companies.name,
      logoUrl: companies.logoUrl,
      jobCount: count(jobs.id),
    })
    .from(companies)
    .innerJoin(jobs, and(eq(jobs.companyId, companies.id), eq(jobs.status, 'open')))
    .groupBy(companies.id, companies.name, companies.logoUrl)
    .orderBy(desc(count(jobs.id)))
    .limit(6)

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    logoUrl: r.logoUrl,
    jobCount: Number(r.jobCount),
  }))
}
