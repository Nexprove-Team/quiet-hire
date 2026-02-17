'use client'

import { use, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
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
import { Skeleton } from '@hackhyre/ui/components/skeleton'
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
  Clock,
  TickCircle,
  Send,
  Edit,
  LinkIcon,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { APPLICATION_STATUS_CONFIG } from '@/lib/constants'
import { useApplication } from '@/hooks/use-applications'
import type { Icon } from '@hackhyre/ui/icons'

function formatSalary(
  min: number | null,
  max: number | null,
  currency: string
) {
  if (!min && !max) return null
  const fmt = (v: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(v)
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max!)}`
}

function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatEmploymentType(type: string) {
  return type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}


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
      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
        <Icon size={15} variant="Bold" className="text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-[13px] font-medium">{value}</p>
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
        <h3 className="text-[13px] font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className="text-muted-foreground flex items-start gap-2.5 text-[13px]"
          >
            <span className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const percentage = Math.round(score * 100)
  const circumference = 2 * Math.PI * 40
  const offset = circumference - score * circumference

  const color =
    percentage >= 80
      ? 'text-emerald-500'
      : percentage >= 65
        ? 'text-amber-500'
        : 'text-rose-500'

  const strokeColor =
    percentage >= 80
      ? 'stroke-emerald-500'
      : percentage >= 65
        ? 'stroke-amber-500'
        : 'stroke-rose-500'

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="-rotate-90" width="96" height="96" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          className="stroke-muted"
          strokeWidth="6"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          className={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-xl font-bold tabular-nums', color)}>
          {percentage}%
        </span>
        <span className="text-muted-foreground text-[10px] font-medium">
          Match
        </span>
      </div>
    </div>
  )
}

interface TimelineEvent {
  id: string
  type: 'applied' | 'status_change'
  title: string
  description: string
  timestamp: Date | string
}

const TIMELINE_ICON_MAP: Record<
  TimelineEvent['type'],
  { icon: Icon; className: string }
> = {
  applied: { icon: Briefcase, className: 'bg-blue-500/10 text-blue-600' },
  status_change: {
    icon: TickCircle,
    className: 'bg-emerald-500/10 text-emerald-600',
  },
}

const STATUS_LABELS: Record<string, string> = {
  not_reviewed: 'Submitted',
  under_review: 'Under Review',
  interviewing: 'Interviewing',
  rejected: 'Rejected',
  hired: 'Hired',
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div>
        <Skeleton className="mb-2 h-8 w-72" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function ApplicationDetailPage({
  params,
}: PageProps<'/applications/[id]'>) {
  const { id } = use(params)
  const { data: app, isLoading, error } = useApplication(id)

  const timeline = useMemo(() => {
    if (!app) return []
    const events: TimelineEvent[] = [
      {
        id: 'tl-applied',
        type: 'applied',
        title: 'Application submitted',
        description: `You applied for ${app.job.title}`,
        timestamp: app.appliedAt,
      },
    ]
    if (app.status !== 'not_reviewed') {
      events.push({
        id: 'tl-status',
        type: 'status_change',
        title: `Status: ${STATUS_LABELS[app.status] ?? app.status}`,
        description: `Your application is now ${(STATUS_LABELS[app.status] ?? app.status).toLowerCase()}`,
        timestamp: app.appliedAt,
      })
    }
    return events
  }, [app])

  if (isLoading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground w-fit gap-2"
          asChild
        >
          <Link href="/applications">
            <ArrowLeft size={16} variant="Linear" />
            Back to Applications
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <DocumentText
            size={40}
            variant="Linear"
            className="text-muted-foreground/30 mb-3"
          />
          <p className="text-muted-foreground text-[13px] font-medium">
            Failed to load application
          </p>
          <p className="text-muted-foreground/70 mt-1 text-[12px]">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground w-fit gap-2"
          asChild
        >
          <Link href="/applications">
            <ArrowLeft size={16} variant="Linear" />
            Back to Applications
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <DocumentText
            size={40}
            variant="Linear"
            className="text-muted-foreground/30 mb-3"
          />
          <p className="text-muted-foreground text-[13px] font-medium">
            Application not found
          </p>
          <p className="text-muted-foreground/70 mt-1 text-[12px]">
            This application may have been removed or you don't have access.
          </p>
        </div>
      </div>
    )
  }

  const statusConfig = APPLICATION_STATUS_CONFIG[app.status]
  const score = app.relevanceScore ?? 0
  const salary = formatSalary(
    app.job.salaryMin,
    app.job.salaryMax,
    app.job.salaryCurrency
  )
  const companyName = app.company?.name ?? 'Unknown'
  const matchFeedback = app.matchAnalysis?.feedback ?? null
  const matchStrengths = app.matchAnalysis?.strengths ?? []
  const matchGaps = app.matchAnalysis?.gaps ?? []

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground w-fit gap-2"
        asChild
      >
        <Link href="/applications">
          <ArrowLeft size={16} variant="Linear" />
          Back to Applications
        </Link>
      </Button>

      {/* Title + Status */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-bold tracking-tight">
            {app.job.title}
          </h1>
          <Badge
            variant={statusConfig?.variant as 'default'}
            className={cn('text-[11px] font-medium', statusConfig?.className)}
          >
            {statusConfig?.label}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1.5 text-[13px]">
          {companyName} &middot; Applied {formatDate(app.appliedAt)}
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Match Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Match Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                  <ScoreRing score={score} />
                  <div className="min-w-0 flex-1">
                    {matchFeedback && (
                      <p className="text-muted-foreground text-[13px] leading-relaxed">
                        {matchFeedback}
                      </p>
                    )}
                    {!matchFeedback && (
                      <p className="text-muted-foreground/60 text-[13px] leading-relaxed italic">
                        No match analysis available yet.
                      </p>
                    )}
                    {matchStrengths.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-1.5 text-[12px] font-semibold text-emerald-600">
                          Strengths
                        </p>
                        <ul className="space-y-1.5">
                          {matchStrengths.map((s, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.5 + i * 0.08,
                                duration: 0.2,
                              }}
                              className="text-muted-foreground flex items-start gap-2 text-[12px]"
                            >
                              <TickCircle
                                size={13}
                                variant="Bold"
                                className="mt-0.5 shrink-0 text-emerald-500"
                              />
                              {s}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {matchGaps.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-1.5 text-[12px] font-semibold text-amber-600">
                          Suggestions
                        </p>
                        <ul className="space-y-1.5">
                          {matchGaps.map((g, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay:
                                  0.5 + matchStrengths.length * 0.08 + i * 0.08,
                                duration: 0.2,
                              }}
                              className="text-muted-foreground flex items-start gap-2 text-[12px]"
                            >
                              <Star
                                size={13}
                                variant="Bold"
                                className="mt-0.5 shrink-0 text-amber-500"
                              />
                              {g}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* About this Role */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  About this Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  {app.job.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Requirements + Responsibilities + Skills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <Card>
              <CardContent className="space-y-6 pt-6">
                {app.job.responsibilities.length > 0 && (
                  <ListSection
                    icon={TaskSquare}
                    title="Responsibilities"
                    items={app.job.responsibilities}
                  />
                )}
                {app.job.requirements.length > 0 && (
                  <>
                    <Separator />
                    <ListSection
                      icon={DocumentText}
                      title="Requirements"
                      items={app.job.requirements}
                    />
                  </>
                )}
                {app.job.skills.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Code
                          size={16}
                          variant="Bold"
                          className="text-primary"
                        />
                        <h3 className="text-[13px] font-semibold">Skills</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {app.job.skills.map((skill, i) => (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04, duration: 0.2 }}
                          >
                            <Badge
                              variant="secondary"
                              className="px-2.5 py-1 text-[12px] font-medium"
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

          {/* Your Application */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Your Application
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Cover Letter */}
                {app.coverLetter ? (
                  <div>
                    <p className="text-muted-foreground mb-2 text-[12px] font-medium tracking-wider uppercase">
                      Cover Letter
                    </p>
                    <p className="text-muted-foreground text-[13px] leading-relaxed">
                      {app.coverLetter}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground mb-2 text-[12px] font-medium tracking-wider uppercase">
                      Cover Letter
                    </p>
                    <p className="text-muted-foreground/60 text-[13px] italic">
                      No cover letter submitted
                    </p>
                  </div>
                )}

                <Separator />

                {/* Attachments */}
                <div>
                  <p className="text-muted-foreground mb-3 text-[12px] font-medium tracking-wider uppercase">
                    Attachments
                  </p>
                  <div className="space-y-2">
                    {app.resumeUrl && (
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                            <DocumentText
                              size={15}
                              variant="Bold"
                              className="text-muted-foreground"
                            />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium">Resume</p>
                            <p className="text-muted-foreground text-[11px]">
                              PDF document
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[12px]"
                        >
                          View
                        </Button>
                      </div>
                    )}
                    {app.linkedinUrl && (
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                            <LinkIcon
                              size={15}
                              variant="Bold"
                              className="text-muted-foreground"
                            />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium">LinkedIn</p>
                            <p className="text-muted-foreground text-[11px]">
                              {app.linkedinUrl}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[12px]"
                        >
                          Open
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-x-6">
                  <InfoRow
                    icon={Location}
                    label="Location"
                    value={
                      <span className="flex items-center gap-1.5">
                        {app.job.location ?? 'N/A'}
                        {app.job.isRemote && (
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[9px]"
                          >
                            Remote
                          </Badge>
                        )}
                      </span>
                    }
                  />
                  <InfoRow
                    icon={Briefcase}
                    label="Employment Type"
                    value={formatEmploymentType(app.job.employmentType)}
                  />
                  <InfoRow
                    icon={Star}
                    label="Experience Level"
                    value={
                      <span className="capitalize">
                        {app.job.experienceLevel}
                      </span>
                    }
                  />
                  {salary && (
                    <InfoRow
                      icon={DollarCircle}
                      label="Salary Range"
                      value={salary}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Application Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {[...timeline].reverse().map((event, i) => {
                  const config = TIMELINE_ICON_MAP[event.type]
                  const EventIcon = config?.icon ?? Clock
                  const iconClass =
                    config?.className ?? 'bg-muted text-muted-foreground'

                  return (
                    <div key={event.id} className="flex gap-3 py-2.5">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                            iconClass
                          )}
                        >
                          <EventIcon size={14} variant="Bold" />
                        </div>
                        {i < timeline.length - 1 && (
                          <div className="bg-border mt-1 w-px flex-1" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pb-1">
                        <p className="text-[13px] leading-tight font-medium">
                          {event.title}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-[12px] leading-tight">
                          {event.description}
                        </p>
                        <p className="text-muted-foreground/60 mt-1 text-[11px]">
                          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full gap-2 rounded-lg text-[13px]">
                  <Send size={14} variant="Linear" />
                  Message Recruiter
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-lg text-[13px]"
                >
                  <Edit size={14} variant="Linear" />
                  Update Application
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive w-full gap-2 rounded-lg text-[13px]"
                >
                  Withdraw Application
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
