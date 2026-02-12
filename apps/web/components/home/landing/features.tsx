'use client'

import * as motion from 'motion/react-client'
import {
  DocumentText,
  DollarCircle,
  Calendar,
  Award,
  Star,
  Messages,
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

interface Feature {
  title: string
  description: string
  icon: Icon
  wide?: boolean
}

const FEATURES: Feature[] = [
  {
    title: 'Resume Builder',
    description:
      'AI-assisted resume creation that highlights your strengths and aligns with target roles.',
    icon: DocumentText,
    wide: true,
  },
  {
    title: 'Salary Insights',
    description:
      'Market-rate data so you and employers negotiate transparently.',
    icon: DollarCircle,
  },
  {
    title: 'Interview Scheduling',
    description: 'Seamless availability matching — no back-and-forth emails.',
    icon: Calendar,
  },
  {
    title: 'Skill Assessments',
    description: 'Validate abilities with objective, role-specific tests.',
    icon: Award,
  },
  {
    title: 'Company Reviews',
    description: 'Honest employer insights from real employees.',
    icon: Star,
  },
  {
    title: 'Real-time Messaging',
    description:
      'Built-in communication so you never lose a conversation thread.',
    icon: Messages,
    wide: true,
  },
]

export function Features() {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
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
            Platform
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to hire and get hired
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base">
            A complete toolkit for both sides of the hiring equation.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className={`bg-card group rounded-2xl border p-6 transition-all hover:shadow-md ${
                feature.wide ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="bg-primary/10 mb-4 flex h-10 w-10 items-center justify-center rounded-xl">
                <feature.icon
                  size={20}
                  variant="Bold"
                  className="text-primary"
                />
              </div>
              <h3 className="font-mono text-[15px] font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
