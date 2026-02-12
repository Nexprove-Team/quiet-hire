import { tool } from "ai";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, candidateProfiles } from "@hackhyre/db";

export function createCheckExistingProfileTool(userId: string) {
  return tool({
    description:
      "Check if the user already has a candidate profile in the database. Call this at the start of the conversation to see if we should update an existing profile or create a new one.",
    inputSchema: z.object({}),
    execute: async () => {
      const rows = await db
        .select()
        .from(candidateProfiles)
        .where(eq(candidateProfiles.userId, userId))
        .limit(1);

      if (rows.length === 0) {
        return { exists: false, profile: null };
      }

      const p = rows[0]!;
      return {
        exists: true,
        profile: {
          headline: p.headline,
          bio: p.bio,
          skills: p.skills,
          experienceYears: p.experienceYears,
          location: p.location,
          isOpenToWork: p.isOpenToWork,
          linkedinUrl: p.linkedinUrl,
          githubUrl: p.githubUrl,
          portfolioUrl: p.portfolioUrl,
          resumeUrl: p.resumeUrl,
        },
      };
    },
  });
}
