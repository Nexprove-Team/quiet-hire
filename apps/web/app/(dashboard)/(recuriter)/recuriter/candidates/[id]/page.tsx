'use client'

import { use } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import { Badge } from '@hackhyre/ui/components/badge'
import { Button } from '@hackhyre/ui/components/button'
import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import { Skeleton } from '@hackhyre/ui/components/skeleton'
import {
  ArrowLeft,
  Briefcase,
  Location,
  Calendar,
  Star,
  TickCircle,
  Sms,
  LinkIcon,
  MagicStar,
  People,
  Send,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { APPLICATION_STATUS_CONFIG } from '@/lib/constants'
import { useRecruiterCandidateDetail } from '@/hooks/use-recruiter-candidates'
import { useScheduleInterviewSheet } from '@/components/dashboard/schedule-interview-sheet'
import { useComposeEmailSheet } from '@/components/dashboard/compose-email-sheet'
import type { Icon } from '@hackhyre/ui/icons'

// ── ScoreRing (96x96) ───────────────────────────────────────────────
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
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
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

// ── InfoRow ─────────────────────────────────────────────────────────
function InfoRow({
  icon: IconCmp,
  label,
  value,
}: {
  icon: Icon
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
        <IconCmp size={15} variant="Bold" className="text-muted-foreground" />
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

// ── Loading Skeleton ────────────────────────────────────────────────
function CandidateDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────
export default function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: candidate, isLoading } = useRecruiterCandidateDetail(id)
  const openSchedule = useScheduleInterviewSheet((s) => s.open)
  const openCompose = useComposeEmailSheet((s) => s.open)

  if (isLoading) return <CandidateDetailSkeleton />

  if (!candidate) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground w-fit gap-2"
          asChild
        >
          <Link href="/recuriter/candidates">
            <ArrowLeft size={16} variant="Linear" />
            Back to Candidates
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <People
            size={40}
            variant="Linear"
            className="text-muted-foreground/30 mb-3"
          />
          <p className="text-muted-foreground text-[13px] font-medium">
            Candidate not found
          </p>
          <p className="text-muted-foreground/70 mt-1 text-[12px]">
            This candidate may have been removed or doesn&apos;t exist.
          </p>
        </div>
      </div>
    )
  }

  const analysis = candidate.matchAnalysis
  const allJobSkills = new Set(candidate.allJobSkills)

  const initials = candidate.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground w-fit gap-2"
        asChild
      >
        <Link href="/recuriter/candidates">
          <ArrowLeft size={16} variant="Linear" />
          Back to Candidates
        </Link>
      </Button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <Avatar className="h-14 w-14 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="font-mono text-2xl font-bold tracking-tight">
            {candidate.name}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-[13px]">
            {candidate.headline ?? 'Applicant'}
            {candidate.location && <> &middot; {candidate.location}</>}
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* AI Match Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                  <MagicStar
                    size={16}
                    variant="Bold"
                    className="text-primary"
                  />
                  AI Match Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                    <ScoreRing score={candidate.bestMatchScore} />
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground text-[13px] leading-relaxed">
                        {analysis.feedback}
                      </p>
                      {analysis.strengths.length > 0 && (
                        <div className="mt-4">
                          <p className="mb-1.5 text-[12px] font-semibold text-emerald-600">
                            Strengths
                          </p>
                          <ul className="space-y-1.5">
                            {analysis.strengths.map((s, i) => (
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
                      {analysis.gaps.length > 0 && (
                        <div className="mt-3">
                          <p className="mb-1.5 text-[12px] font-semibold text-amber-600">
                            Gaps &amp; Suggestions
                          </p>
                          <ul className="space-y-1.5">
                            {analysis.gaps.map((g, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay:
                                    0.5 +
                                    analysis.strengths.length * 0.08 +
                                    i * 0.08,
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
                ) : (
                  <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                    <ScoreRing score={candidate.bestMatchScore} />
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground text-[13px] leading-relaxed">
                        No AI analysis available for this candidate yet. The
                        analysis will be generated once the application is
                        processed.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* About (conditional) */}
          {candidate.bio && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-[15px] font-semibold">
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-[13px] leading-relaxed">
                    {candidate.bio}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Skills (conditional) */}
          {candidate.skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-[15px] font-semibold">
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, i) => {
                      const isMatch = allJobSkills.has(skill.toLowerCase())
                      return (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04, duration: 0.2 }}
                        >
                          <Badge
                            variant={isMatch ? 'default' : 'secondary'}
                            className={cn(
                              'gap-1 px-2.5 py-1 text-[12px] font-medium',
                              isMatch &&
                                'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15'
                            )}
                          >
                            {isMatch && (
                              <TickCircle
                                size={11}
                                variant="Bold"
                                className="text-emerald-500"
                              />
                            )}
                            {skill}
                          </Badge>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-x-6">
                  <InfoRow icon={Sms} label="Email" value={candidate.email} />
                  {candidate.location && (
                    <InfoRow
                      icon={Location}
                      label="Location"
                      value={candidate.location}
                    />
                  )}
                  <InfoRow
                    icon={Briefcase}
                    label="Experience"
                    value={
                      candidate.experienceYears
                        ? `${candidate.experienceYears} Years`
                        : '—'
                    }
                  />
                  {candidate.linkedinUrl && (
                    <InfoRow
                      icon={LinkIcon}
                      label="LinkedIn"
                      value={
                        <span className="text-primary">
                          {candidate.linkedinUrl}
                        </span>
                      }
                    />
                  )}
                  {candidate.githubUrl && (
                    <InfoRow
                      icon={LinkIcon}
                      label="GitHub"
                      value={
                        <span className="text-primary">
                          {candidate.githubUrl}
                        </span>
                      }
                    />
                  )}
                  {candidate.twitterUrl && (
                    <InfoRow
                      icon={LinkIcon}
                      label="Twitter"
                      value={
                        <span className="text-primary">
                          {candidate.twitterUrl}
                        </span>
                      }
                    />
                  )}
                  {candidate.portfolioUrl && (
                    <InfoRow
                      icon={LinkIcon}
                      label="Portfolio"
                      value={
                        <span className="text-primary">
                          {candidate.portfolioUrl}
                        </span>
                      }
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Applications */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Applications
                  <span className="text-muted-foreground ml-2 text-[12px] font-normal">
                    ({candidate.applications.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {candidate.applications.length === 0 ? (
                  <p className="text-muted-foreground py-4 text-center text-[12px]">
                    No applications yet
                  </p>
                ) : (
                  candidate.applications.map((app) => {
                    const statusConfig = APPLICATION_STATUS_CONFIG[app.status]
                    const score = app.relevanceScore
                    return (
                      <div
                        key={app.id}
                        className="rounded-lg border p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-semibold">
                            {app.jobTitle}
                          </p>
                          {score !== null && (
                            <span
                              className={cn(
                                'text-[11px] font-bold tabular-nums shrink-0',
                                Math.round(score * 100) >= 80
                                  ? 'text-emerald-500'
                                  : Math.round(score * 100) >= 65
                                    ? 'text-amber-500'
                                    : 'text-rose-500'
                              )}
                            >
                              {Math.round(score * 100)}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={statusConfig?.variant as 'default'}
                            className={cn(
                              'text-[10px] font-medium',
                              statusConfig?.className
                            )}
                          >
                            {statusConfig?.label}
                          </Badge>
                          <span className="text-muted-foreground text-[11px]">
                            {new Date(app.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full gap-2 rounded-lg text-[13px]"
                  onClick={() =>
                    openCompose({
                      to: candidate.email,
                      candidateName: candidate.name,
                    })
                  }
                >
                  <Send size={14} variant="Linear" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-lg text-[13px]"
                  onClick={() =>
                    openSchedule({
                      candidateName: candidate.name,
                      candidateEmail: candidate.email,
                    })
                  }
                >
                  <Calendar size={14} variant="Linear" />
                  Schedule Interview
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-lg text-[13px]"
                >
                  <People size={14} variant="Linear" />
                  Add to Talent Pool
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
