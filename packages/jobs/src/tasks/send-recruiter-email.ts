import { nanoid } from "nanoid";
import { schemaTask } from "@trigger.dev/sdk";
import { render } from "@react-email/render";
import { resend } from "@jobs/utils/resend";
import { recruiterEmailSchema } from "@jobs/schema";
import { RecruiterMessageEmail } from "@hackhyre/email/emails/recruiter-message";

export const sendRecruiterEmail = schemaTask({
  id: "send-recruiter-email",
  schema: recruiterEmailSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async (payload) => {
    const {
      candidateName,
      candidateEmail,
      recruiterName,
      recruiterEmail,
      companyName,
      subject,
      body,
    } = payload;

    const html = await render(
      RecruiterMessageEmail({
        candidateName,
        recruiterName,
        companyName,
        subject,
        body,
      }),
    );

    const result = await resend.emails.send({
      headers: { "X-Entity-Ref-ID": nanoid() },
      from: "HackHyre <support@fynix.dev>",
      to: [candidateEmail],
      replyTo: recruiterEmail,
      subject,
      html,
    });

    return {
      success: true,
      emailId: result.data?.id,
    };
  },
});
