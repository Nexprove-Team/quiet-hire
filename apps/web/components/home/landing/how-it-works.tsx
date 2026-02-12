'use client'

import * as motion from 'motion/react-client'
import { User, MagicStar, Flash } from '@hackhyre/ui/icons'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const STEPS = [
  {
    num: '01',
    title: 'Create Your Profile',
    description:
      'Set up your profile with your skills, experience, and preferences. Our AI gets to know what makes you unique.',
    icon: User,
  },
  {
    num: '02',
    title: 'AI Finds Your Match',
    description:
      'Our AI analyzes fit across 50+ dimensions — skills, culture, growth potential, and more. No keyword games.',
    icon: MagicStar,
  },
  {
    num: '03',
    title: 'Connect & Hire',
    description:
      'Get direct introductions to the right people. No middlemen, no spam — just meaningful connections that lead to great hires.',
    icon: Flash,
  },
] as const

export function HowItWorks() {
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
            Simple Process
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base">
            Three simple steps to finding your perfect match — whether
            you&apos;re hiring or looking for your next role.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="relative grid gap-8 md:grid-cols-3"
        >
          {/* Connecting line — desktop only */}
          <div className="absolute top-16 right-[calc(33%+1rem)] left-[calc(33%-1rem)] hidden h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent md:block dark:via-neutral-800" />

          {STEPS.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="relative text-center"
            >
              <div className="bg-background relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border">
                <step.icon size={24} variant="Bold" className="text-primary" />
              </div>
              <span className="text-primary/30 font-mono text-5xl font-bold">
                {step.num}
              </span>
              <h3 className="mt-2 font-mono text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-muted-foreground mx-auto mt-2 max-w-xs text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
