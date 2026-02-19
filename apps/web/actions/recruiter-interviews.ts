'use server'

import { eq, and, desc, isNull, inArray } from 'drizzle-orm'
import { db, jobs, interviews, user } from '@hackhyre/db'
import { tasks } from '@trigger.dev/sdk'
import { getSession } from '@/lib/auth-session'
import {
  createCalendarEventWithMeet,
  deleteCalendarEvent,
  updateCalendarEvent,
} from '@/lib/google-calendar'

// ── Types ────────────────────────────────────────────────────────────

export type InterviewStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type InterviewType = 'screening' | 'technical' | 'behavioral' | 'final'

export interface RecruiterInterview {
  id: string
  applicationId: string | null
  jobId: string
  jobTitle: string
  candidateId: string | null
  candidateName: string
  candidateEmail: string
  scheduledAt: Date
  duration: number
  meetLink: string | null
  googleEventId: string | null
  status: InterviewStatus
  interviewType: InterviewType
  notes: string | null
  feedback: string | null
  rating: number | null
  reminderSent: boolean
  createdAt: Date
  updatedAt: Date
}

// ── Queries ──────────────────────────────────────────────────────────

export async function getRecruiterInterviews(): Promise<
  RecruiterInterview[]
> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const recruiterId = session.user.id

  // Fetch all interviews for this recruiter
  const allInterviews = await db
    .select()
    .from(interviews)
    .where(eq(interviews.recruiterId, recruiterId))
    .orderBy(desc(interviews.scheduledAt))

  if (allInterviews.length === 0) return []

  // Batch-fetch job titles
  const jobIds = [...new Set(allInterviews.map((i) => i.jobId))]
  const jobRows = await db
    .select({ id: jobs.id, title: jobs.title })
    .from(jobs)
    .where(inArray(jobs.id, jobIds))

  const jobTitleMap = new Map(jobRows.map((j) => [j.id, j.title]))

  return allInterviews.map((i) => ({
    id: i.id,
    applicationId: i.applicationId,
    jobId: i.jobId,
    jobTitle: jobTitleMap.get(i.jobId) ?? 'Unknown Job',
    candidateId: i.candidateId,
    candidateName: i.candidateName,
    candidateEmail: i.candidateEmail,
    scheduledAt: i.scheduledAt,
    duration: i.duration,
    meetLink: i.meetLink,
    googleEventId: i.googleEventId,
    status: i.status as InterviewStatus,
    interviewType: i.interviewType as InterviewType,
    notes: i.notes,
    feedback: i.feedback,
    rating: i.rating,
    reminderSent: i.reminderSent,
    createdAt: i.createdAt,
    updatedAt: i.updatedAt,
  }))
}

// ── Schedule Interview ───────────────────────────────────────────────

export interface ScheduleInterviewInput {
  jobId: string
  applicationId?: string
  candidateId?: string
  candidateName: string
  candidateEmail: string
  scheduledAt: string // ISO string
  duration: number
  interviewType: InterviewType
  notes?: string
}

