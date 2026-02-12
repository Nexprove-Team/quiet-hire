'use client'

import * as motion from 'motion/react-client'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@hackhyre/ui/components/accordion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const FAQ_ITEMS = [
  {
    q: 'How does AI matching work?',
    a: 'Our AI analyzes over 50 dimensions — including skills, experience, culture preferences, career goals, and growth potential — to score compatibility between candidates and roles. It goes far beyond keyword matching to understand context and nuance.',
  },
  {
    q: 'Is HackHyre free for job seekers?',
    a: 'Yes! HackHyre is completely free for candidates. You can create a profile, get matched with opportunities, and connect with employers at no cost.',
  },
  {
    q: 'How do you verify job listings?',
    a: 'Every job listing goes through our verification pipeline. We confirm the company, validate the role is actively hiring, and check that the listing details are accurate and up to date.',
  },
  {
    q: 'What makes HackHyre different from LinkedIn?',
    a: 'HackHyre focuses on intelligent matching rather than networking. Instead of scrolling through hundreds of listings, our AI proactively surfaces the right opportunities for you — and the right candidates for employers.',
  },
  {
    q: 'How do I get started as a recruiter?',
    a: 'Sign up for a recruiter account, add your company details, and post your first job. Our AI immediately starts matching you with relevant candidates from our talent pool.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We use industry-standard encryption, never sell your data, and give you full control over your profile visibility. Your information is only shared with employers when you choose to apply.',
  },
]

export function FAQ() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Left heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
              FAQ
            </p>
            <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
              Questions? Answers.
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              Everything you need to know about HackHyre. Can&apos;t find what
              you&apos;re looking for? Reach out to our team.
            </p>
          </motion.div>

          {/* Right accordion */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-[15px] font-semibold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
