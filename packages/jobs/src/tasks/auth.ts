import { nanoid } from 'nanoid'
import { resend } from '@jobs/utils/resend'
import { render } from '@react-email/render'
import { schemaTask } from '@trigger.dev/sdk'
import { emailVerificationSchema, } from '@jobs/schema'
import { VerificationOTPEmail } from '@hackhyre/email/emails/verification-otp'

export const sendVerificationEmail = schemaTask({
    id: 'send-verification-email',
    schema: emailVerificationSchema,
    maxDuration: 30,
    queue: {
        concurrencyLimit: 10,
    },
    run: async ({ otp, email, type }) => {
        const html = await render(VerificationOTPEmail({ otp, type: type ? type : "email-verification" }))
        const { data, error } = await resend.emails.send({
            headers: {
                'X-Entity-Ref-ID': nanoid(),
            },
            from: 'Support <support@fynix.dev>',
            to: [email],
            subject: 'Your Verification Code',
            html,
        })
        if (error) {
            throw error
        }
        return { success: true, data }
    },
})