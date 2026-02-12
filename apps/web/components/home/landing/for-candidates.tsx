'use client'

import * as motion from 'motion/react-client'
import {
  ShieldTick,
  Flash,
  MagicStar,
  Eye,
  Award,
  TrendUp,
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
    title: 'Verified Jobs Only',
    description: 'Every listing verified at source — no ghost jobs, no scams.',
    icon: ShieldTick,
  },
  {
    title: 'Direct Access',
    description:
      'Connect directly with hiring managers. No recruiter gatekeeping.',
    icon: Flash,
  },
  {
    title: 'Smart Recommendations',
    description:
      'Our AI learns your preferences and surfaces roles you actually want.',
    icon: MagicStar,
  },
  {
    title: 'Full Transparency',
    description: 'See who posted the job, when, and where — always.',
    icon: Eye,
  },
  {
    title: 'Skill-Based Matching',
    description: 'Ranked by fit, not keyword stuffing.',
    icon: Award,
  },
  {
    title: 'Career Growth',
    description: 'Opportunities aligned with your trajectory and ambitions.',
    icon: TrendUp,
  },
]

export function ForCandidates() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
            For Job Seekers
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            Built for ambitious talent
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base">
            Everything you need to find a role that fits — not just a job, but
            the right opportunity.
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
              className="group rounded-2xl border p-6 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700"
            >
              <div className="bg-primary/10 mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                <card.icon
                  size={20}
                  variant="Bold"
                  className="text-primary"
                />
              </div>
              <h3 className="font-mono text-[15px] font-semibold tracking-tight">
                {card.title}
              </h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
