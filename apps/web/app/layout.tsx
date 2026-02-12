import './global.css'
import { cn } from '@hackhyre/ui/lib/utils'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import { DefaultProvider } from '@hackhyre/ui/providers/default-provider'
import { NuqsAdapter } from 'nuqs/adapters/next'

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
  const defaultOptions = {
    shallow: true,
    clearOnDefault: true,
    scroll: true,
  }
  return (
    <NuqsAdapter defaultOptions={defaultOptions}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            'font-sans antialiased',
            fontSans.variable,
            fontBricolage.variable
          )}
        >
          <DefaultProvider defaultTheme="light">{children}</DefaultProvider>
        </body>
      </html>
    </NuqsAdapter>
  )
}
