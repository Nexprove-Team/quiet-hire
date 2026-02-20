'use server'

import { eq, desc, and } from 'drizzle-orm'
import { db, applications, jobs, companies, candidateProfiles } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'
import { generateText, Output } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

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



// ── Submit Application (guest-friendly) ──────────────────────────────────────

export interface SubmitApplicationInput {
  jobId: string
  candidateName: string
  candidateEmail: string
  resumeUrl?: string
  linkedinUrl?: string
  coverLetter?: string
  talentPoolOptIn?: boolean
}

export interface SubmitApplicationResult {
  success: boolean
  applicationId?: string
  error?: string
}

export async function submitApplication(
  input: SubmitApplicationInput
): Promise<SubmitApplicationResult> {
  // Session is optional — guest applicants allowed
  let candidateId: string | null = null
  try {
    const session = await getSession()
    candidateId = session?.user?.id ?? null
  } catch {
    // not logged in — proceed as guest
  }

  // Validate job exists and is open
  const [job] = await db
    .select({ id: jobs.id, status: jobs.status })
    .from(jobs)
    .where(eq(jobs.id, input.jobId))
    .limit(1)

  if (!job) {
    return { success: false, error: 'Job not found.' }
  }

  if (job.status !== 'open') {
    return {
      success: false,
      error: 'This position is no longer accepting applications.',
    }
  }

  // Check for duplicate application (same email + job)
  const [existing] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(
      and(
        eq(applications.jobId, input.jobId),
        eq(applications.candidateEmail, input.candidateEmail)
      )
    )
    .limit(1)

  if (existing) {
    return {
      success: false,
      error: 'You have already applied for this position.',
    }
  }

  const [inserted] = await db
    .insert(applications)
    .values({
      jobId: input.jobId,
      candidateId,
      candidateName: input.candidateName,
      candidateEmail: input.candidateEmail,
      resumeUrl: input.resumeUrl ?? null,
      linkedinUrl: input.linkedinUrl ?? null,
      coverLetter: input.coverLetter ?? null,
      talentPoolOptIn: input.talentPoolOptIn ?? false,
    })
    .returning({ id: applications.id })

  // Fire-and-forget match analysis generation
  generateMatchAnalysis(inserted!.id).catch(console.error)

  return { success: true, applicationId: inserted!.id }
}

// ── Match Analysis Generation ────────────────────────────────────────────────

const matchAnalysisSchema = z.object({
  matchPercentage: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('Overall match percentage between candidate and job (0-100)'),
  strengths: z
    .array(z.string())
    .describe(
      'List of 2-4 key strengths where the candidate matches the job requirements'
    ),
  gaps: z
    .array(z.string())
    .describe(
      'List of 1-3 gaps or areas where the candidate may fall short'
    ),
  recommendation: z
    .string()
    .describe(
      'A concise 1-2 sentence recommendation for the candidate about this role'
    ),
})

export async function generateMatchAnalysis(applicationId: string) {
  // Fetch application + job + company
  const rows = await db
    .select({
      application: applications,
      job: jobs,
      company: companies,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(applications.id, applicationId))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  // Skip if already generated
  if (row.application.matchAnalysis) return row.application.matchAnalysis

  // Fetch candidate profile if logged-in user
  let candidateData: {
    headline: string | null
    bio: string | null
    skills: string[]
    experienceYears: number | null
    location: string | null
  } = {
    headline: null,
    bio: null,
    skills: [],
    experienceYears: null,
    location: null,
  }

  if (row.application.candidateId) {
    const [profile] = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, row.application.candidateId))
      .limit(1)

    if (profile) {
      candidateData = {
        headline: profile.headline,
        bio: profile.bio,
        skills: profile.skills ?? [],
        experienceYears: profile.experienceYears,
        location: profile.location,
      }
    }
  }

  // Build candidate context — fall back to application fields for guests
  const candidateHeadline = candidateData.headline ?? row.application.candidateName
  const candidateBio = candidateData.bio ?? row.application.coverLetter ?? 'Not specified'
  const candidateSkills =
    candidateData.skills.length > 0
      ? candidateData.skills.join(', ')
      : 'None listed'

  const prompt = `You are an expert career advisor. Compare the candidate's profile against the job listing and provide a relevance assessment.

## Candidate Profile
- Headline: ${candidateHeadline}
- Summary: ${candidateBio}
- Skills: ${candidateSkills}
- Years of Experience: ${candidateData.experienceYears ?? 'Unknown'}
- Location: ${candidateData.location ?? 'Not specified'}

## Job Listing
- Title: ${row.job.title}
- Company: ${row.company?.name ?? 'Unknown'}
- Description: ${row.job.description}
- Required Skills: ${(row.job.skills ?? []).length > 0 ? (row.job.skills ?? []).join(', ') : 'None listed'}
- Requirements: ${(row.job.requirements ?? []).length > 0 ? (row.job.requirements ?? []).join('; ') : 'None listed'}
- Experience Level: ${row.job.experienceLevel}
- Location: ${row.job.location ?? 'Not specified'}${row.job.isRemote ? ' (Remote)' : ''}
- Employment Type: ${row.job.employmentType}

Provide an honest and helpful assessment. Be specific about which skills and qualifications match or are missing. The match percentage should reflect the actual alignment — don't inflate it. Keep strengths and gaps concise (one short sentence each).`

  const { output } = await generateText({
    model: google('gemini-2.5-flash'),
    output: Output.object({ schema: matchAnalysisSchema }),
    messages: [{ role: 'user', content: prompt }],
  })

  if (!output) return null

  const analysisData = {
    feedback: output.recommendation,
    strengths: output.strengths,
    gaps: output.gaps,
  }

  // Persist to DB
  await db
    .update(applications)
    .set({
      matchAnalysis: analysisData,
      relevanceScore: output.matchPercentage,
      relevanceFeedback: output.recommendation,
    })
    .where(eq(applications.id, applicationId))

  return analysisData
}

// ── Has Applied Check ────────────────────────────────────────────────────────

export async function hasAppliedToJob(jobId: string): Promise<boolean> {
  const session = await getSession()
  if (!session) return false

  const [row] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(
      and(
        eq(applications.jobId, jobId),
        eq(applications.candidateId, session.user.id)
      )
    )
    .limit(1)

  return !!row
}

// ── Sidebar Badges ───────────────────────────────────────────────────────────

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
