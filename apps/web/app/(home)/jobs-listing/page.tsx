import { Metadata } from 'next'
import { JobsPage } from './(components)'

export const metadata: Metadata = {
  title: 'Browse Jobs',
  description:
    'Search and filter open positions matched to your skills. Browse by location, experience level, salary, and schedule on HackHyre.',
  openGraph: {
    title: 'Browse Jobs | HackHyre',
    description:
      'Find your next role faster. Search open positions, filter by salary, location, and experience, and get AI-matched recommendations.',
    type: 'website',
    url: 'https://hackhyre.com/jobs-listing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Jobs | HackHyre',
    description:
      'Find your next role faster. Search open positions, filter by salary, location, and experience, and get AI-matched recommendations.',
  },
}

const JobsListingPage = () => {
  return <JobsPage />
}

export default JobsListingPage
