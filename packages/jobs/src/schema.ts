import { z } from "zod";

export const emailVerificationSchema = z.object({
  email: z.email(),
  otp: z.string(),
  type: z
    .enum(["email-verification", "sign-in", "forget-password"])
    .default("email-verification")
    .optional(),
});

// ── Interview Schemas ──────────────────────────────────────────────────────────

export const interviewScheduledSchema = z.object({
  interviewId: z.string(),
  // Candidate
  candidateName: z.string(),
  candidateEmail: z.email(),
  // Recruiter
  recruiterName: z.string(),
  recruiterEmail: z.email(),
  // Job
  companyName: z.string(),
  jobTitle: z.string(),
  // Schedule
  scheduledAt: z.string(), // ISO string
  duration: z.number(),
  meetLink: z.string().nullable(),
  interviewType: z.string(),
  notes: z.string().nullable().optional(),
});

export const recruiterEmailSchema = z.object({
  candidateName: z.string(),
  candidateEmail: z.email(),
  recruiterName: z.string(),
  recruiterEmail: z.email(),
  companyName: z.string(),
  subject: z.string(),
  body: z.string(),
});

export const interviewReminderSchema = z.object({
  interviewId: z.string(),
  // Candidate
  candidateName: z.string(),
  candidateEmail: z.email(),
  // Recruiter
  recruiterName: z.string(),
  recruiterEmail: z.email(),
  // Job
  jobTitle: z.string(),
  // Schedule
  startsAt: z.string(), // Formatted time string
  scheduledAt: z.string(), // ISO string for display
  duration: z.number(),
  meetLink: z.string().nullable(),
});
