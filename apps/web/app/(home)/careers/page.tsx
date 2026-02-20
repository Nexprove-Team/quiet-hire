import { CareersPage } from '.'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join the HackHyre team. We\'re building the AI-powered hiring platform that puts humans first. See our culture, values, and open opportunities.',
  openGraph: {
    title: 'Careers at HackHyre',
    description:
      'Build the future of hiring. Join a small, ambitious team reimagining how people find work.',
    type: 'website',
    url: 'https://hackhyre.com/careers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at HackHyre',
    description:
      'Build the future of hiring. Join a small, ambitious team reimagining how people find work.',
  },
}

export default function Careers() {
  return <CareersPage />
}
