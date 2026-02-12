'use client'

import Link from 'next/link'
import {
  InstagramIcon,
  Logo as LogoIcon,
  GithubIcon,
  XIcon,
} from '@hackhyre/ui/icons'
import { Send } from '@hackhyre/ui/icons'
import { usePathname } from 'next/navigation'
import { cn } from '@hackhyre/ui/lib/utils'
import * as motion from 'motion/react-client'

/* ── Link data ─────────────────────────────────────────────── */

const FOOTER_SECTIONS = [
  {
    title: 'For Job Seekers',
    links: [
      { label: 'Browse Jobs', href: '/jobs-listing' },
      { label: 'Career Resources', href: '#' },
      { label: 'Resume Builder', href: '#' },
      { label: 'Salary Insights', href: '#' },
      { label: 'Skill Assessments', href: '#' },
    ],
  },
  {
    title: 'For Employers',
    links: [
      { label: 'Post a Job', href: '#' },
      { label: 'Talent Search', href: '#' },
      { label: 'Hiring Solutions', href: '#' },
      { label: 'Employer Branding', href: '#' },
      { label: 'Pricing', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'Webinars', href: '#' },
      { label: 'Community', href: '/community' },
      { label: 'API Docs', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Partners', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Accessibility', href: '#' },
    ],
  },
] as const

const SOCIAL_LINKS = [
  {
    label: 'X (Twitter)',
    href: '#',
    icon: <XIcon />,
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Nexprove-Team/hykehyre',
    icon: <GithubIcon />,
  },
  {
    label: 'Instagram',
    href: '#',
    icon: <InstagramIcon />,
  },
] as const

const LEGAL_LINKS = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Cookies', href: '#' },
] as const

/* ── Animation variants ────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ── Footer component ──────────────────────────────────────── */

export function Footer() {
  const path = usePathname()
  const jl = path.includes('/jobs-listing')

  return (
    <footer
      className={cn(
        'border-t transition-colors duration-300 ease-in-out',
        jl
          ? 'border-neutral-800 bg-black'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950'
      )}
    >
      {/* ── CTA Banner ───────────────────────────────────── */}
      <motion.div
        className="mx-auto max-w-375 px-4 pt-16 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
      >
        <div
          className={cn(
            'bg-brand-navy relative overflow-hidden rounded-2xl px-6 py-12 sm:px-12 sm:py-16',
            jl
              ? 'border border-neutral-800'
              : 'dark:border dark:border-neutral-800'
          )}
        >
          {/* Decorative gradient blobs */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.07] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.05] blur-3xl" />

          {/* Grid pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <p className="mb-1 text-xs font-semibold tracking-widest text-[oklch(0.82_0.22_155)] uppercase">
                Get Started Today
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Join our community of ambitious professionals
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                Unlock your true potential and discover a world of opportunities
                that align with your skills, interests, and aspirations.
              </p>
            </div>
            <Link
              href="/sign-up"
              className="text-brand-navy inline-flex shrink-0 items-center gap-2 rounded-xl bg-[oklch(0.82_0.22_155)] px-6 py-3 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Get started now
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Main link grid ───────────────────────────────── */}
      <div className="mx-auto max-w-375 px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
        >
          {FOOTER_SECTIONS.map((section) => (
            <motion.div
              key={section.title}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
            >
              <h4
                className={cn(
                  'text-[13px] font-semibold tracking-tight',
                  jl
                    ? 'text-neutral-100'
                    : 'text-neutral-900 dark:text-neutral-100'
                )}
              >
                {section.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        'text-[13px] transition-colors',
                        jl
                          ? 'text-neutral-400 hover:text-white'
                          : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Newsletter strip ─────────────────────────────── */}
      <motion.div
        className="mx-auto max-w-375 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={fadeUp}
        transition={{ duration: 0.45 }}
      >
        <div
          className={cn(
            'flex flex-col items-start gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6',
            jl
              ? 'border-neutral-800 bg-neutral-900/60'
              : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60'
          )}
        >
          <div className="min-w-0">
            <p
              className={cn(
                'text-[13px] font-semibold',
                jl
                  ? 'text-white'
                  : 'text-neutral-900 dark:text-white'
              )}
            >
              Stay in the loop
            </p>
            <p
              className={cn(
                'mt-0.5 text-[12px]',
                jl
                  ? 'text-neutral-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              )}
            >
              Get the latest jobs and hiring insights delivered weekly.
            </p>
          </div>
          <form className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="email"
                placeholder="you@example.com"
                className={cn(
                  'h-10 w-full rounded-lg border pl-3 pr-3 text-[13px] transition-colors outline-none focus:border-[oklch(0.82_0.22_155)] focus:ring-1 focus:ring-[oklch(0.82_0.22_155)] sm:w-60',
                  jl
                    ? 'border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500'
                    : 'border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500'
                )}
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[oklch(0.82_0.22_155)] px-4 text-[13px] font-semibold text-neutral-900 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Subscribe
              <Send size={14} variant="Linear" />
            </button>
          </form>
        </div>
      </motion.div>

      {/* ── Divider ──────────────────────────────────────── */}
      <div className="mx-auto max-w-375 px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={cn(
            'border-t',
            jl
              ? 'border-neutral-800'
              : 'border-neutral-200 dark:border-neutral-800'
          )}
        />
      </div>

      {/* ── Bottom bar ───────────────────────────────────── */}
      <motion.div
        className="mx-auto max-w-375 px-4 pb-8 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-0.5">
              <div className="flex h-9 w-9 items-center justify-center">
                <LogoIcon />
              </div>
              <p
                className={cn(
                  'font-mono text-[15px] leading-none font-bold tracking-tight',
                  jl ? 'text-white' : 'dark:text-white'
                )}
              >
                Hack
                <span className="text-[oklch(0.82_0.22_155)]">Hyre</span>
              </p>
            </Link>
            <p
              className={cn(
                'hidden max-w-xs text-[12px] leading-relaxed sm:block',
                jl
                  ? 'text-neutral-500'
                  : 'text-neutral-400 dark:text-neutral-500'
              )}
            >
              Connecting ambitious talent with forward-thinking companies.
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-2.5">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
                  jl
                    ? 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-white'
                    : 'border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-500 dark:hover:border-neutral-600 dark:hover:text-white'
                )}
                aria-label={social.label}
                target="_blank"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Copyright bar ────────────────────────────────── */}
      <div
        className={cn(
          'border-t',
          jl
            ? 'border-neutral-800/60'
            : 'border-neutral-100 dark:border-neutral-800/60'
        )}
      >
        <div className="mx-auto flex max-w-375 flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[11px] text-neutral-500">
            &copy; {new Date().getFullYear()} HackHyre. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'text-[11px] text-neutral-500 transition-colors',
                  jl
                    ? 'hover:text-neutral-300'
                    : 'hover:text-neutral-700 dark:hover:text-neutral-300'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
