'use client'

import Link from 'next/link'
import * as motion from 'motion/react-client'
import { useRef, useEffect, useState } from 'react'
import { Button } from '@hackhyre/ui/components/button'
import {
  ArrowRight,
  CloseCircle,
  MagicStar,
  Flash,
  People,
  Eye,
  ShieldTick,
  Verify,
  Global,
  Location,
} from '@hackhyre/ui/icons'
import { XIcon } from '@hackhyre/ui/icons'

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

const staggerSlow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}

/* ── Animated number (from stats.tsx) ────────────────── */

function AnimatedNumber({
  target,
  suffix = '',
  prefix = '',
}: {
  target: number
  suffix?: string
  prefix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasAnimated) return
    let frame: number
    const duration = 2000
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [hasAnimated, target])

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

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
            Our Mission
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Hiring should be about{' '}
            <span className="text-[oklch(0.82_0.22_155)]">people</span>, not
            paperwork
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-neutral-400"
          >
            We&apos;re building the hiring platform that puts humans first.
            Powered by AI that understands potential, not just keywords.
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

/* ── Section 2: The Problem ──────────────────────────── */

const PAIN_POINTS = [
  'Keyword matching misses great candidates',
  'Unconscious bias in screening processes',
  'Candidates ghosted after applying',
  'One-size-fits-all job boards',
]

