import { z } from 'zod'
import { tool } from 'ai'
import { eq } from 'drizzle-orm'
import { db, user } from '@hackhyre/db'

export function createMarkOnboardingCompleteTool(userId: string) {
  return tool({
    description:
      'Signal that onboarding is complete. Call this AFTER you have successfully saved the profile. The client will detect this tool call and redirect the user to the dashboard.',
    inputSchema: z.object({}),
    execute: async () => {
      await db.update(user).set({ onboardingCompleted: true }).where(eq(user.id, userId))
      return { complete: true }
    },
  })
}
