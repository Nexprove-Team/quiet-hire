import './global.css'
import type { Metadata } from 'next'
import { cn } from '@hackhyre/ui/lib/utils'
import { NuqsAdapter } from 'nuqs/adapters/next'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import { DefaultProvider } from '@hackhyre/ui/providers/default-provider'

export const metadata: Metadata = {
  metadataBase: new URL('https://hackhyre.com'),
  title: {
    default: 'HackHyre - AI-Powered Hiring Platform',
    template: '%s | HackHyre',
  },
  description:
    'HackHyre matches candidates and companies across 50+ dimensions using AI. No keyword games just meaningful connections that lead to great hires.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hackhyre.com',
    siteName: 'HackHyre',
    title: 'HackHyre - AI-Powered Hiring Platform',
    description:
      'HackHyre matches candidates and companies across 50+ dimensions using AI. No keyword games just meaningful connections that lead to great hires.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HackHyre - AI-Powered Hiring Platform',
    description:
      'HackHyre matches candidates and companies across 50+ dimensions using AI. No keyword games just meaningful connections.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: [{ rel: 'icon', url: '/favicon.svg' }],
}

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
