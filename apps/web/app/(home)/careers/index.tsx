'use client'

import Link from 'next/link'
import * as motion from 'motion/react-client'
import { Button } from '@hackhyre/ui/components/button'
import {
  Heart,
  Flash,
  MagicStar,
  Eye,
  People,
  TrendUp,
  Code,
  Global,
  Briefcase,
  Teacher,
  Cake,
  Crown,
  Award,
  Star,
  Send,
  Location,
} from '@hackhyre/ui/icons'
import { XIcon } from '@hackhyre/ui/icons'

/* ── Animation variants ──────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ── Shared dark-section background ──────────────────── */

function DarkBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 -bottom-20 h-56 w-56 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.05] blur-[80px]" />
    </>
  )
}

/* ── Section 1: Hero ─────────────────────────────────── */

function Hero() {
  return (
    <section className="bg-brand-navy relative overflow-hidden py-24 lg:py-36">
      <DarkBackground />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 600 600"
          className="h-125 w-125 opacity-[0.08] sm:h-150 sm:w-150"
        >
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '300px 300px' }}
          >
            <circle
              cx="300"
              cy="300"
              r="260"
              fill="none"
              stroke="oklch(0.82 0.22 155)"
              strokeWidth="1"
            />
            <circle cx="560" cy="300" r="6" fill="oklch(0.82 0.22 155)" />
          </motion.g>
        </svg>
      </div>

      <div className="relative mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-4 text-xs font-semibold tracking-widest text-[oklch(0.82_0.22_155)] uppercase"
          >
            Join Our Team
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Build the future of{' '}
            <span className="text-[oklch(0.82_0.22_155)]">hiring</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-neutral-400"
          >
            We&apos;re a small, ambitious team reimagining how people find work.
            If you want outsized impact at a company that moves fast and thinks
            big, we&apos;d love to hear from you.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-400"
          >
            <Location
              size={16}
              variant="Bold"
              className="text-[oklch(0.82_0.22_155)]"
            />
            Wilmington, Delaware
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Section 2: Why HackHyre — Culture Cards ─────────── */

const CULTURE_CARDS = [
  {
    title: 'Meaningful Work',
    description:
      'Every line of code you write helps someone find their dream job. We solve real problems for real people — no busywork, no vanity metrics.',
    icon: Heart,
  },
  {
    title: 'Startup Velocity',
    description:
      'Ship weekly. Own entire features end-to-end. We move fast because our users deserve better — and so do you.',
    icon: Flash,
  },
  {
    title: 'AI-First Thinking',
    description:
      'We don\'t bolt AI onto legacy systems. Everything we build is designed from the ground up to leverage the latest in machine learning.',
    icon: MagicStar,
  },
]

