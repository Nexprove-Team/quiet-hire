'use client'

import { motion } from 'motion/react'
import { ShieldTick, Flash, Eye, Ranking } from '@hackhyre/ui/icons'

const highlights = [
  {
    icon: Eye,
    title: 'Full Transparency',
    desc: 'See who posted the job, when, and where it was first listed.',
  },
  {
    icon: Flash,
    title: 'Direct Access',
    desc: 'Connect with hiring managers — no middlemen slowing you down.',
  },
  {
    icon: ShieldTick,
    title: 'Verified Listings',
    desc: 'Every job is verified at the source so you never chase ghosts.',
  },
  {
    icon: Ranking,
    title: 'Smart Matching',
    desc: 'Get ranked by fit, not by keyword stuffing.',
  },
]

export function AuthBrandingPanel() {
  return (
    <div className="bg-brand-black relative flex h-full w-full flex-col justify-between overflow-hidden p-10">
      <div className="absolute top-[-20%] left-[10%] size-125 rounded-full bg-[oklch(0.82_0.22_155/0.06)] blur-[120px]" />
      <div className="absolute right-[-10%] bottom-[10%] size-100 rounded-full bg-[oklch(0.82_0.22_155/0.04)] blur-[100px]" />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="font-mono text-xl font-bold text-white">
          Hack<span className="text-primary">Hyre</span>
        </span>
      </motion.div>

      <div className="relative z-10 grid grid-cols-2 gap-3">
        {highlights.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
            className="group rounded-xl border border-white/6 bg-white/3 p-4 backdrop-blur-sm transition-colors hover:border-white/10 hover:bg-white/5"
          >
            <item.icon size={22} variant="Bulk" className="text-primary mb-3" />
            <p className="text-[13px] leading-tight font-medium text-white">
              {item.title}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-white/40">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <p className="font-mono text-lg leading-snug font-semibold text-white">
          Where talent meets <span className="text-primary">opportunity.</span>
        </p>
        <p className="mt-1.5 text-xs text-white/30">
          &copy; {new Date().getFullYear()} HackHyre
        </p>
      </motion.div>
    </div>
  )
}
