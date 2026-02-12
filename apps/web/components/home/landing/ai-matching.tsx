'use client'

import * as motion from 'motion/react-client'
import { useRef, useEffect, useState } from 'react'
import { TickCircle } from '@hackhyre/ui/icons'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const FEATURES = [
  'Contextual understanding',
  'Culture fit analysis',
  'Growth potential scoring',
  'Bias-free evaluation',
]

function AnimatedCounter({ target }: { target: number }) {
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
    const duration = 1500
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

  return <span ref={ref}>{count}</span>
}

function MatchCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Glow */}
      <div className="absolute -inset-4 rounded-3xl bg-[oklch(0.82_0.22_155)] opacity-[0.06] blur-2xl" />

      <div className="bg-card relative rounded-2xl border p-6 shadow-sm">
        {/* Candidate mini card */}
        <div className="mb-4 flex items-center gap-3 rounded-xl border p-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <span className="text-primary text-sm font-bold">JD</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Jane Doe</p>
            <p className="text-muted-foreground text-xs">
              Senior Frontend Engineer
            </p>
          </div>
        </div>

        {/* Match score */}
        <div className="my-5 text-center">
          <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wider">
            Match Score
          </p>
          <p className="text-primary font-mono text-5xl font-bold">
            <AnimatedCounter target={94} />%
          </p>
        </div>

        {/* Job mini card */}
        <div className="flex items-center gap-3 rounded-xl border p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <span className="text-xs font-bold">AC</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Lead Engineer</p>
            <p className="text-muted-foreground text-xs">Acme Corp</p>
          </div>
        </div>

        {/* Animated connecting dots */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="bg-primary/40 absolute h-1.5 w-1.5 rounded-full"
              style={{ left: -20 + i * 20 }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function AIMatching() {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left text */}
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
              AI-Powered
            </motion.p>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="font-mono text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Matching powered by intelligence, not keywords
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-muted-foreground mt-4 max-w-lg text-base leading-relaxed"
            >
              Our AI goes beyond keyword matching. It understands context,
              evaluates culture fit, and identifies growth potential to find
              matches that actually work.
            </motion.p>

            <motion.ul
              variants={stagger}
              className="mt-8 space-y-3"
            >
              {FEATURES.map((feature) => (
                <motion.li
                  key={feature}
                  variants={fadeUp}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 text-sm font-medium"
                >
                  <TickCircle
                    size={20}
                    variant="Bold"
                    className="text-primary shrink-0"
                  />
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MatchCard />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
