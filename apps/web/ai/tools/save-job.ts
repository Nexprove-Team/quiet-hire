import { tool } from 'ai'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db, jobs, companies } from '@hackhyre/db'
import { generateSlug } from '@/lib/slug'

export function createSaveJobTool(userId: string) {
  return tool({
    description:
      'Save a job listing to the database. Call this after the user has confirmed the job details. The job will be associated with the recruiter\'s company.',
    inputSchema: z.object({
      title: z.string().describe('Job title'),
      description: z.string().describe('Full job description'),
      employmentType: z
        .enum(['full_time', 'part_time', 'contract', 'internship'])
        .default('full_time'),
      experienceLevel: z
        .enum(['entry', 'mid', 'senior', 'lead', 'executive'])
        .default('mid'),
      location: z.string().optional().describe('Office location'),
      isRemote: z.boolean().default(false),
      salaryMin: z.number().optional(),
      salaryMax: z.number().optional(),
      salaryCurrency: z.string().default('USD'),
      requirements: z.array(z.string()).default([]),
      responsibilities: z.array(z.string()).default([]),
      skills: z.array(z.string()).default([]),
      status: z
        .enum(['draft', 'open'])
        .default('draft')
        .describe("'draft' to save for review, 'open' to publish immediately"),
    }),
    execute: async (input) => {
      const companyRows = await db
        .select({ id: companies.id })
        .from(companies)
        .where(eq(companies.createdBy, userId))
        .limit(1)

      if (!companyRows[0]) {
        return {
          success: false,
          message: 'No company found. The recruiter must complete onboarding first.',
          jobId: null,
          slug: null,
        }
      }

      const now = new Date()

      const [row] = await db
        .insert(jobs)
        .values({
          title: input.title,
          slug: generateSlug(input.title),
          description: input.description,
          companyId: companyRows[0].id,
          recruiterId: userId,
          status: input.status,
          employmentType: input.employmentType,
          experienceLevel: input.experienceLevel,
          location: input.location ?? null,
          isRemote: input.isRemote,
          salaryMin: input.salaryMin ?? null,
          salaryMax: input.salaryMax ?? null,
          salaryCurrency: input.salaryCurrency,
          requirements: input.requirements,
          responsibilities: input.responsibilities,
          skills: input.skills,
          firstPublishedAt: input.status === 'open' ? now : null,
        })
        .returning({ id: jobs.id, slug: jobs.slug })

      return {
        success: true,
        message: `Job "${input.title}" saved as ${input.status}.`,
        jobId: row!.id,
        slug: row!.slug,
      }
    },
  })
}
