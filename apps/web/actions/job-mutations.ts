'use server'

import { eq, and, asc, isNull } from 'drizzle-orm'
import { db, jobs, companies } from '@hackhyre/db'
import { getSession } from '@/lib/auth-session'
import { generateSlug } from '@/lib/slug'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CreateJobInput {
  title: string
  description: string
  companyId?: string
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'internship'
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
  location?: string
  isRemote?: boolean
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  requirements?: string[]
  responsibilities?: string[]
  skills?: string[]
  status?: 'draft' | 'open'
}

export interface UpdateJobInput {
  id: string
  title?: string
  description?: string
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'internship'
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
  location?: string | null
  isRemote?: boolean
  salaryMin?: number | null
  salaryMax?: number | null
  salaryCurrency?: string
  requirements?: string[]
  responsibilities?: string[]
  skills?: string[]
  status?: 'draft' | 'open' | 'paused' | 'filled'
}

// ── Helpers ────────────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  return session.user.id
}

// ── getRecruiterCompanies ──────────────────────────────────────────────────────

export async function getRecruiterCompanies() {
  const userId = await requireAuth()

  return db
    .select({
      id: companies.id,
      name: companies.name,
      website: companies.website,
      logoUrl: companies.logoUrl,
    })
    .from(companies)
    .where(eq(companies.createdBy, userId))
    .orderBy(asc(companies.createdAt))
}

// ── createCompany ─────────────────────────────────────────────────────────────

export async function createCompany(input: {
  name: string
  website?: string
  description?: string
}) {
  const userId = await requireAuth()

  const [row] = await db
    .insert(companies)
    .values({
      name: input.name,
      website: input.website ?? null,
      description: input.description ?? null,
      createdBy: userId,
    })
    .returning({
      id: companies.id,
      name: companies.name,
      website: companies.website,
      logoUrl: companies.logoUrl,
    })

  return row!
}

// ── createJob ──────────────────────────────────────────────────────────────────

export async function createJob(input: CreateJobInput) {
  const userId = await requireAuth()

  let companyId = input.companyId

  if (companyId) {
    // Verify the recruiter owns this company
    const owned = await db
      .select({ id: companies.id })
      .from(companies)
      .where(and(eq(companies.id, companyId), eq(companies.createdBy, userId)))
      .limit(1)

    if (!owned[0]) {
      throw new Error('Company not found or not owned by you.')
    }
  } else {
    // Fall back to recruiter's first company
    const rows = await db
      .select({ id: companies.id })
      .from(companies)
      .where(eq(companies.createdBy, userId))
      .orderBy(asc(companies.createdAt))
      .limit(1)

    if (!rows[0]) {
      throw new Error('No company found. Please complete onboarding first.')
    }
    companyId = rows[0].id
  }

  const status = input.status ?? 'draft'
  const now = new Date()

  const [row] = await db
    .insert(jobs)
    .values({
      title: input.title,
      slug: generateSlug(input.title),
      description: input.description,
      companyId,
      recruiterId: userId,
      status,
      employmentType: input.employmentType ?? 'full_time',
      experienceLevel: input.experienceLevel ?? 'mid',
      location: input.location ?? null,
      isRemote: input.isRemote ?? false,
      salaryMin: input.salaryMin ?? null,
      salaryMax: input.salaryMax ?? null,
      salaryCurrency: input.salaryCurrency ?? 'USD',
      requirements: input.requirements ?? [],
      responsibilities: input.responsibilities ?? [],
      skills: input.skills ?? [],
      firstPublishedAt: status === 'open' ? now : null,
    })
    .returning({ id: jobs.id, slug: jobs.slug })

  return row!
}

// ── updateJob ──────────────────────────────────────────────────────────────────

export async function updateJob(input: UpdateJobInput) {
  const userId = await requireAuth()

  // Verify ownership
  const existing = await db
    .select({ id: jobs.id, recruiterId: jobs.recruiterId, status: jobs.status, firstPublishedAt: jobs.firstPublishedAt })
    .from(jobs)
    .where(and(eq(jobs.id, input.id), isNull(jobs.deletedAt)))
    .limit(1)

  if (!existing[0]) throw new Error('Job not found')
  if (existing[0].recruiterId !== userId) throw new Error('Forbidden')

  const { id, ...fields } = input
  const updates: Record<string, unknown> = { ...fields, updatedAt: new Date() }

  // Regenerate slug if title changed
  if (fields.title) {
    updates.slug = generateSlug(fields.title)
  }

  // Set firstPublishedAt on first publish
  if (fields.status === 'open' && !existing[0].firstPublishedAt) {
    updates.firstPublishedAt = new Date()
  }

  await db.update(jobs).set(updates).where(eq(jobs.id, id))

  return { id }
}

// ── deleteJob (soft delete) ────────────────────────────────────────────────────

export async function deleteJob(jobId: string) {
  const userId = await requireAuth()

  const existing = await db
    .select({ id: jobs.id, recruiterId: jobs.recruiterId })
    .from(jobs)
    .where(and(eq(jobs.id, jobId), isNull(jobs.deletedAt)))
    .limit(1)

  if (!existing[0]) throw new Error('Job not found')
  if (existing[0].recruiterId !== userId) throw new Error('Forbidden')

  await db
    .update(jobs)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(jobs.id, jobId))

  return { id: jobId }
}
