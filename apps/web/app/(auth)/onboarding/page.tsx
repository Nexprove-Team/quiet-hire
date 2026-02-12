import { redirect } from 'next/navigation'
import type { User } from '@hackhyre/db/auth'
import { getSession } from '@/lib/auth-session'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'

export default async function OnboardingPage() {
  const session = await getSession()

  if (!session) {
    redirect('/sign-in')
  }

  const user = session.user as User

  return (
    <OnboardingWizard
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role === 'recruiter' ? 'recruiter' : 'candidate',
      }}
    />
  )
}
