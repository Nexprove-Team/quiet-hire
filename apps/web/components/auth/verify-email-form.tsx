'use client'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@hackhyre/ui/components/input-otp'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { Sms } from '@hackhyre/ui/icons'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@hackhyre/ui/components/button'

export function VerifyEmailForm(props: { email: string; role: string }) {
  const router = useRouter()
  const email = props.email
  const role = props.role
  const [otp, setOtp] = useState('')

  const [isVerifying, startVerify] = useTransition()
  const [isResending, startResend] = useTransition()

  function handleVerify() {
    if (otp.length !== 6) return
    startVerify(async () => {
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp,
      })
      if (error) {
        toast.error(error.message ?? 'Invalid code. Please try again.')
        setOtp('')
        return
      }
      toast.success('Email verified!')
      router.push(role ? `/onboarding?role=${role}` : '/')
    })
  }

  function handleResend() {
    startResend(async () => {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
      })

      if (error) {
        toast.error(error.message ?? 'Failed to resend code')
        return
      }

      toast.success('New code sent to your email')
      setOtp('')
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="lg:hidden">
        <span className="font-mono text-xl font-bold">
          Hack<span className="text-primary">Hyre</span>
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="font-mono text-3xl font-bold tracking-tight">
          Check your email
        </h1>
        <p className="text-muted-foreground text-sm">
          We sent a 6-digit code to{' '}
          <span className="text-foreground font-medium">{email}</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* OTP icon */}
        <div className="flex justify-center">
          <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl">
            <Sms size={32} variant="Bulk" className="text-primary" />
          </div>
        </div>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleVerify}
            disabled={isVerifying}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p className="text-muted-foreground text-center text-xs">
          Code expires in 10 minutes
        </p>

        <Button
          className="w-full"
          disabled={otp.length !== 6 || isVerifying}
          onClick={handleVerify}
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify email'
          )}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          Didn&apos;t receive a code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend code'}
          </button>
        </p>
      </div>
    </motion.div>
  )
}
