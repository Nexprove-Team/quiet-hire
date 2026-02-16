'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'motion/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import { Button } from '@hackhyre/ui/components/button'
import { Badge } from '@hackhyre/ui/components/badge'
import { Separator } from '@hackhyre/ui/components/separator'
import {
  ArrowLeft,
  Briefcase,
  Location,
  Calendar,
  DollarCircle,
  Star,
  DocumentText,
  TaskSquare,
  Code,
  Bookmark,
  Send,
  Global,
  Building,
  People,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { toDisplayJob } from '../(components)/mock-data'
import type { PublicJob } from '../(components)/mock-data'
import { useJobById, usePublicJobs } from '@/hooks/use-jobs'
import { useSavedJobs } from '../(components)/use-saved-jobs'
import { useCompanySheet } from '../(components)/use-company-sheet'
import { CompanySheet } from '../(components)/company-sheet'
import { useApplySheet } from '../(components)/use-apply-sheet'
import { ApplySheet } from '../(components)/apply-sheet'

// ── Force light mode via CSS variable overrides ───────────────────────

const LIGHT_VARS: React.CSSProperties = {
  '--background': 'oklch(0.985 0 0)',
  '--foreground': 'oklch(0.145 0.005 285)',
  '--card': 'oklch(1 0 0)',
  '--card-foreground': 'oklch(0.145 0.005 285)',
  '--popover': 'oklch(1 0 0)',
  '--popover-foreground': 'oklch(0.145 0.005 285)',
  '--secondary': 'oklch(0.955 0.003 260)',
  '--secondary-foreground': 'oklch(0.205 0.005 260)',
  '--muted': 'oklch(0.955 0.003 260)',
  '--muted-foreground': 'oklch(0.52 0.01 260)',
  '--accent': 'oklch(0.955 0.04 155)',
  '--accent-foreground': 'oklch(0.145 0.005 285)',
  '--destructive': 'oklch(0.58 0.22 25)',
  '--destructive-foreground': 'oklch(0.985 0 0)',
  '--border': 'oklch(0.92 0.005 260)',
  '--input': 'oklch(0.92 0.005 260)',
  colorScheme: 'light',
} as React.CSSProperties

// ── Mock detail data (in real app, fetched from API) ──────────────────

interface JobDetails {
  description: string
  responsibilities: string[]
  requirements: string[]
  skills: string[]
}

const DEFAULT_DETAILS: JobDetails = {
  description:
    'We are looking for a talented professional to join our growing team. You will work closely with cross-functional teams to deliver high-quality products that delight our users. This is an exciting opportunity to shape the future of our platform and make a real impact.',
  responsibilities: [
    'Collaborate with product managers and engineers to define and implement innovative design solutions',
    'Create wireframes, prototypes, and high-fidelity mockups to effectively communicate design ideas',
    'Conduct user research and usability testing to gather insights and iterate on designs',
    'Maintain and contribute to the design system ensuring consistency across all products',
    'Present design decisions to stakeholders and incorporate feedback effectively',
  ],
  requirements: [
    'Proven experience in a similar role with a strong portfolio showcasing your work',
    'Proficiency in modern design tools such as Figma, Sketch, or Adobe Creative Suite',
    'Strong understanding of user-centered design principles and methodologies',
    'Excellent communication skills and ability to work in a collaborative environment',
    'Ability to manage multiple projects and meet tight deadlines',
  ],
  skills: [
    'Figma',
    'Sketch',
    'Prototyping',
    'User Research',
    'Design Systems',
    'Typography',
    'Interaction Design',
    'Responsive Design',
  ],
}

const JOB_DETAILS: Record<string, Partial<JobDetails>> = {
  '1': {
    description:
      'Amazon is seeking a Senior UI/UX Designer to lead the design of next-generation e-commerce experiences. You will partner with product and engineering teams to define intuitive user flows, create high-fidelity prototypes, and champion design excellence across our platform.',
    skills: [
      'Figma',
      'Prototyping',
      'User Research',
      'A/B Testing',
      'Design Systems',
      'Accessibility',
      'Motion Design',
    ],
  },
  '2': {
    description:
      'Google is hiring a Junior UI/UX Designer to join our Cloud team. This is a fantastic opportunity for early-career designers to learn from world-class mentors, contribute to meaningful products used by millions, and grow your craft in a supportive environment.',
    skills: [
      'Figma',
      'Material Design',
      'User Research',
      'Prototyping',
      'HTML/CSS',
      'Illustration',
    ],
  },
  '8': {
    description:
      'Meta is looking for a Frontend Developer to build performant, accessible interfaces for our social platform. You will work with React and modern web technologies to deliver experiences that connect billions of people worldwide.',
    responsibilities: [
      'Build and maintain high-performance React components for the Meta platform',
      'Collaborate with designers to implement pixel-perfect, accessible UIs',
      'Optimize bundle sizes and rendering performance for global audiences',
      'Write comprehensive tests and documentation for shared libraries',
      'Participate in code reviews and mentor junior engineers',
    ],
    requirements: [
      '4+ years of experience with React and TypeScript in production environments',
      'Deep understanding of web performance, accessibility, and responsive design',
      'Experience with state management libraries and modern build tools',
      'Strong CS fundamentals and problem-solving skills',
      'Track record of shipping high-quality features at scale',
    ],
    skills: [
      'React',
      'TypeScript',
      'Next.js',
      'GraphQL',
      'CSS-in-JS',
      'Testing',
      'Performance',
      'Accessibility',
    ],
  },
}

function getJobDetails(
  id: string,
  raw: import('@/actions/jobs').PublicJobListItem | null | undefined
): JobDetails {
  // Use real DB data when available, fall back to defaults
  if (raw) {
    return {
      description: raw.description || DEFAULT_DETAILS.description,
      responsibilities:
        raw.responsibilities.length > 0
          ? raw.responsibilities
          : DEFAULT_DETAILS.responsibilities,
      requirements:
        raw.requirements.length > 0
          ? raw.requirements
          : DEFAULT_DETAILS.requirements,
      skills:
        raw.skills.length > 0 ? raw.skills : DEFAULT_DETAILS.skills,
    }
  }
  const overrides = JOB_DETAILS[id]
  return { ...DEFAULT_DETAILS, ...overrides }
}

// ── Helpers ───────────────────────────────────────────────────────────

function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// ── Sub-components ────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Briefcase
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
        <Icon size={15} variant="Bold" className="text-neutral-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium tracking-wider text-neutral-500 uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-[13px] font-medium text-neutral-900">
          {value}
        </p>
      </div>
    </div>
  )
}

