'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db, candidateProfiles, companies, jobs, user as userTable } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'
import { generateSlug } from '@/lib/slug'

const COOKIE_NAME = 'hyre-onboarding-method'

export type OnboardingMethod = 'ai-chat' | 'resume' | 'manual'

export async function setOnboardingMethod(method: OnboardingMethod) {
  const jar = await cookies()
  jar.set(COOKIE_NAME, method, {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 86400,
    path: '/',
  })
}

export async function getOnboardingMethod(): Promise<OnboardingMethod | null> {
  const jar = await cookies()
  const value = jar.get(COOKIE_NAME)?.value
  if (value === 'ai-chat' || value === 'resume' || value === 'manual') {
    return value
  }
  return null
}

export async function clearOnboardingCookie() {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}

export interface SaveCandidateProfileInput {
  headline?: string
  bio?: string
  skills?: string[]
  experienceYears?: number
  location?: string
  isOpenToWork?: boolean
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  resumeUrl?: string
}

export async function saveCandidateProfile(input: SaveCandidateProfileInput) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const userId = session.user.id

  const existing = await db
    .select({ id: candidateProfiles.id })
    .from(candidateProfiles)
    .where(eq(candidateProfiles.userId, userId))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(candidateProfiles)
      .set({
        headline: input.headline ?? null,
        bio: input.bio ?? null,
        skills: input.skills ?? [],
        experienceYears: input.experienceYears ?? null,
        location: input.location ?? null,
        isOpenToWork: input.isOpenToWork ?? true,
        linkedinUrl: input.linkedinUrl ?? null,
        githubUrl: input.githubUrl ?? null,
        portfolioUrl: input.portfolioUrl ?? null,
        resumeUrl: input.resumeUrl ?? null,
        updatedAt: new Date(),
      })
      .where(eq(candidateProfiles.userId, userId))
  } else {
    await db.insert(candidateProfiles).values({
      userId,
      headline: input.headline ?? null,
      bio: input.bio ?? null,
      skills: input.skills ?? [],
      experienceYears: input.experienceYears ?? null,
      location: input.location ?? null,
      isOpenToWork: input.isOpenToWork ?? true,
      linkedinUrl: input.linkedinUrl ?? null,
      githubUrl: input.githubUrl ?? null,
      portfolioUrl: input.portfolioUrl ?? null,
      resumeUrl: input.resumeUrl ?? null,
    })
  }

  await db
    .update(userTable)
    .set({ onboardingCompleted: true, updatedAt: new Date() })
    .where(eq(userTable.id, userId))

  const jar = await cookies()
  jar.delete(COOKIE_NAME)

  redirect('/')
}

// ── Recruiter onboarding ────────────────────────────────────────────────────

export interface SaveRecruiterOnboardingInput {
  // Company
  companyName: string
  companyWebsite?: string
  companyLogoUrl?: string
  companyDescription?: string
  companyMission?: string

  // Recruiter links
  linkedinUrl?: string
  twitterUrl?: string

  // Optional first job
  jobTitle?: string
  jobDescription?: string
  jobEmploymentType?: string
  jobExperienceLevel?: string
  jobLocation?: string
  jobIsRemote?: boolean
}

export async function saveRecruiterOnboarding(input: SaveRecruiterOnboardingInput) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const userId = session.user.id

  // 1. Create company
  const description = [input.companyDescription, input.companyMission]
    .filter(Boolean)
    .join('\n\n')

  const [company] = await db
    .insert(companies)
    .values({
      name: input.companyName,
      website: input.companyWebsite ?? null,
      logoUrl: input.companyLogoUrl ?? null,
      description: description || null,
      createdBy: userId,
    })
    .returning({ id: companies.id })

  // 2. Create draft job if provided
  if (input.jobTitle && input.jobDescription) {
    await db.insert(jobs).values({
      title: input.jobTitle,
      slug: generateSlug(input.jobTitle),
      description: input.jobDescription,
      companyId: company.id,
      recruiterId: userId,
      status: 'draft',
      employmentType: (input.jobEmploymentType as 'full_time' | 'part_time' | 'contract' | 'internship') ?? 'full_time',
      experienceLevel: (input.jobExperienceLevel as 'entry' | 'mid' | 'senior' | 'lead' | 'executive') ?? 'mid',
      location: input.jobLocation ?? null,
      isRemote: input.jobIsRemote ?? false,
    })
  }

  // 3. Update user record
  await db
    .update(userTable)
    .set({
      linkedinUrl: input.linkedinUrl ?? null,
      twitterUrl: input.twitterUrl ?? null,
      onboardingCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(userTable.id, userId))

  redirect('/recuriter/dashboard')
}
