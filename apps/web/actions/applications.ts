'use server'

import { eq, desc } from 'drizzle-orm'
import { db, applications, jobs, companies } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CandidateApplicationListItem {
  id: string
  status: string
  relevanceScore: number | null
  appliedAt: Date
  coverLetter: string | null
  resumeUrl: string | null
  linkedinUrl: string | null
  job: {
    title: string
    description: string
    location: string | null
    isRemote: boolean
    employmentType: string
    experienceLevel: string
    salaryMin: number | null
    salaryMax: number | null
    salaryCurrency: string
    requirements: string[]
    responsibilities: string[]
    skills: string[]
  }
  company: {
    name: string
    website: string | null
    logoUrl: string | null
  } | null
}

export interface CandidateApplicationDetail extends CandidateApplicationListItem {
  matchAnalysis: {
    feedback: string
    strengths: string[]
    gaps: string[]
  } | null
}

export interface ApplicationStats {
  total: number
  active: number
  interviewing: number
  offers: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mapRow(row: {
  application: typeof applications.$inferSelect
  job: typeof jobs.$inferSelect
  company: typeof companies.$inferSelect | null
}): CandidateApplicationListItem {
  return {
    id: row.application.id,
    status: row.application.status,
    relevanceScore: row.application.relevanceScore,
    appliedAt: row.application.createdAt,
    coverLetter: row.application.coverLetter,
    resumeUrl: row.application.resumeUrl,
    linkedinUrl: row.application.linkedinUrl,
    job: {
      title: row.job.title,
      description: row.job.description,
      location: row.job.location,
      isRemote: row.job.isRemote,
      employmentType: row.job.employmentType,
      experienceLevel: row.job.experienceLevel,
      salaryMin: row.job.salaryMin,
      salaryMax: row.job.salaryMax,
      salaryCurrency: row.job.salaryCurrency,
      requirements: row.job.requirements ?? [],
      responsibilities: row.job.responsibilities ?? [],
      skills: row.job.skills ?? [],
    },
    company: row.company
      ? {
        name: row.company.name,
        website: row.company.website,
        logoUrl: row.company.logoUrl,
      }
      : null,
  }
}

// ── Server Actions ────────────────────────────────────────────────────────────

export async function getCandidateApplications(): Promise<{
  applications: CandidateApplicationListItem[]
  stats: ApplicationStats
}> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const rows = await db
    .select({
      application: applications,
      job: jobs,
      company: companies,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(applications.candidateId, session.user.id))
    .orderBy(desc(applications.createdAt))

  const mapped = rows.map(mapRow)

  const stats: ApplicationStats = {
    total: mapped.length,
    active: mapped.filter(
      (a) => a.status === 'not_reviewed' || a.status === 'under_review'
    ).length,
    interviewing: mapped.filter((a) => a.status === 'interviewing').length,
    offers: mapped.filter((a) => a.status === 'hired').length,
  }

  return { applications: mapped, stats }
}

export async function getCandidateApplication(
  id: string
): Promise<CandidateApplicationDetail | null> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const rows = await db
    .select({
      application: applications,
      job: jobs,
      company: companies,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(applications.id, id))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  // Authorization: ensure this application belongs to the current user
  if (row.application.candidateId !== session.user.id) return null

  return {
    ...mapRow(row),
    matchAnalysis: row.application.matchAnalysis ?? null,
  }
}



export async function getCandidateSidebarBadges(): Promise<
  Record<string, number>
> {
  const session = await getSession()
  if (!session) return {}

  const rows = await db
    .select({ status: applications.status })
    .from(applications)
    .where(eq(applications.candidateId, session.user.id))

  const activeCount = rows.filter(
    (r) =>
      r.status === 'not_reviewed' ||
      r.status === 'under_review' ||
      r.status === 'interviewing'
  ).length

  const badges: Record<string, number> = {}
  if (activeCount > 0) {
    badges['/applications'] = activeCount
  }

  return badges
}
