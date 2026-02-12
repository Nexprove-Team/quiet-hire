'use client'

import * as motion from 'motion/react-client'
import {
  Ranking,
  People,
  Global,
  Filter,
  Chart,
  UserTick,
} from '@hackhyre/ui/icons'
import type { Icon } from '@hackhyre/ui/icons'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

interface FeatureCard {
  title: string
  description: string
  icon: Icon
}

const CARDS: FeatureCard[] = [
  {
    title: 'AI-Ranked Candidates',
    description:
      'Pre-scored by relevance so you review the best fits first.',
    icon: Ranking,
  },
  {
    title: 'Talent Pool',
    description: 'Build and nurture your pipeline proactively.',
    icon: People,
  },
  {
    title: 'One-Click Distribution',
    description: 'Post to multiple channels with a single click.',
    icon: Global,
  },
  {
    title: 'Smart Filters',
    description: 'Go beyond basic search with intelligent parameters.',
    icon: Filter,
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track your hiring funnel metrics in real time.',
    icon: Chart,
  },
  {
    title: 'Verified Talent',
    description: 'Pre-vetted candidate profiles you can trust.',
    icon: UserTick,
  },
]

export function ForRecruiters() {
  return (
    <section className="bg-brand-navy relative overflow-hidden py-20 lg:py-28">
      {/* Background effects */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.05] blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.04] blur-[80px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 text-xs font-semibold tracking-widest uppercase text-[oklch(0.82_0.22_155)]">
            For Employers
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Hire smarter, not harder
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-400">
            Powerful tools that help you find, evaluate, and hire the best
            talent — faster than ever.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-colors hover:border-neutral-700"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(0.82_0.22_155)]/10 transition-transform group-hover:scale-110">
                <card.icon
                  size={20}
                  variant="Bold"
                  className="text-[oklch(0.82_0.22_155)]"
                />
              </div>
              <h3 className="font-mono text-[15px] font-semibold tracking-tight text-white">
                {card.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
