'use server'

import { eq, and, desc } from 'drizzle-orm'
import { db, savedJobs, jobs, companies } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SavedJobListItem {
  id: string
  jobId: string
  savedAt: Date
  job: {
    title: string
    slug: string
    status: string
    location: string | null
    isRemote: boolean
    employmentType: string
    salaryMin: number | null
    salaryMax: number | null
    salaryCurrency: string
  }
  company: {
    name: string
  } | null
}

export interface SavedJobStats {
  total: number
  active: number
  expired: number
}

// ── Server Actions ────────────────────────────────────────────────────────────

export async function getSavedJobs(): Promise<{
  savedJobs: SavedJobListItem[]
  stats: SavedJobStats
}> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const rows = await db
    .select({
      savedJob: savedJobs,
      job: jobs,
      company: companies,
    })
    .from(savedJobs)
    .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(savedJobs.userId, session.user.id))
    .orderBy(desc(savedJobs.savedAt))

  const mapped: SavedJobListItem[] = rows.map((row) => ({
    id: row.savedJob.id,
    jobId: row.savedJob.jobId,
    savedAt: row.savedJob.savedAt,
    job: {
      title: row.job.title,
      slug: row.job.slug,
      status: row.job.status,
      location: row.job.location,
      isRemote: row.job.isRemote,
      employmentType: row.job.employmentType,
      salaryMin: row.job.salaryMin,
      salaryMax: row.job.salaryMax,
      salaryCurrency: row.job.salaryCurrency,
    },
    company: row.company ? { name: row.company.name } : null,
  }))

  const stats: SavedJobStats = {
    total: mapped.length,
    active: mapped.filter((s) => s.job.status === 'open').length,
    expired: mapped.filter(
      (s) => s.job.status === 'filled' || s.job.status === 'paused'
    ).length,
  }

  return { savedJobs: mapped, stats }
}

export async function toggleSaveJob(
  jobId: string
): Promise<{ saved: boolean }> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const existing = await db
    .select({ id: savedJobs.id })
    .from(savedJobs)
    .where(
      and(eq(savedJobs.userId, session.user.id), eq(savedJobs.jobId, jobId))
    )
    .limit(1)

  if (existing.length > 0) {
    await db
      .delete(savedJobs)
      .where(
        and(eq(savedJobs.userId, session.user.id), eq(savedJobs.jobId, jobId))
      )
    return { saved: false }
  }

  await db.insert(savedJobs).values({
    userId: session.user.id,
    jobId,
  })
  return { saved: true }
}

export async function getIsSaved(
  jobId: string
): Promise<{ saved: boolean }> {
  const session = await getSession()
  if (!session) {
    return { saved: false }
  }

  const existing = await db
    .select({ id: savedJobs.id })
    .from(savedJobs)
    .where(
      and(eq(savedJobs.userId, session.user.id), eq(savedJobs.jobId, jobId))
    )
    .limit(1)

  return { saved: existing.length > 0 }
}

export async function getSavedJobIds(): Promise<string[]> {
  const session = await getSession()
  if (!session) {
    return []
  }

  const rows = await db
    .select({ jobId: savedJobs.jobId })
    .from(savedJobs)
    .where(eq(savedJobs.userId, session.user.id))

  return rows.map((r) => r.jobId)
}
