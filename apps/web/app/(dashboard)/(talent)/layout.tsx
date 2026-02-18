import { getSession } from '@/lib/auth-session'
import { CandidateSidebar } from '@/components/dashboard/candidate-sidebar'
import { CandidateHeader } from '@/components/dashboard/candidate-header'

export default async function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const user = session?.user
  return (
    <div className="flex h-svh overflow-hidden">
      <CandidateSidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <CandidateHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
