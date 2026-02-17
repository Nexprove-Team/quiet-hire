import { streamText, stepCountIs, convertToModelMessages } from 'ai'
import { google } from '@ai-sdk/google'
import { getSession } from '@/lib/auth-session'
import { buildOnboardingSystemPrompt } from '@/ai/agents/onboarding-agent'
import { createCheckExistingProfileTool } from '@/ai/tools/check-existing-profile'
import { createSaveCandidateProfileTool } from '@/ai/tools/save-candidate-profile'
import { createMarkOnboardingCompleteTool } from '@/ai/tools/mark-onboarding-complete'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages } = await req.json()
  const userId = session.user.id
  const userName = session.user.name

  const message = await convertToModelMessages(messages)

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: buildOnboardingSystemPrompt(userName, null),
    messages: message,
    tools: {
      checkExistingProfile: createCheckExistingProfileTool(userId),
      saveCandidateProfile: createSaveCandidateProfileTool(userId),
      markOnboardingComplete: createMarkOnboardingCompleteTool(userId),
    },
    stopWhen: stepCountIs(10),
  })

  return result.toUIMessageStreamResponse()
}
