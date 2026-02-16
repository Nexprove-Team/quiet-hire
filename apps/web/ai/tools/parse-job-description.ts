import { tool } from 'ai'
import { z } from 'zod'

export function createParseJobDescriptionTool() {
  return tool({
    description:
      'Parse and structure a raw job description or pasted text into well-defined fields. The AI model extracts the structured data and passes it through this tool.',
    inputSchema: z.object({
      title: z.string().describe('Job title'),
      description: z.string().describe('Full job description text'),
      employmentType: z
        .enum(['full_time', 'part_time', 'contract', 'internship'])
        .describe('Employment type'),
      experienceLevel: z
        .enum(['entry', 'mid', 'senior', 'lead', 'executive'])
        .describe('Required experience level'),
      location: z.string().optional().describe("Office location, e.g. 'San Francisco, CA'"),
      isRemote: z.boolean().describe('Whether the position is remote-friendly'),
      salaryMin: z.number().optional().describe('Minimum annual salary in USD'),
      salaryMax: z.number().optional().describe('Maximum annual salary in USD'),
      salaryCurrency: z.string().optional().default('USD').describe('Salary currency code'),
      requirements: z.array(z.string()).describe('List of job requirements'),
      responsibilities: z.array(z.string()).describe('List of job responsibilities'),
      skills: z.array(z.string()).describe('List of required/preferred skills'),
    }),
    execute: async (input) => {
      // Pass-through: the model's structured extraction IS the result
      return { parsed: true, job: input }
    },
  })
}
