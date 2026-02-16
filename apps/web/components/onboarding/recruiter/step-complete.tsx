'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { TickCircle, ArrowRight } from '@hackhyre/ui/icons'
import { Loader2 } from 'lucide-react'

import { Button } from '@hackhyre/ui/components/button'
import { saveRecruiterOnboarding } from '@/actions/onboarding'
import type { StepProps } from '../onboarding-wizard'

export function RecruiterStepComplete({ data }: StepProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const didSave = useRef(false)

  useEffect(() => {
    if (didSave.current) return
    didSave.current = true

    startTransition(async () => {
      await saveRecruiterOnboarding({
        companyName: data.companyName ?? 'My Company',
        companyWebsite: data.companyWebsite,
        companyLogoUrl: data.companyLogoUrl,
        companyDescription: data.companyDescription,
        companyMission: data.companyMission,
        linkedinUrl: data.companyLinkedinUrl,
        twitterUrl: data.companyTwitterUrl,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        jobEmploymentType: data.jobEmploymentType,
        jobExperienceLevel: data.jobExperienceLevel,
        jobLocation: data.jobLocation,
        jobIsRemote: data.jobIsRemote,
      })
      setSaved(true)
    })
  }, [data, startTransition])

  if (isPending && !saved) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">
          Setting up your company...
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6 py-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        }}
      >
        <TickCircle size={80} variant="Bulk" className="text-primary" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className="font-mono text-3xl font-bold tracking-tight">
          Your company is ready!
        </h2>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          {data.companyName
            ? `${data.companyName} is all set up.`
            : 'Your company profile is ready.'}{' '}
          Start discovering talent and posting jobs.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 pt-4"
      >
        <Button size="lg" onClick={() => router.push('/recuriter/dashboard')}>
          Go to Dashboard
          <ArrowRight size={18} variant="Linear" className="ml-1" />
        </Button>
      </motion.div>
    </div>
  )
}