function Problem() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase"
            >
              The Problem
            </motion.p>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="font-mono text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Traditional hiring is broken
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-muted-foreground mt-4 max-w-lg text-base leading-relaxed"
            >
              The hiring industry is stuck in the past. Job boards rely on
              keyword matching. Recruiters are overwhelmed. Great candidates
              fall through the cracks while companies struggle to fill critical
              roles.
            </motion.p>

            <motion.ul variants={staggerFast} className="mt-6 space-y-3">
              {PAIN_POINTS.map((point) => (
                <motion.li
                  key={point}
                  variants={fadeUp}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <CloseCircle
                    size={20}
                    variant="Bold"
                    className="mt-0.5 shrink-0 text-red-500"
                  />
                  <span className="text-sm leading-relaxed">{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right — broken pipeline illustration */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl border p-6"
          >
            <p className="mb-4 text-xs font-semibold tracking-widest text-red-500 uppercase">
              Traditional ATS Funnel
            </p>
            <div className="space-y-3">
              {[
                {
                  label: 'Applications received',
                  pct: '100%',
                  width: '100%',
                  opacity: 1,
                },
                {
                  label: 'Pass keyword filter',
                  pct: '25%',
                  width: '25%',
                  opacity: 0.8,
                },
                {
                  label: 'Reviewed by human',
                  pct: '8%',
                  width: '8%',
                  opacity: 0.6,
                },
                {
                  label: 'Actually qualified',
                  pct: '???',
                  width: '60%',
                  opacity: 0.3,
                },
              ].map((row) => (
                <div key={row.label}>
                  <div className="text-muted-foreground mb-1 flex items-center justify-between text-xs">
                    <span>{row.label}</span>
                    <span className="font-mono">{row.pct}</span>
                  </div>
                  <div className="bg-muted h-2 overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: row.width, opacity: row.opacity }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
              Most ATS systems reject 75% of applicants before a human ever sees
              their resume. Qualified candidates are filtered out by keyword
              games.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── Section 3: The Solution — How AI Matching Works ─── */

const SOLUTION_STEPS = [
  {
    num: '01',
    title: 'Understand',
    description:
      'Our AI reads between the lines — analyzing 50+ signals from skills and experience to culture fit and growth trajectory.',
    icon: MagicStar,
  },
  {
    num: '02',
    title: 'Match',
    description:
      'Multi-dimensional compatibility scoring that goes beyond keywords. Every match is ranked by real fit, not just surface overlap.',
    icon: Flash,
  },
  {
    num: '03',
    title: 'Connect',
    description:
      'Direct introductions between candidates and hiring teams. No middlemen, no gatekeeping — just meaningful connections.',
    icon: People,
  },
] as const

function Solution() {
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
            The Solution
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-5xl">
            How our AI matching works
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-xl">
            A smarter approach to connecting talent with opportunity — powered
            by AI that understands the full picture.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="relative grid gap-8 sm:divide-x md:grid-cols-3"
        >
          <div className="absolute top-16 right-[calc(33%+1rem)] left-[calc(33%-1rem)] hidden h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent md:block dark:via-neutral-800" />

          {SOLUTION_STEPS.map((step) => (
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

/* ── Section 4: Stats ────────────────────────────────── */

const STATS = [
  { value: 10000, suffix: '+', label: 'Candidates matched' },
  { value: 500, suffix: '+', label: 'Companies hiring' },
  { value: 94, suffix: '%', label: 'Match accuracy' },
  { value: 3, suffix: 'x', label: 'Faster time to hire' },
]

function Stats() {
  return (
    <section className="bg-brand-navy relative overflow-hidden py-20 lg:py-28">
      <DarkBackground />

      <div className="relative mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-neutral-800 p-8 text-center transition-colors hover:border-[oklch(0.82_0.22_155)]/30"
            >
              <p className="font-mono text-4xl font-bold tracking-tight text-[oklch(0.82_0.22_155)] sm:text-5xl">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Section 5: Core Values ──────────────────────────── */

const VALUES = [
  {
    num: '01',
    title: 'Transparency',
    description:
      'No hidden algorithms. You always know why a match was made and how compatibility is scored.',
    icon: Eye,
  },
  {
    num: '02',
    title: 'Fairness',
    description:
      'Our AI is built to eliminate bias, evaluating candidates purely on merit and potential.',
    icon: ShieldTick,
  },
  {
    num: '03',
    title: 'Innovation',
    description:
      '50+ matching dimensions and counting. We continuously push the boundaries of what AI can understand about fit.',
    icon: MagicStar,
  },
  {
    num: '04',
    title: 'Trust',
    description:
      'Verified listings, honest scoring, and privacy by default. Your data works for you, not against you.',
    icon: Verify,
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
            What We Stand For
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Our core values
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xl text-neutral-400">
            The principles that guide every decision we make and every feature
            we build.
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

              {/* Number watermark */}
              <span className="absolute top-4 right-6 font-mono text-6xl font-bold text-white/3 transition-colors duration-300 select-none group-hover:text-[oklch(0.82_0.22_155)]/8 sm:text-7xl">
                {value.num}
              </span>

              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.82_0.22_155)]/10 transition-transform duration-300 group-hover:scale-110">
                <value.icon
                  size={22}
                  variant="Bold"
                  className="text-[oklch(0.82_0.22_155)]"
                />
              </div>

              {/* Content */}
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

/* ── Section 6: Our Journey — Vertical Timeline ──────── */

const MILESTONES = [
  {
    year: '2024',
    title: 'The Spark',
    description:
      'The Nexprove team identified a fundamental flaw in hiring: the best candidates were being filtered out by systems that couldn\u2019t see their true potential.',
  },
  {
    year: '2024',
    title: 'Building the Engine',
    description:
      'We developed our 50+ dimension AI matching algorithm, moving beyond keyword matching to understand what truly makes a great hire.',
  },
  {
    year: '2025',
    title: 'HackHyre Launches',
    description:
      'Public launch. Thousands of candidates and hundreds of companies joined in the first months, proving the demand for a smarter approach.',
  },
  {
    year: '2026',
    title: 'Scaling Impact',
    description:
      'Continuous improvement. Expanding to new markets and industries while keeping our commitment to fairness and transparency.',
  },
]

function Journey() {
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
            Our Story
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-5xl">
            The journey so far
          </h2>
        </motion.div>

        <div className="relative mx-auto max-w-2xl">
          {/* Timeline line that draws itself */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
            className="bg-border absolute top-0 bottom-0 left-4.75 w-px sm:left-5.75"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerSlow}
            className="space-y-10"
          >
            {MILESTONES.map((milestone) => (
              <motion.div
                key={milestone.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="relative flex gap-6 sm:gap-8"
              >
                {/* Dot */}
                <div className="relative z-10 mt-1.5 flex shrink-0">
                  <div className="bg-primary h-3 w-3 rounded-full shadow-[0_0_8px_oklch(0.82_0.22_155/0.4)] sm:h-4 sm:w-4" />
                </div>

                {/* Content */}
                <div className="pb-2">
                  <span className="text-primary font-mono text-sm font-bold">
                    {milestone.year}
                  </span>
                  <h3 className="mt-1 font-mono text-lg font-semibold tracking-tight sm:text-xl">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
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

/* ── Section 8: CTA ──────────────────────────────────── */

function AboutCTA() {
  return (
    <section className="bg-brand-navy relative overflow-hidden py-24 lg:py-32">
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
            Ready to experience smarter hiring?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-400"
          >
            Join thousands of professionals and companies already using HackHyre
            to find their perfect match.
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

export function AboutPage() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <Stats />
      <Values />
      <Journey />
      <Team />
      <AboutCTA />
    </>
  )
}
