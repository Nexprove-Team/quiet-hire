'use server'

import { eq, and, isNull, count } from 'drizzle-orm'
import { db, applications, jobs } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'

export interface SidebarCounts {
  activeJobs: number
  newApplications: number
}

export async function getSidebarCounts(): Promise<SidebarCounts> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const recruiterId = session.user.id

  // Active (open) jobs count
  const [jobRow] = await db
    .select({ count: count() })
    .from(jobs)
    .where(
      and(
        eq(jobs.recruiterId, recruiterId),
        eq(jobs.status, 'open'),
        isNull(jobs.deletedAt)
      )
    )

  // Unreviewed applications count (joined to recruiter's jobs)
  const [appRow] = await db
    .select({ count: count() })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(
      and(
        eq(jobs.recruiterId, recruiterId),
        isNull(jobs.deletedAt),
        eq(applications.status, 'not_reviewed')
      )
    )

  return {
    activeJobs: jobRow?.count ?? 0,
    newApplications: appRow?.count ?? 0,
  }
}
