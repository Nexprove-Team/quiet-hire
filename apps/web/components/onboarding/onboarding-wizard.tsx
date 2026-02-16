'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { StepIndicator } from './step-indicator'

// Recruiter steps
import { RecruiterStepCompany } from './recruiter/step-company'
import { RecruiterStepDetails } from './recruiter/step-details'
import { RecruiterStepFirstJob } from './recruiter/step-first-job'
import { RecruiterStepComplete } from './recruiter/step-complete'

interface OnboardingUser {
  id: string
  name: string
  email: string
  role: 'candidate' | 'recruiter'
}

export interface OnboardingData {
  // Talent
  headline?: string
  bio?: string
  skills?: string[]
  experienceYears?: number
  location?: string
  isOpenToWork?: boolean
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  preferredEmploymentTypes?: string[]
  preferredExperienceLevel?: string
  isRemotePreferred?: boolean
  salaryMin?: number
  salaryMax?: number

  // Recruiter
  companyName?: string
  companyWebsite?: string
  companyLogoUrl?: string
  companyDescription?: string
  companyMission?: string
  companyLinkedinUrl?: string
  companyTwitterUrl?: string
  companyId?: string

  // Job draft
  jobTitle?: string
  jobDescription?: string
  jobEmploymentType?: string
  jobExperienceLevel?: string
  jobLocation?: string
  jobIsRemote?: boolean
}

export interface StepProps {
  user: OnboardingUser
  data: OnboardingData
  onUpdate: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const RECRUITER_STEPS = ['Company', 'Details', 'First Job', 'Done']

interface OnboardingWizardProps {
  user: OnboardingUser
  onBack?: () => void
}

export function OnboardingWizard({ user, onBack }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({})
  const [direction, setDirection] = useState(1)

  const steps = RECRUITER_STEPS

  const handleUpdate = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const handleBack = useCallback(() => {
    if (currentStep === 0 && onBack) {
      onBack()
      return
    }
    setDirection(-1)
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [currentStep, onBack])

  const stepProps: StepProps = {
    user,
    data,
    onUpdate: handleUpdate,
    onNext: handleNext,
    onBack: handleBack,
  }

  const recruiterSteps = [
    <RecruiterStepCompany key="company" {...stepProps} />,
    <RecruiterStepDetails key="details" {...stepProps} />,
    <RecruiterStepFirstJob key="first-job" {...stepProps} />,
    <RecruiterStepComplete key="complete" {...stepProps} />,
  ]

  const currentSteps = recruiterSteps

  return (
    <div className="space-y-8">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {currentSteps[currentStep]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
