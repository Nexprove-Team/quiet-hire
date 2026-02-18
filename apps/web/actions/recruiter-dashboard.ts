'use server'

import { eq, and, desc, isNull } from 'drizzle-orm'
import { startOfDay, subDays, format, isEqual } from 'date-fns'
import { db, applications, jobs } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RecruiterDashboardData {
  stats: {
    totalJobs: number
    activeJobs: number
    totalApplications: number
    interviewingCount: number
  }
  trends: {
    totalJobs: string
    activeJobs: string
    totalApplications: string
    interviewing: string
  }
  chartData: { date: string; applications: number }[]
  recentJobs: {
    id: string
    title: string
    status: string
    applicationCount: number
    location: string | null
    createdAt: Date
  }[]
  recentApplications: {
    id: string
    candidateName: string
    candidateEmail: string
    candidateId: string | null
    jobTitle: string
    status: string
    relevanceScore: number | null
    createdAt: Date
  }[]
}

// ── Server Action ─────────────────────────────────────────────────────────────

export async function getRecruiterDashboard(): Promise<RecruiterDashboardData> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const recruiterId = session.user.id

  // 1. Fetch all recruiter's non-deleted jobs
  const allJobs = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.recruiterId, recruiterId), isNull(jobs.deletedAt)))
    .orderBy(desc(jobs.createdAt))

  // 2. Fetch all applications for those jobs
  const allApplications =
    allJobs.length > 0
      ? await db
          .select({
            application: applications,
            jobTitle: jobs.title,
          })
          .from(applications)
          .innerJoin(jobs, eq(applications.jobId, jobs.id))
          .where(
            and(eq(jobs.recruiterId, recruiterId), isNull(jobs.deletedAt))
          )
          .orderBy(desc(applications.createdAt))
      : []

  // 3. Compute stats
  const totalJobs = allJobs.length
  const activeJobs = allJobs.filter((j) => j.status === 'open').length
  const totalApplications = allApplications.length
  const interviewingCount = allApplications.filter(
    (r) => r.application.status === 'interviewing'
  ).length

  // 4. Compute trends (this week vs previous week)
  const today = startOfDay(new Date())
  const weekAgo = subDays(today, 7)

  const jobsThisWeek = allJobs.filter(
    (j) => new Date(j.createdAt) >= weekAgo
  ).length

  const appsThisWeek = allApplications.filter(
    (r) => new Date(r.application.createdAt) >= weekAgo
  ).length

  const activeJobsThisWeek = allJobs.filter(
    (j) => j.status === 'open' && new Date(j.createdAt) >= weekAgo
  ).length

  const trends = {
    totalJobs:
      jobsThisWeek > 0 ? `+${jobsThisWeek} this week` : 'No new this week',
    activeJobs:
      activeJobsThisWeek > 0
        ? `+${activeJobsThisWeek} this week`
        : `${activeJobs} active`,
    totalApplications:
      appsThisWeek > 0 ? `+${appsThisWeek} this week` : 'No new this week',
    interviewing:
      interviewingCount > 0
        ? `${interviewingCount} in progress`
        : 'None scheduled',
  }

  // 5. Build chart data (last 7 days)
  const chartData: { date: string; applications: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const day = subDays(today, i)
    const label = format(day, 'EEE')
    const dayCount = allApplications.filter((r) => {
      const appDay = startOfDay(new Date(r.application.createdAt))
      return isEqual(appDay, day)
    }).length
    chartData.push({ date: label, applications: dayCount })
  }

  // 6. Recent jobs (top 5) — compute application counts per job
  const appCountByJob = new Map<string, number>()
  for (const r of allApplications) {
    const jid = r.application.jobId
    appCountByJob.set(jid, (appCountByJob.get(jid) ?? 0) + 1)
  }

  const recentJobs = allJobs.slice(0, 5).map((j) => ({
    id: j.id,
    title: j.title,
    status: j.status,
    applicationCount: appCountByJob.get(j.id) ?? 0,
    location: j.location,
    createdAt: j.createdAt,
  }))

  // 7. Recent applications (top 6)
  const recentApplications = allApplications.slice(0, 6).map((r) => ({
    id: r.application.id,
    candidateName: r.application.candidateName,
    candidateEmail: r.application.candidateEmail,
    candidateId: r.application.candidateId,
    jobTitle: r.jobTitle,
    status: r.application.status,
    relevanceScore: r.application.relevanceScore,
    createdAt: r.application.createdAt,
  }))

  return {
    stats: { totalJobs, activeJobs, totalApplications, interviewingCount },
    trends,
    chartData,
    recentJobs,
    recentApplications,
  }
}
