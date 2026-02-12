import { tool } from "ai";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, candidateProfiles } from "@hackhyre/db";

export function createSaveCandidateProfileTool(userId: string) {
  return tool({
    description:
      "Save or update the candidate's profile to the database. Call this once you have gathered all the necessary information from the user and they have confirmed.",
    inputSchema: z.object({
      headline: z
        .string()
        .optional()
        .describe("Professional headline, e.g. 'Senior React Developer'"),
      bio: z
        .string()
        .optional()
        .describe("Short professional bio or summary"),
      skills: z
        .array(z.string())
        .optional()
        .describe("List of skills, e.g. ['React', 'TypeScript', 'Node.js']"),
      experienceYears: z
        .number()
        .int()
        .min(0)
        .max(50)
        .optional()
        .describe("Years of professional experience"),
      location: z
        .string()
        .optional()
        .describe("City, state/country, e.g. 'San Francisco, CA'"),
      isOpenToWork: z
        .boolean()
        .optional()
        .describe("Whether the candidate is actively looking for work"),
      linkedinUrl: z.string().optional().describe("LinkedIn profile URL"),
      githubUrl: z.string().optional().describe("GitHub profile URL"),
      portfolioUrl: z
        .string()
        .optional()
        .describe("Portfolio or personal website URL"),
    }),
    execute: async (input) => {
      const existing = await db
        .select({ id: candidateProfiles.id })
        .from(candidateProfiles)
        .where(eq(candidateProfiles.userId, userId))
        .limit(1);

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
            updatedAt: new Date(),
          })
          .where(eq(candidateProfiles.userId, userId));
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
        });
      }

      return { success: true, message: "Profile saved successfully." };
    },
  });
}
