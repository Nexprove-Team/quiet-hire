'use client'

import Link from 'next/link'
import * as motion from 'motion/react-client'
import { Button } from '@hackhyre/ui/components/button'
import { Badge } from '@hackhyre/ui/components/badge'
import { ArrowRight, Flash } from '@hackhyre/ui/icons'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

function MatchingIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      {/* Background glow */}
      <div className="absolute inset-0 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.06] blur-[80px]" />

      <svg viewBox="0 0 400 400" className="relative h-full w-full" fill="none">
        {/* Grid pattern */}
        <defs>
          <pattern
            id="hero-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-neutral-200 dark:text-neutral-800"
            />
          </pattern>
          <radialGradient id="hero-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="hero-mask">
            <rect width="400" height="400" fill="url(#hero-fade)" />
          </mask>
        </defs>
        <rect
          width="400"
          height="400"
          fill="url(#hero-grid)"
          mask="url(#hero-mask)"
        />

        {/* Candidate node */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <circle
            cx="100"
            cy="200"
            r="48"
            className="fill-white stroke-neutral-200 dark:fill-neutral-900 dark:stroke-neutral-700"
            strokeWidth="1.5"
          />
          <circle cx="100" cy="188" r="14" className="fill-neutral-300 dark:fill-neutral-600" />
          <path
            d="M78 218c0-12.15 9.85-22 22-22s22 9.85 22 22"
            className="stroke-neutral-300 dark:stroke-neutral-600"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <text
            x="100"
            y="260"
            textAnchor="middle"
            className="fill-neutral-500 dark:fill-neutral-400"
            fontSize="11"
            fontWeight="500"
          >
            Candidate
          </text>
        </motion.g>

        {/* Recruiter node */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <circle
            cx="300"
            cy="200"
            r="48"
            className="fill-white stroke-neutral-200 dark:fill-neutral-900 dark:stroke-neutral-700"
            strokeWidth="1.5"
          />
          <rect
            x="284"
            y="182"
            width="32"
            height="24"
            rx="4"
            className="fill-neutral-300 dark:fill-neutral-600"
          />
          <rect
            x="292"
            y="176"
            width="16"
            height="8"
            rx="2"
            className="fill-neutral-300 dark:fill-neutral-600"
          />
          <text
            x="300"
            y="260"
            textAnchor="middle"
            className="fill-neutral-500 dark:fill-neutral-400"
            fontSize="11"
            fontWeight="500"
          >
            Recruiter
          </text>
        </motion.g>

        {/* Center AI node */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5, type: 'spring' }}
        >
          <circle
            cx="200"
            cy="200"
            r="32"
            fill="oklch(0.82 0.22 155)"
            fillOpacity="0.12"
            stroke="oklch(0.82 0.22 155)"
            strokeWidth="1.5"
          />
          <circle cx="200" cy="200" r="18" fill="oklch(0.82 0.22 155)" />
          <path
            d="M192 200l5 5 11-11"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <text
            x="200"
            y="248"
            textAnchor="middle"
            fill="oklch(0.82 0.22 155)"
            fontSize="11"
            fontWeight="600"
          >
            AI Match
          </text>
        </motion.g>

        {/* Connecting lines */}
        <motion.line
          x1="148"
          y1="200"
          x2="168"
          y2="200"
          stroke="oklch(0.82 0.22 155)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        />
        <motion.line
          x1="232"
          y1="200"
          x2="252"
          y2="200"
          stroke="oklch(0.82 0.22 155)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        />

        {/* Floating dots */}
        {[
          { cx: 160, cy: 160, delay: 1.4 },
          { cx: 240, cy: 160, delay: 1.5 },
          { cx: 160, cy: 240, delay: 1.6 },
          { cx: 240, cy: 240, delay: 1.7 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r="3"
            fill="oklch(0.82 0.22 155)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{
              delay: dot.delay,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center lg:text-left"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
              <Badge
                variant="secondary"
                className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium"
              >
                <Flash size={14} variant="Bold" className="text-primary" />
                AI-Powered Hiring Platform
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="font-mono text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              The smartest way to{' '}
              <span className="text-primary">match talent</span> with
              opportunity
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-muted-foreground mt-6 max-w-lg text-base leading-relaxed sm:text-lg lg:mx-0 mx-auto"
            >
              HackHyre uses AI to connect ambitious professionals with
              forward-thinking companies. No keyword games, no guesswork — just
              intelligent matching that works.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            >
              <Button
                size="lg"
                className="rounded-xl text-sm font-semibold shadow-sm"
                asChild
              >
                <Link href="/sign-up">
                  Find Your Next Role
                  <ArrowRight size={16} variant="Linear" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl text-sm font-semibold"
                asChild
              >
                <Link href="/sign-up?role=recruiter">Start Hiring</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="hidden lg:block"
          >
            <MatchingIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
