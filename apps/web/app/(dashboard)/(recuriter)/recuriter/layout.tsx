import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { CandidateSheet } from '@/components/dashboard/candidate-sheet'
import { getSession } from '@/lib/auth-session'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar session={session} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <CandidateSheet />
    </div>
  )
}
