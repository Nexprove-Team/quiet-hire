import { Hero } from '@/components/home/landing/hero'
// import { Logos } from '@/components/home/landing/logos'
import { HowItWorks } from '@/components/home/landing/how-it-works'
import { AIMatching } from '@/components/home/landing/ai-matching'
import { ForCandidates } from '@/components/home/landing/for-candidates'
// import { ForRecruiters } from '@/components/home/landing/for-recruiters'
import { Stats } from '@/components/home/landing/stats'
import { Features } from '@/components/home/landing/features'
import { Testimonials } from '@/components/home/landing/testimonials'
import { FAQ } from '@/components/home/landing/faq'
import { CTA } from '@/components/home/landing/cta'
import { NewForRecruiters } from '@/components/home/landing/new-for-recuriters'

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* <Logos /> */}
      <HowItWorks />
      <AIMatching />
      <NewForRecruiters />
      {/* <ForRecruiters /> */}
      <ForCandidates />
      <Stats />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  )
}
