import { redirect } from 'next/navigation'
import type { User } from '@hackhyre/db/auth'
import { getSession } from '@/lib/auth-session'
import { getOnboardingMethod } from '@/actions/onboarding'
import { CandidateOnboarding } from '@/components/onboarding/candidate-onboarding'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'

export default async function OnboardingPage() {
  const session = await getSession()
  if (!session) {
    redirect('/sign-in')
  }
  const user = session.user as User
  const role = user.role === 'recruiter' ? 'recruiter' : 'candidate'

  if (role === 'recruiter') {
    return (
      <OnboardingWizard
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'recruiter',
        }}
      />
    )
  }

  const savedMethod = await getOnboardingMethod()

  return (
    <CandidateOnboarding
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'candidate',
      }}
      savedMethod={savedMethod}
    />
  )
}
