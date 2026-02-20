import { generateText, Output } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

const resumeSchema = z.object({
  headline: z
    .string()
    .nullable()
    .describe('Professional headline derived from the resume'),
  bio: z
    .string()
    .nullable()
    .describe('Short professional summary from the resume'),
  skills: z
    .array(z.string())
    .describe('List of skills mentioned in the resume'),
  experienceYears: z
    .number()
    .int()
    .nullable()
    .describe('Estimated total years of professional experience'),
  location: z
    .string()
    .nullable()
    .describe('Location mentioned in the resume'),
})

const VALID_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return Response.json({ error: 'Missing file' }, { status: 400 })
  }

  if (!VALID_TYPES.includes(file.type)) {
    return Response.json(
      { error: 'Invalid file type. Please upload a PDF or Word document.' },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: 'File too large. Maximum size is 5MB.' },
      { status: 400 }
    )
  }

  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')

  const { output } = await generateText({
    model: google('gemini-2.5-flash'),
    output: Output.object({ schema: resumeSchema }),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'file',
            data: base64,
            mediaType: file.type,
          },
          {
            type: 'text',
            text: "Extract the candidate's profile information from this resume. Return their professional headline, a short bio/summary, list of skills, estimated years of experience, and location. Be accurate and only include information that is clearly stated in the document.",
          },
        ],
      },
    ],
  })

  return Response.json(output)
}
