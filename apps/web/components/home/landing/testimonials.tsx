'use client'

import * as motion from 'motion/react-client'
import { Star } from '@hackhyre/ui/icons'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const TESTIMONIALS = [
  {
    quote:
      'HackHyre matched me with a role I never would have found on LinkedIn. The AI understood what I was actually looking for, not just my keywords.',
    name: 'Sarah Chen',
    role: 'Senior Engineer',
    company: 'Acquired via HackHyre',
    initials: 'SC',
    rating: 5,
  },
  {
    quote:
      'We cut our time-to-hire by 60%. The AI-ranked candidates were so accurate that our first interview-to-offer ratio went from 8:1 to 3:1.',
    name: 'Marcus Johnson',
    role: 'Head of Talent',
    company: 'Globex Corp',
    initials: 'MJ',
    rating: 5,
  },
  {
    quote:
      'As a hiring manager, I finally have a tool that sends me candidates who actually fit the role AND the team culture. Game changer.',
    name: 'Priya Patel',
    role: 'Engineering Manager',
    company: 'Soylent Inc',
    initials: 'PP',
    rating: 5,
  },
]

export function Testimonials() {
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
            Testimonials
          </p>
          <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by talent and teams
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="bg-card relative rounded-2xl border p-6"
            >
              {/* Quote mark */}
              <span className="text-primary/10 pointer-events-none absolute top-4 right-5 font-serif text-6xl leading-none select-none">
                &ldquo;
              </span>

              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    variant="Bold"
                    className="text-primary"
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed">{t.quote}</p>

              <div className="mt-6 flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <span className="text-primary text-xs font-bold">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {t.role} &middot; {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
