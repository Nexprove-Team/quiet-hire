import { generateText, Output } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

const relevanceSchema = z.object({
  matchPercentage: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('Overall match percentage between candidate and job (0-100)'),
  strengths: z
    .array(z.string())
    .describe(
      'List of 2-4 key strengths where the candidate matches the job requirements'
    ),
  gaps: z
    .array(z.string())
    .describe(
      'List of 1-3 gaps or areas where the candidate may fall short'
    ),
  recommendation: z
    .string()
    .describe(
      'A concise 1-2 sentence recommendation for the candidate about this role'
    ),
})

const inputSchema = z.object({
  resumeData: z.object({
    headline: z.string().nullable(),
    bio: z.string().nullable(),
    skills: z.array(z.string()),
    experienceYears: z.number().nullable(),
    location: z.string().nullable(),
  }),
  jobData: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    skills: z.array(z.string()),
    requirements: z.array(z.string()),
    experienceLevel: z.string(),
    location: z.string().nullable(),
    isRemote: z.boolean(),
    employmentType: z.string(),
    company: z.string().nullable(),
  }),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = inputSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request body', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { resumeData, jobData } = parsed.data

  const prompt = `You are an expert career advisor. Compare the candidate's profile against the job listing and provide a relevance assessment.

## Candidate Profile
- Headline: ${resumeData.headline ?? 'Not specified'}
- Summary: ${resumeData.bio ?? 'Not specified'}
- Skills: ${resumeData.skills.length > 0 ? resumeData.skills.join(', ') : 'None listed'}
- Years of Experience: ${resumeData.experienceYears ?? 'Unknown'}
- Location: ${resumeData.location ?? 'Not specified'}

## Job Listing
- Title: ${jobData.title}
- Company: ${jobData.company ?? 'Unknown'}
- Description: ${jobData.description}
- Required Skills: ${jobData.skills.length > 0 ? jobData.skills.join(', ') : 'None listed'}
- Requirements: ${jobData.requirements.length > 0 ? jobData.requirements.join('; ') : 'None listed'}
- Experience Level: ${jobData.experienceLevel}
- Location: ${jobData.location ?? 'Not specified'}${jobData.isRemote ? ' (Remote)' : ''}
- Employment Type: ${jobData.employmentType}

Provide an honest and helpful assessment. Be specific about which skills and qualifications match or are missing. The match percentage should reflect the actual alignment — don't inflate it. Keep strengths and gaps concise (one short sentence each).`

  const { output } = await generateText({
    model: google('gemini-2.5-flash'),
    output: Output.object({ schema: relevanceSchema }),
    messages: [{ role: 'user', content: prompt }],
  })

  return Response.json(output)
}
