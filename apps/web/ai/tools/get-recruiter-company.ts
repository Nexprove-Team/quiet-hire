import { tool } from 'ai'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db, companies } from '@hackhyre/db'

export function createGetRecruiterCompanyTool(userId: string) {
  return tool({
    description:
      "Look up the recruiter's company. Call this at the start of the job creation conversation to get the company details.",
    inputSchema: z.object({}),
    execute: async () => {
      const rows = await db
        .select({
          id: companies.id,
          name: companies.name,
          website: companies.website,
          logoUrl: companies.logoUrl,
        })
        .from(companies)
        .where(eq(companies.createdBy, userId))
        .limit(1)

      if (rows.length === 0) {
        return { found: false, company: null }
      }

      return { found: true, company: rows[0]! }
    },
  })
}
