'use server'

import { eq, and, desc, isNull, inArray } from 'drizzle-orm'
import { db, jobs, applications, candidateProfiles, user } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'

// ── Types ──────────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | 'not_reviewed'
  | 'under_review'
  | 'interviewing'
  | 'rejected'
  | 'hired'

export interface RecruiterCandidateListItem {
  bestApplicationId: string
  name: string
  email: string
  headline: string | null
  location: string | null
  experienceYears: number | null
  skills: string[]
  bestMatchScore: number
  applicationCount: number
  bestStatus: ApplicationStatus
  bestMatchJobTitle: string | null
  latestApplicationDate: Date
}

export interface CandidateApplication {
  id: string
  jobTitle: string
  status: ApplicationStatus
  relevanceScore: number | null
  createdAt: Date
}

export interface RecruiterCandidateDetail {
  name: string
  email: string
  headline: string | null
  bio: string | null
  location: string | null
  experienceYears: number | null
  skills: string[]
  linkedinUrl: string | null
  githubUrl: string | null
  twitterUrl: string | null
  portfolioUrl: string | null
  resumeUrl: string | null
  image: string | null
  bestMatchScore: number
  matchAnalysis: {
    feedback: string
    strengths: string[]
    gaps: string[]
  } | null
  applications: CandidateApplication[]
  allJobSkills: string[]
}

// ── Status priority ────────────────────────────────────────────────────────────

const STATUS_PRIORITY: Record<ApplicationStatus, number> = {
  hired: 5,
  interviewing: 4,
  under_review: 3,
  not_reviewed: 2,
  rejected: 1,
}

// ── getRecruiterCandidates ─────────────────────────────────────────────────────

export async function getRecruiterCandidates(): Promise<
  RecruiterCandidateListItem[]
> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const recruiterId = session.user.id

  // 1. Fetch recruiter's non-deleted job IDs
  const recruiterJobs = await db
    .select({ id: jobs.id, title: jobs.title })
    .from(jobs)
    .where(and(eq(jobs.recruiterId, recruiterId), isNull(jobs.deletedAt)))

  if (recruiterJobs.length === 0) return []

  const jobIds = recruiterJobs.map((j) => j.id)
  const jobTitleMap = new Map(recruiterJobs.map((j) => [j.id, j.title]))

  // 2. Fetch all applications for those jobs
  const allApps = await db
    .select()
    .from(applications)
    .where(inArray(applications.jobId, jobIds))
    .orderBy(desc(applications.createdAt))

  if (allApps.length === 0) return []

  // 3. Group by candidateEmail
  const grouped = new Map<string, typeof allApps>()
  for (const app of allApps) {
    const key = app.candidateEmail.toLowerCase()
    const group = grouped.get(key) ?? []
    group.push(app)
    grouped.set(key, group)
  }

  // 4. Batch-fetch candidate profiles + users for registered candidates
  const registeredIds = [
    ...new Set(
      allApps
        .map((a) => a.candidateId)
        .filter((id): id is string => id !== null)
    ),
  ]

  const profileMap = new Map<
    string,
    {
      headline: string | null
      bio: string | null
      skills: string[]
      experienceYears: number | null
      location: string | null
    }
  >()
  const userMap = new Map<string, { name: string; image: string | null }>()

  if (registeredIds.length > 0) {
    const [profiles, users] = await Promise.all([
      db
        .select()
        .from(candidateProfiles)
        .where(inArray(candidateProfiles.userId, registeredIds)),
      db
        .select({ id: user.id, name: user.name, image: user.image })
        .from(user)
        .where(inArray(user.id, registeredIds)),
    ])

    for (const p of profiles) {
      profileMap.set(p.userId, {
        headline: p.headline,
        bio: p.bio,
        skills: (p.skills as string[]) ?? [],
        experienceYears: p.experienceYears,
        location: p.location,
      })
    }
    for (const u of users) {
      userMap.set(u.id, { name: u.name, image: u.image })
    }
  }

  // 5. Build candidate list items
  const result: RecruiterCandidateListItem[] = []

  for (const [, apps] of grouped) {
    const scores = apps
      .map((a) => a.relevanceScore)
      .filter((s): s is number => s !== null)
    const bestMatchScore = scores.length > 0 ? Math.max(...scores) : 0

    const bestApp = apps.reduce<(typeof apps)[0] | null>((best, a) => {
      if (a.relevanceScore === null) return best
      if (!best || best.relevanceScore === null) return a
      return a.relevanceScore > best.relevanceScore ? a : best
    }, null)

    const bestStatus = apps.reduce<ApplicationStatus>(
      (best, a) =>
        STATUS_PRIORITY[a.status as ApplicationStatus] >
        STATUS_PRIORITY[best]
          ? (a.status as ApplicationStatus)
          : best,
      'not_reviewed'
    )

    const latestDate = apps.reduce<Date>(
      (latest, a) => (a.createdAt > latest ? a.createdAt : latest),
      apps[0]!.createdAt
    )

    // Use first app's candidate info as base
    const firstApp = apps[0]!
    const candidateId = firstApp.candidateId
    const profile = candidateId ? profileMap.get(candidateId) : null
    const userInfo = candidateId ? userMap.get(candidateId) : null

    result.push({
      bestApplicationId: (bestApp ?? firstApp).id,
      name: userInfo?.name ?? firstApp.candidateName,
      email: firstApp.candidateEmail,
      headline: profile?.headline ?? null,
      location: profile?.location ?? null,
      experienceYears: profile?.experienceYears ?? null,
      skills: profile?.skills ?? [],
      bestMatchScore,
      applicationCount: apps.length,
      bestStatus,
      bestMatchJobTitle: bestApp
        ? (jobTitleMap.get(bestApp.jobId) ?? null)
        : null,
      latestApplicationDate: latestDate,
    })
  }

  // Sort by best match score descending by default
  result.sort((a, b) => b.bestMatchScore - a.bestMatchScore)

  return result
}

