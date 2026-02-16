import { tool } from 'ai'
import { z } from 'zod'

export function createMarkJobCreationCompleteTool() {
  return tool({
    description:
      'Signal that job creation is complete. Call this AFTER the job has been saved successfully. The client will detect this tool call and redirect the user to the jobs list.',
    inputSchema: z.object({
      jobId: z.string().describe('The ID of the created job'),
    }),
    execute: async ({ jobId }) => {
      return { complete: true, jobId }
    },
  })
}