function ListSection({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof DocumentText
  title: string
  items: string[]
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} variant="Bold" className="text-primary" />
        <h3 className="text-[13px] font-semibold text-neutral-900">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className="flex items-start gap-2.5 text-[13px] text-neutral-600"
          >
            <span className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function CompanyLogo({ job }: { job: PublicJob }) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white',
        job.logoColor
      )}
    >
      {job.company === 'Apple' ? (
        <svg
          width="16"
          height="20"
          viewBox="0 0 14 17"
          fill="currentColor"
          className="text-white"
        >
          <path d="M13.2 12.8c-.3.7-.7 1.3-1.1 1.8-.6.8-1.1 1.3-1.5 1.6-.6.5-1.3.7-2 .7-.5 0-1.1-.1-1.8-.4-.7-.3-1.3-.4-1.8-.4s-1.1.1-1.8.4c-.7.3-1.2.4-1.7.4-.7 0-1.4-.3-2-.8C.9 15.5.4 14.8 0 13.8c-.1-.4.1-.7.4-.9.3-.1.7 0 .8.3.3.8.7 1.4 1.2 1.8.4.3.8.5 1.2.5.3 0 .8-.1 1.4-.4.6-.3 1.2-.4 1.7-.4.5 0 1 .1 1.7.4.6.3 1.1.4 1.4.4.4 0 .9-.2 1.3-.5.4-.4.8-.9 1.1-1.6.2-.4.4-.9.5-1.3.1-.3-.1-.6-.3-.8-.8-.4-1.4-.9-1.8-1.6-.5-.7-.7-1.5-.7-2.4 0-1 .3-1.9.9-2.6.5-.5 1-.9 1.7-1.2.2-.1.5 0 .7.2.1.2.1.5-.1.6-.5.2-.9.5-1.3.9-.4.5-.6 1.2-.6 1.9 0 .8.2 1.4.6 2 .4.6.9 1 1.5 1.3.2.1.3.4.3.6 0 .1 0 .2-.1.3-.2.5-.3 1-.6 1.5z" />
          <path d="M10.1 0c.1.7-.2 1.5-.7 2.2-.6.8-1.3 1.3-2.1 1.2-.1-.7.2-1.4.7-2.1C8.6.5 9.3.1 10.1 0z" />
        </svg>
      ) : (
        <span className="text-base font-bold">{job.logoLetter}</span>
      )}
    </div>
  )
}

