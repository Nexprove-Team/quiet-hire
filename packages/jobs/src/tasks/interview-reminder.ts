import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { schemaTask } from "@trigger.dev/sdk";
import { render } from "@react-email/render";
import { resend } from "@jobs/utils/resend";
import { interviewReminderSchema } from "@jobs/schema";
import { InterviewReminderEmail } from "@hackhyre/email/emails/interview-reminder";
import { db, interviews } from "@hackhyre/db";

export const sendInterviewReminderEmail = schemaTask({
  id: "send-interview-reminder-email",
  schema: interviewReminderSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async (payload) => {
    const {
      interviewId,
      candidateName,
      candidateEmail,
      recruiterName,
      recruiterEmail,
      jobTitle,
      startsAt,
      duration,
      meetLink,
    } = payload;


    const [candidateHtml, recruiterHtml] = await Promise.all([
      render(
        InterviewReminderEmail({
          recipientName: candidateName,
          otherPartyName: recruiterName,
          jobTitle,
          startsAt,
          duration,
          meetLink,
          role: "candidate",
        }),
      ),
      render(
        InterviewReminderEmail({
          recipientName: recruiterName,
          otherPartyName: candidateName,
          jobTitle,
          startsAt,
          duration,
          meetLink,
          role: "recruiter",
        }),
      ),
    ]);

    await Promise.allSettled([
      resend.emails.send({
        headers: { "X-Entity-Ref-ID": nanoid() },
        from: "HackHyre <support@fynix.dev>",
        to: [candidateEmail],
        subject: `Reminder: Interview for ${jobTitle} starts in 30 minutes`,
        html: candidateHtml,
      }),
      resend.emails.send({
        headers: { "X-Entity-Ref-ID": nanoid() },
        from: "HackHyre <support@fynix.dev>",
        to: [recruiterEmail],
        subject: `Reminder: Interview with ${candidateName} starts in 30 minutes`,
        html: recruiterHtml,
      }),
    ]);

    await db
      .update(interviews)
      .set({ reminderSent: true, updatedAt: new Date() })
      .where(eq(interviews.id, interviewId));

    return { success: true };
  },
});
