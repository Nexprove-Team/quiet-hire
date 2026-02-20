import React from 'react'
import { AboutPage } from '.'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'HackHyre is an AI-powered hiring platform that matches candidates and companies across 50+ dimensions. Built by Nexprove in Wilmington, Delaware.',
  openGraph: {
    title: 'About Us HackHyre',
    description:
      'Hiring should be about people, not paperwork. Learn how HackHyre uses AI to make hiring fairer, faster, and more human.',
    type: 'website',
    url: 'https://hackhyre.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us HackHyre',
    description:
      'Hiring should be about people, not paperwork. Learn how HackHyre uses AI to make hiring fairer, faster, and more human.',
  },
}

const AboutUs = () => {
  return <AboutPage />
}

export default AboutUs
