import { Header } from '@/components/home/header'
import { Footer } from '@/components/home/footer'
import LayoutWrapper from './layout-wrapper'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = {
    name: 'John Doe',
    email: 'phoenixdahdev@gmail.com',
    image: 'https://i.pravatar.cc/150?img=3',
    location: 'San Francisco, CA',
  }
  return (
    <LayoutWrapper>
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </LayoutWrapper>
  )
}
