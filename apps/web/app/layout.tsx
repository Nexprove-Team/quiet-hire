import './global.css'
import { Providers } from '@/components/providers'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import { cn } from '@hackhyre/ui/lib/utils'

const fontSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontBricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          fontSans.variable,
          fontBricolage.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