// ── getRecruiterCandidateDetail ────────────────────────────────────────────────

export async function getRecruiterCandidateDetail(
  applicationId: string
): Promise<RecruiterCandidateDetail | null> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const recruiterId = session.user.id

  // 1. Fetch the anchor application
  const [anchorApp] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1)

  if (!anchorApp) return null

  // 2. Verify the job belongs to this recruiter
  const [job] = await db
    .select()
    .from(jobs)
    .where(
      and(
        eq(jobs.id, anchorApp.jobId),
        eq(jobs.recruiterId, recruiterId),
        isNull(jobs.deletedAt)
      )
    )
    .limit(1)

  if (!job) return null

  // 3. Fetch recruiter's non-deleted job IDs
  const recruiterJobs = await db
    .select({ id: jobs.id, title: jobs.title, skills: jobs.skills })
    .from(jobs)
    .where(and(eq(jobs.recruiterId, recruiterId), isNull(jobs.deletedAt)))

  const jobIds = recruiterJobs.map((j) => j.id)
  const jobTitleMap = new Map(recruiterJobs.map((j) => [j.id, j.title]))

  // 4. Fetch all applications for this candidate email on recruiter's jobs
  const candidateEmail = anchorApp.candidateEmail.toLowerCase()
  const allApps = await db
    .select()
    .from(applications)
    .where(inArray(applications.jobId, jobIds))
    .orderBy(desc(applications.createdAt))

  const candidateApps = allApps.filter(
    (a) => a.candidateEmail.toLowerCase() === candidateEmail
  )

  // 5. Compute best match score & find best application
  const scores = candidateApps
    .map((a) => a.relevanceScore)
    .filter((s): s is number => s !== null)
  const bestMatchScore = scores.length > 0 ? Math.max(...scores) : 0

  const bestApp = candidateApps.reduce<(typeof candidateApps)[0] | null>(
    (best, a) => {
      if (a.relevanceScore === null) return best
      if (!best || best.relevanceScore === null) return a
      return a.relevanceScore > best.relevanceScore ? a : best
    },
    null
  )

  // 6. Get matchAnalysis from best-scoring application
  const matchAnalysis =
    (bestApp?.matchAnalysis as RecruiterCandidateDetail['matchAnalysis']) ??
    null

  // 7. If registered, fetch candidate profile + user
  const candidateId = anchorApp.candidateId
  let profile: {
    headline: string | null
    bio: string | null
    skills: string[]
    location: string | null
    experienceYears: number | null
    linkedinUrl: string | null
    githubUrl: string | null
    twitterUrl: string | null
    portfolioUrl: string | null
    resumeUrl: string | null
  } | null = null
  let userInfo: { name: string; image: string | null } | null = null

  if (candidateId) {
    const [profileRow, userRow] = await Promise.all([
      db
        .select()
        .from(candidateProfiles)
        .where(eq(candidateProfiles.userId, candidateId))
        .limit(1)
        .then((rows) => rows[0] ?? null),
      db
        .select({ id: user.id, name: user.name, image: user.image })
        .from(user)
        .where(eq(user.id, candidateId))
        .limit(1)
        .then((rows) => rows[0] ?? null),
    ])

    if (profileRow) {
      profile = {
        headline: profileRow.headline,
        bio: profileRow.bio,
        skills: (profileRow.skills as string[]) ?? [],
        location: profileRow.location,
        experienceYears: profileRow.experienceYears,
        linkedinUrl: profileRow.linkedinUrl,
        githubUrl: profileRow.githubUrl,
        twitterUrl: profileRow.twitterUrl,
        portfolioUrl: profileRow.portfolioUrl,
        resumeUrl: profileRow.resumeUrl,
      }
    }
    if (userRow) {
      userInfo = { name: userRow.name, image: userRow.image }
    }
  }

  // 8. Collect all recruiter's job skills
  const allJobSkills = [
    ...new Set(
      recruiterJobs.flatMap((j) =>
        ((j.skills as string[]) ?? []).map((s) => s.toLowerCase())
      )
    ),
  ]

  // 9. Build applications list
  const appsList: CandidateApplication[] = candidateApps.map((a) => ({
    id: a.id,
    jobTitle: jobTitleMap.get(a.jobId) ?? 'Unknown Job',
    status: a.status as ApplicationStatus,
    relevanceScore: a.relevanceScore,
    createdAt: a.createdAt,
  }))

  // Get resume URL from profile or best application
  const resumeUrl =
    profile?.resumeUrl ??
    (bestApp?.resumeUrl as string | null) ??
    candidateApps.find((a) => a.resumeUrl)?.resumeUrl ??
    null

  return {
    name: userInfo?.name ?? anchorApp.candidateName,
    email: anchorApp.candidateEmail,
    headline: profile?.headline ?? null,
    bio: profile?.bio ?? null,
    location: profile?.location ?? null,
    experienceYears: profile?.experienceYears ?? null,
    skills: profile?.skills ?? [],
    linkedinUrl: profile?.linkedinUrl ?? anchorApp.linkedinUrl ?? null,
    githubUrl: profile?.githubUrl ?? null,
    twitterUrl: profile?.twitterUrl ?? null,
    portfolioUrl: profile?.portfolioUrl ?? null,
    resumeUrl,
    image: userInfo?.image ?? null,
    bestMatchScore,
    matchAnalysis,
    applications: appsList,
    allJobSkills,
  }
}
