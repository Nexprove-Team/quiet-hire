'use server'

import { eq } from 'drizzle-orm'
import { db, user } from '@hackhyre/db'
import { tasks } from '@trigger.dev/sdk'
import { getSession } from '@/lib/auth-session'

export async function sendEmailToCandidate({
  candidateEmail,
  candidateName,
  subject,
  body,
}: {
  candidateEmail: string
  candidateName: string
  subject: string
  body: string
}) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const [recruiterRow] = await db
    .select({ companyName: user.companyName })
    .from(user)
    .where(eq(user.id, session.user.id))

  await tasks.trigger('send-recruiter-email', {
    candidateName,
    candidateEmail,
    recruiterName: session.user.name,
    recruiterEmail: session.user.email,
    companyName: recruiterRow?.companyName ?? 'HackHyre',
    subject,
    body,
  })

  return { success: true }
}
