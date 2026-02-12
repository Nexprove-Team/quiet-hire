'use client'

import Link from 'next/link'
import * as motion from 'motion/react-client'
import { Button } from '@hackhyre/ui/components/button'
import { ArrowRight } from '@hackhyre/ui/icons'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export function CTA() {
  return (
    <section className="bg-brand-navy relative overflow-hidden py-24 lg:py-32">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-56 w-56 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.05] blur-[80px]" />

      <div className="relative mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Ready to transform how you hire?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-400"
          >
            Join thousands of professionals and companies already using
            HackHyre to find their perfect match.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Button
              size="lg"
              className="rounded-xl bg-[oklch(0.82_0.22_155)] text-sm font-semibold text-neutral-900 shadow-sm hover:brightness-110"
              asChild
            >
              <Link href="/sign-up">
                Get Started Free
                <ArrowRight size={16} variant="Linear" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl border-neutral-700 text-sm font-semibold text-white hover:bg-neutral-800"
              asChild
            >
              <Link href="/sign-up?role=recruiter">Start Hiring</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