export async function scheduleInterview(
  input: ScheduleInterviewInput
): Promise<RecruiterInterview> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const recruiterId = session.user.id

  // Verify job belongs to recruiter
  const [job] = await db
    .select({ id: jobs.id, title: jobs.title, recruiterId: jobs.recruiterId })
    .from(jobs)
    .where(and(eq(jobs.id, input.jobId), isNull(jobs.deletedAt)))

  if (!job || job.recruiterId !== recruiterId) {
    throw new Error('Job not found or unauthorized')
  }

  // Try creating Google Calendar event with Meet link (non-blocking)
  let meetLink: string | null = null
  let googleEventId: string | null = null

  try {
    const calendarResult = await createCalendarEventWithMeet({
      recruiterId,
      summary: `Interview: ${input.candidateName} — ${job.title}`,
      description: input.notes ?? undefined,
      startTime: new Date(input.scheduledAt),
      durationMinutes: input.duration,
      attendees: [
        { email: session.user.email },
        { email: input.candidateEmail },
      ],
    })
    if (calendarResult) {
      meetLink = calendarResult.meetLink
      googleEventId = calendarResult.eventId
    }
  } catch {
    // Google Calendar not connected or API error — continue without Meet link
  }

  // Insert interview row
  const [created] = await db
    .insert(interviews)
    .values({
      applicationId: input.applicationId ?? null,
      jobId: input.jobId,
      recruiterId,
      candidateId: input.candidateId ?? null,
      candidateName: input.candidateName,
      candidateEmail: input.candidateEmail,
      scheduledAt: new Date(input.scheduledAt),
      duration: input.duration,
      meetLink,
      googleEventId,
      status: 'scheduled',
      interviewType: input.interviewType,
      notes: input.notes ?? null,
    })
    .returning()

  // Fire-and-forget: send confirmation emails + schedule reminder
  try {
    // Get recruiter's company name
    const [recruiterRow] = await db
      .select({ companyName: user.companyName })
      .from(user)
      .where(eq(user.id, recruiterId))

    await tasks.trigger('send-interview-scheduled-email', {
      interviewId: created!.id,
      candidateName: input.candidateName,
      candidateEmail: input.candidateEmail,
      recruiterName: session.user.name,
      recruiterEmail: session.user.email,
      companyName: recruiterRow?.companyName ?? 'HackHyre',
      jobTitle: job.title,
      scheduledAt: input.scheduledAt,
      duration: input.duration,
      meetLink,
      interviewType: input.interviewType,
      notes: input.notes ?? null,
    })
  } catch {
    // Email sending failure should not block interview creation
  }

  return {
    id: created!.id,
    applicationId: created!.applicationId,
    jobId: created!.jobId,
    jobTitle: job.title,
    candidateId: created!.candidateId,
    candidateName: created!.candidateName,
    candidateEmail: created!.candidateEmail,
    scheduledAt: created!.scheduledAt,
    duration: created!.duration,
    meetLink: created!.meetLink,
    googleEventId: created!.googleEventId,
    status: created!.status as InterviewStatus,
    interviewType: created!.interviewType as InterviewType,
    notes: created!.notes,
    feedback: created!.feedback,
    rating: created!.rating,
    reminderSent: created!.reminderSent,
    createdAt: created!.createdAt,
    updatedAt: created!.updatedAt,
  }
}

// ── Submit Interview Feedback ────────────────────────────────────────

export async function submitInterviewFeedback({
  interviewId,
  rating,
  feedback,
}: {
  interviewId: string
  rating: number
  feedback: string
}) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  // Verify ownership
  const [interview] = await db
    .select()
    .from(interviews)
    .where(
      and(
        eq(interviews.id, interviewId),
        eq(interviews.recruiterId, session.user.id)
      )
    )

  if (!interview) throw new Error('Interview not found')
  if (interview.status !== 'completed') {
    throw new Error('Can only submit feedback for completed interviews')
  }
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5')
  }

  await db
    .update(interviews)
    .set({ feedback, rating, updatedAt: new Date() })
    .where(eq(interviews.id, interviewId))
}

// ── Cancel Interview ─────────────────────────────────────────────────

export async function cancelInterview(interviewId: string) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const [interview] = await db
    .select()
    .from(interviews)
    .where(
      and(
        eq(interviews.id, interviewId),
        eq(interviews.recruiterId, session.user.id)
      )
    )

  if (!interview) throw new Error('Interview not found')

  // Delete Google Calendar event if exists
  if (interview.googleEventId) {
    try {
      await deleteCalendarEvent(session.user.id, interview.googleEventId)
    } catch {
      // Continue even if calendar deletion fails
    }
  }

  const [updated] = await db
    .update(interviews)
    .set({ status: 'cancelled', updatedAt: new Date() })
    .where(eq(interviews.id, interviewId))
    .returning()

  return updated
}

// ── Reschedule Interview ─────────────────────────────────────────────

export async function rescheduleInterview(
  interviewId: string,
  newDate: string,
  newDuration?: number
) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const [interview] = await db
    .select()
    .from(interviews)
    .where(
      and(
        eq(interviews.id, interviewId),
        eq(interviews.recruiterId, session.user.id)
      )
    )

  if (!interview) throw new Error('Interview not found')

  // Update Google Calendar event if exists
  if (interview.googleEventId) {
    try {
      await updateCalendarEvent(session.user.id, interview.googleEventId, {
        startTime: new Date(newDate),
        durationMinutes: newDuration ?? interview.duration,
      })
    } catch {
      // Continue even if calendar update fails
    }
  }

  const [updated] = await db
    .update(interviews)
    .set({
      scheduledAt: new Date(newDate),
      duration: newDuration ?? interview.duration,
      reminderSent: false,
      updatedAt: new Date(),
    })
    .where(eq(interviews.id, interviewId))
    .returning()

  return updated
}