function WhyHackHyre() {
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
            Why HackHyre
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-5xl">
            Why you&apos;ll love it here
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-xl">
            We&apos;re building something that matters — and having a blast
            doing it.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid gap-6 md:grid-cols-3"
        >
          {CULTURE_CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="bg-card group rounded-2xl border p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.82_0.22_155)]/10 transition-transform duration-300 group-hover:scale-110">
                <card.icon
                  size={22}
                  variant="Bold"
                  className="text-[oklch(0.82_0.22_155)]"
                />
              </div>
              <h3 className="font-mono text-lg font-semibold tracking-tight">
                {card.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Section 3: Values — What Drives Us ──────────────── */

const VALUES = [
  {
    num: '01',
    title: 'Radical Transparency',
    description:
      'We share context freely — roadmaps, metrics, decisions. Everyone has the information they need to do their best work.',
    icon: Eye,
  },
  {
    num: '02',
    title: 'Ownership Mentality',
    description:
      'You won\'t wait for permission here. See a problem? Fix it. Have an idea? Ship it. We trust each other to make the right call.',
    icon: People,
  },
  {
    num: '03',
    title: 'Relentless Growth',
    description:
      'We invest in your development as much as the product\'s. Learning budgets, stretch assignments, and honest feedback are the norm.',
    icon: TrendUp,
  },
  {
    num: '04',
    title: 'Craft Over Speed',
    description:
      'We move fast but never sloppy. Quality code, thoughtful design, and user empathy are non-negotiable.',
    icon: Code,
  },
  {
    num: '05',
    title: 'Remote-Friendly',
    description:
      'Work from wherever you do your best thinking. We optimize for async communication and deep focus time.',
    icon: Global,
  },
]

function Values() {
  return (
    <section className="bg-brand-navy relative overflow-hidden py-20 lg:py-28">
      <DarkBackground />

      <div className="relative mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 text-xs font-semibold tracking-widest text-[oklch(0.82_0.22_155)] uppercase">
            What Drives Us
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Our values
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xl text-neutral-400">
            The principles that shape how we work, build, and grow together.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerFast}
          className="mx-auto max-w-3xl space-y-4"
        >
          {VALUES.map((value) => (
            <motion.div
              key={value.title}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="group relative flex items-start gap-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all duration-300 hover:translate-x-1 hover:border-[oklch(0.82_0.22_155)]/40 hover:bg-neutral-900/80 sm:gap-6 sm:p-8"
            >
              <div className="absolute top-4 bottom-4 left-0 w-0.75 origin-top scale-y-0 rounded-full bg-[oklch(0.82_0.22_155)] transition-transform duration-300 group-hover:scale-y-100" />

              <span className="absolute top-4 right-6 font-mono text-6xl font-bold text-white/3 transition-colors duration-300 select-none group-hover:text-[oklch(0.82_0.22_155)]/8 sm:text-7xl">
                {value.num}
              </span>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.82_0.22_155)]/10 transition-transform duration-300 group-hover:scale-110">
                <value.icon
                  size={22}
                  variant="Bold"
                  className="text-[oklch(0.82_0.22_155)]"
                />
              </div>

              <div className="relative min-w-0">
                <h3 className="font-mono text-lg font-semibold tracking-tight text-white sm:text-xl">
                  {value.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400 sm:text-base">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Section 4: Perks & Benefits ─────────────────────── */

const PERKS = [
  {
    title: 'Equity Ownership',
    description:
      'Every team member gets a meaningful stake. When HackHyre wins, you win.',
    icon: Briefcase,
  },
  {
    title: 'Work From Anywhere',
    description:
      'Remote-first with flexible hours. We care about output, not where your desk is.',
    icon: Global,
  },
  {
    title: 'Learning Budget',
    description:
      'Annual stipend for courses, conferences, and books. Never stop leveling up.',
    icon: Teacher,
  },
  {
    title: 'Flexible PTO',
    description:
      'Take the time you need to recharge. No tracking, no guilt — just trust.',
    icon: Cake,
  },
  {
    title: 'Latest Tools',
    description:
      'Top-tier hardware, software, and AI tools. We remove friction so you can focus on building.',
    icon: Crown,
  },
  {
    title: 'Impact from Day One',
    description:
      'No six-month ramp-up. You\'ll ship to production in your first week.',
    icon: Award,
  },
]

function Perks() {
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
            Perks &amp; Benefits
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-5xl">
            Built for builders
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-xl">
            We take care of our team so they can take care of our users.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PERKS.map((perk) => (
            <motion.div
              key={perk.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="bg-card group rounded-2xl border p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.82_0.22_155)]/10 transition-transform duration-300 group-hover:scale-110">
                <perk.icon
                  size={22}
                  variant="Bold"
                  className="text-[oklch(0.82_0.22_155)]"
                />
              </div>
              <h3 className="font-mono text-lg font-semibold tracking-tight">
                {perk.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {perk.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Section 5: How We Work — 3-Step Process ─────────── */

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Ship Relentlessly',
    description:
      'Weekly releases, tight feedback loops, and a bias toward action. We learn by doing — and we do a lot.',
    icon: Flash,
  },
  {
    num: '02',
    title: 'Collaborate Openly',
    description:
      'Cross-functional by default. Engineers, designers, and product work side by side with full context.',
    icon: People,
  },
  {
    num: '03',
    title: 'Celebrate Wins',
    description:
      'We ship hard things and take time to recognize the effort. Wins — big and small — deserve to be celebrated.',
    icon: Star,
  },
] as const

function HowWeWork() {
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
            How We Work
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-5xl">
            Our rhythm
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-xl">
            Fast iteration, open collaboration, and a culture that values
            shipping over perfection.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="relative grid gap-8 sm:divide-x md:grid-cols-3"
        >
          <div className="absolute top-16 right-[calc(33%+1rem)] left-[calc(33%-1rem)] hidden h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent md:block dark:via-neutral-800" />

          {PROCESS_STEPS.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="relative text-center"
            >
              <div className="bg-background relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border">
                <step.icon
                  size={24}
                  variant="Bold"
                  className="text-primary"
                />
              </div>
              <span className="text-primary/30 font-mono text-5xl font-bold">
                {step.num}
              </span>
              <h3 className="mt-2 font-mono text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-muted-foreground mx-auto mt-2 max-w-xs text-sm leading-relaxed lg:text-xl">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Section 6: Open Roles — General Application CTA ── */

const ROLE_PILLS = [
  'Full-Stack Engineers',
  'AI/ML Engineers',
  'Product Designers',
  'Developer Advocates',
  'Growth & Marketing',
]

function OpenRoles() {
  return (
    <section className="bg-brand-navy relative overflow-hidden py-20 lg:py-28">
      <DarkBackground />

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
            We&apos;re always looking for exceptional people
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-400"
          >
            We don&apos;t have specific listings right now, but great people
            don&apos;t wait for job posts — and neither do we.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-12 max-w-xl"
        >
          <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/30 p-8 text-center transition-colors hover:border-[oklch(0.82_0.22_155)]/40 sm:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.82_0.22_155)]/10">
              <Send
                size={24}
                variant="Bold"
                className="text-[oklch(0.82_0.22_155)]"
              />
            </div>

            <h3 className="font-mono text-xl font-semibold tracking-tight text-white">
              Send us your story
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">
              Tell us what you&apos;re passionate about and why HackHyre
              excites you. Reach out at{' '}
              <a
                href="mailto:careers@hackhyre.com"
                className="text-[oklch(0.82_0.22_155)] underline decoration-[oklch(0.82_0.22_155)]/30 underline-offset-2 hover:decoration-[oklch(0.82_0.22_155)]"
              >
                careers@hackhyre.com
              </a>
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {ROLE_PILLS.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-neutral-700 px-3 py-1 text-xs font-medium text-neutral-400"
                >
                  {role}
                </span>
              ))}
            </div>

            <Button
              size="lg"
              className="mt-8 rounded-xl bg-[oklch(0.82_0.22_155)] text-sm font-semibold text-neutral-900 shadow-sm hover:brightness-110"
              asChild
            >
              <a href="mailto:careers@hackhyre.com">Get in Touch</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Section 7: Built by Nexprove ────────────────────── */

function Team() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <div className="bg-card rounded-2xl border p-8 sm:p-12">
            <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
              The Team
            </p>
            <h2 className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Built by Nexprove
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              HackHyre is designed and built by the team at Nexprove — a
              technology company focused on building products that make hiring
              fairer, faster, and more human. We believe technology should
              amplify human judgment, not replace it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-xl" asChild>
                <a
                  href="https://www.nexprove.com/en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Global size={16} variant="Linear" />
                  Visit Nexprove
                </a>
              </Button>
              <Button variant="outline" className="rounded-xl" asChild>
                <a
                  href="https://x.com/nexprove"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <XIcon />
                  Follow on X
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Page Export ──────────────────────────────────────── */

export function CareersPage() {
  return (
    <>
      <Hero />
      <WhyHackHyre />
      <Values />
      <Perks />
      <HowWeWork />
      <OpenRoles />
      <Team />
    </>
  )
}
