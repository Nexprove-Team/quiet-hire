import type { Metadata } from 'next'
import { Suspense } from 'react'
import { VerifyEmailForm } from '@/components/auth/verify-email-form'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Verify Email — HackHyre',
  description: 'Verify your email address to continue',
}

export default async function VerifyEmailPage(
  props: PageProps<'/verify-email'>
) {
  const search = await props.searchParams
  const email = search['email']
  const role = search['role']

  if (!email) {
    redirect('/sign-in')
  }

  return (
    <Suspense>
      <VerifyEmailForm email={email as string} role={role as string} />{' '}
    </Suspense>
  )
}
