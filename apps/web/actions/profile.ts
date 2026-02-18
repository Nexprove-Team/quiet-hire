'use server'

import { eq } from 'drizzle-orm'
import {
  db,
  candidateProfiles,
  user as userTable,
} from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CandidateProfileData {
  name: string
  email: string
  image: string | null
  headline: string | null
  bio: string | null
  skills: string[]
  experienceYears: number | null
  location: string | null
  isOpenToWork: boolean
  linkedinUrl: string | null
  githubUrl: string | null
  portfolioUrl: string | null
  twitterUrl: string | null
  resumeUrl: string | null
}

export interface UpdateCandidateProfileInput {
  headline?: string
  bio?: string
  skills?: string[]
  experienceYears?: number
  location?: string
  isOpenToWork?: boolean
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  twitterUrl?: string
  resumeUrl?: string
}

// ── Server Actions ────────────────────────────────────────────────────────────

export async function getCandidateProfile(): Promise<CandidateProfileData | null> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const rows = await db
    .select({
      name: userTable.name,
      email: userTable.email,
      image: userTable.image,
      headline: candidateProfiles.headline,
      bio: candidateProfiles.bio,
      skills: candidateProfiles.skills,
      experienceYears: candidateProfiles.experienceYears,
      location: candidateProfiles.location,
      isOpenToWork: candidateProfiles.isOpenToWork,
      linkedinUrl: candidateProfiles.linkedinUrl,
      githubUrl: candidateProfiles.githubUrl,
      portfolioUrl: candidateProfiles.portfolioUrl,
      twitterUrl: candidateProfiles.twitterUrl,
      resumeUrl: candidateProfiles.resumeUrl,
    })
    .from(candidateProfiles)
    .innerJoin(userTable, eq(candidateProfiles.userId, userTable.id))
    .where(eq(candidateProfiles.userId, session.user.id))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  return {
    ...row,
    skills: row.skills ?? [],
  }
}

export async function updateCandidateProfile(
  input: UpdateCandidateProfileInput
): Promise<{ success: boolean }> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const userId = session.user.id

  const data = {
    headline: input.headline ?? null,
    bio: input.bio ?? null,
    skills: input.skills ?? [],
    experienceYears: input.experienceYears ?? null,
    location: input.location ?? null,
    isOpenToWork: input.isOpenToWork ?? true,
    linkedinUrl: input.linkedinUrl ?? null,
    githubUrl: input.githubUrl ?? null,
    portfolioUrl: input.portfolioUrl ?? null,
    twitterUrl: input.twitterUrl ?? null,
    resumeUrl: input.resumeUrl ?? null,
    updatedAt: new Date(),
  }

  const existing = await db
    .select({ id: candidateProfiles.id })
    .from(candidateProfiles)
    .where(eq(candidateProfiles.userId, userId))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(candidateProfiles)
      .set(data)
      .where(eq(candidateProfiles.userId, userId))
  } else {
    await db.insert(candidateProfiles).values({ userId, ...data })
  }

  return { success: true }
}