function SimilarJobCard({ job }: { job: PublicJob }) {
  return (
    <Link
      href={`/jobs-listing/${job.id}`}
      className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-3 transition-shadow hover:shadow-sm"
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white',
          job.logoColor
        )}
      >
        {job.company === 'Apple' ? (
          <svg
            width="10"
            height="12"
            viewBox="0 0 14 17"
            fill="currentColor"
            className="text-white"
          >
            <path d="M13.2 12.8c-.3.7-.7 1.3-1.1 1.8-.6.8-1.1 1.3-1.5 1.6-.6.5-1.3.7-2 .7-.5 0-1.1-.1-1.8-.4-.7-.3-1.3-.4-1.8-.4s-1.1.1-1.8.4c-.7.3-1.2.4-1.7.4-.7 0-1.4-.3-2-.8C.9 15.5.4 14.8 0 13.8c-.1-.4.1-.7.4-.9.3-.1.7 0 .8.3.3.8.7 1.4 1.2 1.8.4.3.8.5 1.2.5.3 0 .8-.1 1.4-.4.6-.3 1.2-.4 1.7-.4.5 0 1 .1 1.7.4.6.3 1.1.4 1.4.4.4 0 .9-.2 1.3-.5.4-.4.8-.9 1.1-1.6.2-.4.4-.9.5-1.3.1-.3-.1-.6-.3-.8-.8-.4-1.4-.9-1.8-1.6-.5-.7-.7-1.5-.7-2.4 0-1 .3-1.9.9-2.6.5-.5 1-.9 1.7-1.2.2-.1.5 0 .7.2.1.2.1.5-.1.6-.5.2-.9.5-1.3.9-.4.5-.6 1.2-.6 1.9 0 .8.2 1.4.6 2 .4.6.9 1 1.5 1.3.2.1.3.4.3.6 0 .1 0 .2-.1.3-.2.5-.3 1-.6 1.5z" />
            <path d="M10.1 0c.1.7-.2 1.5-.7 2.2-.6.8-1.3 1.3-2.1 1.2-.1-.7.2-1.4.7-2.1C8.6.5 9.3.1 10.1 0z" />
          </svg>
        ) : (
          <span className="text-xs font-bold">{job.logoLetter}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-neutral-900">
          {job.title}
        </p>
        <p className="text-[11px] text-neutral-500">
          {job.company} &middot; {job.salary}
        </p>
      </div>
    </Link>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: rawJob, isLoading } = useJobById(id)
  const { data: rawSimilar } = usePublicJobs({})
  const toggleSave = useSavedJobs((s) => s.toggle)
  const saved = useSavedJobs((s) => s.saved)
  const openCompanySheet = useCompanySheet((s) => s.open)
  const openApplySheet = useApplySheet((s) => s.open)

  const job = rawJob ? toDisplayJob(rawJob, 0) : null

  if (!isLoading && !job) {
    notFound()
  }

  if (isLoading || !job) {
    return (
      <div className="bg-white text-neutral-900" style={LIGHT_VARS}>
        <div className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="h-8 w-32 animate-pulse rounded-lg bg-neutral-100" />
            <div className="h-16 animate-pulse rounded-2xl bg-neutral-100" />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="h-48 animate-pulse rounded-2xl bg-neutral-100" />
                <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
              </div>
              <div className="h-48 animate-pulse rounded-2xl bg-neutral-100" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const details = getJobDetails(id, rawJob)
  const isSaved = saved[job.id] ?? job.saved

  const allJobs = (rawSimilar ?? []).map((item, i) => toDisplayJob(item, i))
  const similarJobs = allJobs
    .filter(
      (j) =>
        j.id !== job.id &&
        (j.company === job.company || j.tags.some((t) => job.tags.includes(t)))
    )
    .slice(0, 4)

  const locationLabel =
    job.locationType === 'remote'
      ? 'Remote'
      : job.locationType === 'hybrid'
        ? 'Hybrid'
        : 'On-site'

  return (
    <div className="bg-white text-neutral-900" style={LIGHT_VARS}>
      <div className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Back + Actions Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="w-fit gap-2 bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              asChild
            >
              <Link href="/jobs-listing">
                <ArrowLeft size={16} variant="Linear" />
                Back to Jobs
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2 rounded-lg text-[13px]',
                  isSaved
                    ? 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                )}
                onClick={() => toggleSave(job.id)}
              >
                <Bookmark size={14} variant={isSaved ? 'Bold' : 'Linear'} />
                {isSaved ? 'Saved' : 'Save Job'}
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 gap-2 rounded-lg text-[13px] font-semibold text-neutral-900"
                onClick={() => openApplySheet(job.id, job.title, job.company)}
              >
                <Send size={14} variant="Linear" />
                Apply Now
              </Button>
            </div>
          </div>

          {/* Title + Company */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <CompanyLogo job={job} />
              <div className="min-w-0">
                <h1 className="font-mono text-2xl font-bold tracking-tight text-neutral-900">
                  {job.title}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-neutral-500">
                  <span className="font-medium text-neutral-700">
                    {job.company}
                  </span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1">
                    <Location size={12} variant="Linear" />
                    {job.location}
                  </span>
                  <span>&middot;</span>
                  <Badge
                    variant="outline"
                    className="border-neutral-200 bg-white px-2 py-0 text-[11px] font-medium text-neutral-600"
                  >
                    {locationLabel}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded-full border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[10.5px] font-medium text-neutral-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column — Description, Requirements, Job Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.3 }}
              >
                <Card className="border-neutral-200 bg-white shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[15px] font-semibold text-neutral-900">
                      About this role
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[13px] leading-relaxed text-neutral-600">
                      {details.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Requirements + Responsibilities + Skills */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Card className="border-neutral-200 bg-white shadow-none">
                  <CardContent className="space-y-6 pt-6">
                    {details.responsibilities.length > 0 && (
                      <ListSection
                        icon={TaskSquare}
                        title="Responsibilities"
                        items={details.responsibilities}
                      />
                    )}
                    {details.requirements.length > 0 && (
                      <>
                        <Separator className="bg-neutral-200" />
                        <ListSection
                          icon={DocumentText}
                          title="Requirements"
                          items={details.requirements}
                        />
                      </>
                    )}
                    {details.skills.length > 0 && (
                      <>
                        <Separator className="bg-neutral-200" />
                        <div>
                          <div className="mb-3 flex items-center gap-2">
                            <Code
                              size={16}
                              variant="Bold"
                              className="text-primary"
                            />
                            <h3 className="text-[13px] font-semibold text-neutral-900">
                              Skills
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {details.skills.map((skill, i) => (
                              <motion.div
                                key={skill}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: i * 0.04,
                                  duration: 0.2,
                                }}
                              >
                                <Badge
                                  variant="secondary"
                                  className="border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[12px] font-medium text-neutral-700"
                                >
                                  {skill}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Job Details */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                <Card className="border-neutral-200 bg-white shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[15px] font-semibold text-neutral-900">
                      Job Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-x-6 sm:grid-cols-2">
                      <InfoRow
                        icon={Briefcase}
                        label="Employment Type"
                        value={job.employmentType.join(', ')}
                      />
                      <InfoRow
                        icon={Star}
                        label="Experience Level"
                        value={capitalizeFirst(job.experienceLevel)}
                      />
                      <InfoRow
                        icon={Location}
                        label="Location"
                        value={
                          <span className="flex items-center gap-1.5">
                            {job.location}
                            <Badge
                              variant="outline"
                              className="border-neutral-200 px-1 py-0 text-[9px] text-neutral-600"
                            >
                              {locationLabel}
                            </Badge>
                          </span>
                        }
                      />
                      <InfoRow
                        icon={DollarCircle}
                        label="Salary"
                        value={job.salary}
                      />
                      <InfoRow
                        icon={Calendar}
                        label="Posted"
                        value={job.date}
                      />
                      <InfoRow
                        icon={People}
                        label="Schedule"
                        value={job.workingSchedule.join(', ')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column — Company Info + Similar Jobs */}
            <div className="space-y-6">
              {/* Company Overview */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.3 }}
              >
                <Card className="border-neutral-200 bg-white shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[15px] font-semibold text-neutral-900">
                      About {job.company}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white',
                          job.logoColor
                        )}
                      >
                        {job.company === 'Apple' ? (
                          <svg
                            width="12"
                            height="15"
                            viewBox="0 0 14 17"
                            fill="currentColor"
                            className="text-white"
                          >
                            <path d="M13.2 12.8c-.3.7-.7 1.3-1.1 1.8-.6.8-1.1 1.3-1.5 1.6-.6.5-1.3.7-2 .7-.5 0-1.1-.1-1.8-.4-.7-.3-1.3-.4-1.8-.4s-1.1.1-1.8.4c-.7.3-1.2.4-1.7.4-.7 0-1.4-.3-2-.8C.9 15.5.4 14.8 0 13.8c-.1-.4.1-.7.4-.9.3-.1.7 0 .8.3.3.8.7 1.4 1.2 1.8.4.3.8.5 1.2.5.3 0 .8-.1 1.4-.4.6-.3 1.2-.4 1.7-.4.5 0 1 .1 1.7.4.6.3 1.1.4 1.4.4.4 0 .9-.2 1.3-.5.4-.4.8-.9 1.1-1.6.2-.4.4-.9.5-1.3.1-.3-.1-.6-.3-.8-.8-.4-1.4-.9-1.8-1.6-.5-.7-.7-1.5-.7-2.4 0-1 .3-1.9.9-2.6.5-.5 1-.9 1.7-1.2.2-.1.5 0 .7.2.1.2.1.5-.1.6-.5.2-.9.5-1.3.9-.4.5-.6 1.2-.6 1.9 0 .8.2 1.4.6 2 .4.6.9 1 1.5 1.3.2.1.3.4.3.6 0 .1 0 .2-.1.3-.2.5-.3 1-.6 1.5z" />
                            <path d="M10.1 0c.1.7-.2 1.5-.7 2.2-.6.8-1.3 1.3-2.1 1.2-.1-.7.2-1.4.7-2.1C8.6.5 9.3.1 10.1 0z" />
                          </svg>
                        ) : (
                          <span className="text-sm font-bold">
                            {job.logoLetter}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-neutral-900">
                          {job.company}
                        </p>
                        <p className="text-[12px] text-neutral-500">
                          Technology
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-neutral-200" />

                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-[12px] text-neutral-600">
                        <Location
                          size={14}
                          variant="Linear"
                          className="text-neutral-400"
                        />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2.5 text-[12px] text-neutral-600">
                        <Building
                          size={14}
                          variant="Linear"
                          className="text-neutral-400"
                        />
                        1,000 - 10,000 employees
                      </div>
                      <div className="flex items-center gap-2.5 text-[12px] text-neutral-600">
                        <Global
                          size={14}
                          variant="Linear"
                          className="text-neutral-400"
                        />
                        {job.company.toLowerCase().replace(/\s/g, '')}.com
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-lg border-neutral-200 bg-white text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                      onClick={() => openCompanySheet(job.company)}
                    >
                      View Company Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Apply CTA card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.3 }}
              >
                <Card className="border-0 bg-neutral-900 shadow-none">
                  <CardContent className="pt-6">
                    <h3 className="mb-1 font-mono text-lg font-bold text-white">
                      Interested in this role?
                    </h3>
                    <p className="mb-4 text-[12px] leading-relaxed text-neutral-400">
                      Apply now and take the next step in your career.
                      We&apos;ll review your application and get back to you.
                    </p>
                    <Button
                      className="bg-primary hover:bg-primary/90 w-full gap-2 rounded-lg font-semibold text-neutral-900"
                      onClick={() =>
                        openApplySheet(job.id, job.title, job.company)
                      }
                    >
                      <Send size={16} variant="Linear" />
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.3 }}
                >
                  <Card className="border-neutral-200 bg-white shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-[15px] font-semibold text-neutral-900">
                        Similar Jobs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {similarJobs.map((j) => (
                        <SimilarJobCard key={j.id} job={j} />
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sheets */}
      <CompanySheet />
      <ApplySheet />
    </div>
  )
}
