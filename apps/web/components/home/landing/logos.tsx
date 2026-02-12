'use client'

import * as motion from 'motion/react-client'

const COMPANIES = [
  'Acme Corp',
  'Globex',
  'Soylent',
  'Initech',
  'Umbrella',
  'Stark Industries',
  'Wayne Enterprises',
  'Cyberdyne',
  'Oscorp',
  'Aperture',
]

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div className="text-muted-foreground/40 flex items-center gap-2 px-6 select-none">
      <div className="bg-muted-foreground/10 h-7 w-7 shrink-0 rounded-lg" />
      <span className="whitespace-nowrap text-sm font-semibold tracking-tight">
        {name}
      </span>
    </div>
  )
}

export function Logos() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="border-y py-10"
    >
      <div className="mx-auto max-w-375 px-4 sm:px-6 lg:px-8">
        <p className="text-muted-foreground mb-6 text-center text-xs font-medium tracking-widest uppercase">
          Trusted by forward-thinking companies
        </p>
      </div>

      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r" />
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l" />

        <div className="flex animate-[marquee_30s_linear_infinite]">
          {[...COMPANIES, ...COMPANIES].map((name, i) => (
            <LogoPlaceholder key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
