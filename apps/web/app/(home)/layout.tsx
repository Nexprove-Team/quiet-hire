import { env } from '@/env/server'
import LayoutWrapper from './layout-wrapper'
import type { Geo } from '@vercel/functions'
import { getSession } from '@/lib/auth-session'
import { Footer } from '@/components/home/footer'
import { Header } from '@/components/home/header'
import { getQueryClient } from '@hackhyre/ui/lib/query-client'

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  const session = await getSession()

  const res = await queryClient.fetchQuery({
    queryKey: ['my-location'],
    queryFn: async () => {
      const res = await fetch(`${env.BETTER_AUTH_URL}/api/geo`)
      if (!res.ok) {
        throw new Error('Failed to fetch location')
      }
      const response = await res.json()
      return response as Geo
    },
    staleTime: 60 * 60 * 1000,
  })

  console.log('User location:', res)
  return (
    <LayoutWrapper>
      <Header user={session?.user} geo={res} />
      <main className="flex-1">{children}</main>
      <Footer />
    </LayoutWrapper>
  )
}
