import { tool } from 'ai'
import { z } from 'zod'
import { eq, asc } from 'drizzle-orm'
import { db, companies } from '@hackhyre/db'

export function createGetRecruiterCompaniesTool(userId: string) {
  return tool({
    description:
      "Look up all companies belonging to the recruiter. Call this at the start of the job creation conversation. The recruiter may have multiple companies (e.g., agency recruiters hiring for clients).",
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
        .orderBy(asc(companies.createdAt))

      if (rows.length === 0) {
        return { found: false, companies: [] }
      }

      return { found: true, companies: rows }
    },
  })
}
