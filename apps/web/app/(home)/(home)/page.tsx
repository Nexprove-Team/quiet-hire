import { Hero } from '@/components/home/landing/hero'
import { HowItWorks } from '@/components/home/landing/how-it-works'
import { AIMatching } from '@/components/home/landing/ai-matching'
import { ForCandidates } from '@/components/home/landing/for-candidates'
import { Stats } from '@/components/home/landing/stats'
import { Features } from '@/components/home/landing/features'
import { Testimonials } from '@/components/home/landing/testimonials'
import { FAQ } from '@/components/home/landing/faq'
import { CTA } from '@/components/home/landing/cta'
import { NewForRecruiters } from '@/components/home/landing/new-for-recuriters'

export default async function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <AIMatching />
      <NewForRecruiters />
      <ForCandidates />
      <Stats />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  )
}
