'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
  Location,
  Briefcase,
  MagicStar,
  Ranking,
  LinkIcon,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { useRecruiterCandidateDetails } from '@/hooks/use-recruiter-candidates'
import type { RecruiterCandidateDetail } from '@/actions/recruiter-candidates'

// ── Score helpers ────────────────────────────────────────────────────

function scoreColor(score: number) {
  const pct = Math.round(score * 100)
  if (pct >= 80) return { text: 'text-emerald-500', bg: 'bg-emerald-500', stroke: 'stroke-emerald-500' }
  if (pct >= 65) return { text: 'text-amber-500', bg: 'bg-amber-500', stroke: 'stroke-amber-500' }
  return { text: 'text-rose-500', bg: 'bg-rose-500', stroke: 'stroke-rose-500' }
}

function ScoreRing({ score }: { score: number }) {
  const percentage = Math.round(score * 100)
  const r = 22
  const circumference = 2 * Math.PI * r
  const offset = circumference - score * circumference
  const colors = scoreColor(score)

  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      <svg className="-rotate-90" width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" className="stroke-muted" strokeWidth="3" />
        <motion.circle
          cx="28" cy="28" r={r} fill="none"
          className={colors.stroke}
          strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('text-[13px] font-bold tabular-nums', colors.text)}>
          {percentage}%
        </span>
      </div>
    </div>
  )
}

function ScoreBar({ score, isHighest }: { score: number; isHighest: boolean }) {
  const percentage = Math.round(score * 100)
  const colors = scoreColor(score)

  return (
    <div className="flex items-center gap-3">
      <div className="bg-muted h-2.5 flex-1 overflow-hidden rounded-full">
        <motion.div
          className={cn('h-full rounded-full', colors.bg)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      <span className={cn(
        'w-10 text-right text-[13px] font-semibold tabular-nums',
        colors.text,
        isHighest && 'underline decoration-2 underline-offset-2'
      )}>
        {percentage}%
      </span>
    </div>
  )
}

// ── Skill overlap computation ────────────────────────────────────────

type SkillCategory = 'shared' | 'unique' | 'partial'

function computeSkillOverlaps(candidates: RecruiterCandidateDetail[]) {
  const skillSets = candidates.map(
    (c) => new Set(c.skills.map((s) => s.toLowerCase()))
  )
  const allSkills = new Set(skillSets.flatMap((s) => [...s]))

  const categorized = new Map<string, SkillCategory>()
  for (const skill of allSkills) {
    const count = skillSets.filter((s) => s.has(skill)).length
    if (count === candidates.length) categorized.set(skill, 'shared')
    else if (count === 1) categorized.set(skill, 'unique')
    else categorized.set(skill, 'partial')
  }

  return { categorized, skillSets }
}

const SKILL_BADGE_STYLES: Record<SkillCategory, string> = {
  shared: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  unique: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  partial: '',
}

// ── Profile link helper ──────────────────────────────────────────────

function ProfileLink({ url, label }: { url: string | null; label: string }) {
  if (!url) return <span className="text-muted-foreground text-[12px]">&mdash;</span>
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary inline-flex items-center gap-1 text-[12px] hover:underline"
    >
      <LinkIcon size={12} variant="Linear" />
      {label}
    </a>
  )
}

// ── Section label ────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-40 shrink-0 items-start pt-1">
      <span className="text-muted-foreground text-[12px] font-medium uppercase tracking-wide">
        {children}
      </span>
    </div>
  )
}

// ── Loading skeleton ─────────────────────────────────────────────────

function CompareLoadingSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="flex gap-4">
        <div className="w-40 shrink-0" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex-1 space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────

export default function CompareCandidatesPage() {
  const searchParams = useSearchParams()
  const ids = searchParams.getAll('id').slice(0, 4)

  const results = useRecruiterCandidateDetails(ids)

  const isLoading = results.some((r) => r.isLoading)
  const candidates = results
    .map((r) => r.data)
    .filter((d): d is RecruiterCandidateDetail => d != null)

  const highestScore = useMemo(
    () => Math.max(...candidates.map((c) => (c.relevance?.score ?? 0)), 0),
    [candidates]
  )

  const { categorized, skillSets } = useMemo(
    () =>
      candidates.length >= 2
        ? computeSkillOverlaps(candidates)
        : { categorized: new Map<string, SkillCategory>(), skillSets: [] as Set<string>[] },
    [candidates]
  )

  // ── Edge cases ─────────────────────────────────────────────────────

  if (ids.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Ranking size={48} variant="Linear" className="text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-[15px] font-medium">
          Select at least 2 candidates to compare
        </p>
        <p className="text-muted-foreground/70 mt-1 text-[13px]">
          Go back and select candidates from the list.
        </p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/recuriter/candidates">
            <ArrowLeft size={14} variant="Linear" />
            Back to Candidates
          </Link>
        </Button>
      </div>
    )
  }

  if (isLoading) return <CompareLoadingSkeleton count={ids.length} />

  if (candidates.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Ranking size={48} variant="Linear" className="text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-[15px] font-medium">
          Could not load enough candidates to compare
        </p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/recuriter/candidates">
            <ArrowLeft size={14} variant="Linear" />
            Back to Candidates
          </Link>
        </Button>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" asChild>
          <Link href="/recuriter/candidates">
            <ArrowLeft size={16} variant="Linear" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Compare Candidates</h1>
          <p className="text-muted-foreground text-[13px]">
            Side-by-side comparison of {candidates.length} candidates
          </p>
        </div>
      </div>

      {/* Comparison grid — horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-max space-y-4">
          {/* ── Header Row ──────────────────────────────────────── */}
          <Card>
            <CardContent className="flex gap-4 p-4">
              <SectionLabel>Candidate</SectionLabel>
              {candidates.map((c, i) => {
                const initials = c.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                return (
                  <motion.div
                    key={ids[i]}
                    className="flex flex-1 items-center gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-[12px] font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold">{c.name}</p>
                      <p className="text-muted-foreground truncate text-[11px]">
                        {c.headline ?? 'Applicant'}
                      </p>
                    </div>
                    <ScoreRing score={(c.relevance?.score ?? 0)} />
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>

          {/* ── Match Score ─────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[13px] font-semibold">
                <MagicStar size={16} variant="Bold" className="text-primary" />
                Match Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 p-4 pt-0">
              <SectionLabel>Score</SectionLabel>
              {candidates.map((c, i) => (
                <div key={ids[i]} className="flex-1">
                  <ScoreBar
                    score={(c.relevance?.score ?? 0)}
                    isHighest={(c.relevance?.score ?? 0) === highestScore}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ── Experience & Location ──────────────────────────── */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[13px] font-semibold">
                <Briefcase size={16} variant="Bold" className="text-primary" />
                Experience &amp; Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
              <div className="flex gap-4">
                <SectionLabel>Experience</SectionLabel>
                {candidates.map((c, i) => (
                  <div key={ids[i]} className="flex-1 text-[13px]">
                    {c.experienceYears ? `${c.experienceYears} years` : '—'}
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <SectionLabel>Location</SectionLabel>
                {candidates.map((c, i) => (
                  <div key={ids[i]} className="flex flex-1 items-center gap-1 text-[13px]">
                    <Location size={12} variant="Linear" className="text-muted-foreground shrink-0" />
                    {c.location ?? '—'}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Skills ─────────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[13px] font-semibold">Skills</CardTitle>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    All share
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                    Unique
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="bg-muted-foreground/40 inline-block h-2 w-2 rounded-full" />
                    Some share
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex gap-4 p-4 pt-0">
              <SectionLabel>Skills</SectionLabel>
              {candidates.map((c, i) => (
                <div key={ids[i]} className="flex flex-1 flex-wrap gap-1.5">
                  {c.skills.map((skill) => {
                    const cat = categorized.get(skill.toLowerCase()) ?? 'partial'
                    return (
                      <Badge
                        key={skill}
                        variant={cat === 'partial' ? 'secondary' : 'outline'}
                        className={cn(
                          'px-2 py-0.5 text-[10px] font-medium',
                          SKILL_BADGE_STYLES[cat]
                        )}
                      >
                        {skill}
                      </Badge>
                    )
                  })}
                  {c.skills.length === 0 && (
                    <span className="text-muted-foreground text-[12px]">&mdash;</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ── AI Analysis ────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[13px] font-semibold">
                <MagicStar size={16} variant="Bold" className="text-primary" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0">
              {/* Strengths */}
              <div className="flex gap-4">
                <SectionLabel>Strengths</SectionLabel>
                {candidates.map((c, i) => (
                  <div key={ids[i]} className="flex-1">
                    {c.relevance?.strengths && c.relevance.strengths.length > 0 ? (
                      <ul className="list-inside list-disc space-y-1">
                        {c.relevance.strengths.map((s: string, j: number) => (
                          <li key={j} className="text-[12px] leading-relaxed">
                            {s}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground text-[12px]">&mdash;</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Gaps */}
              <div className="flex gap-4">
                <SectionLabel>Gaps</SectionLabel>
                {candidates.map((c, i) => (
                  <div key={ids[i]} className="flex-1">
                    {c.relevance?.gaps && c.relevance.gaps.length > 0 ? (
                      <ul className="list-inside list-disc space-y-1">
                        {c.relevance.gaps.map((g: string, j: number) => (
                          <li key={j} className="text-muted-foreground text-[12px] leading-relaxed">
                            {g}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground text-[12px]">&mdash;</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Overall Feedback */}
              <div className="flex gap-4">
                <SectionLabel>Feedback</SectionLabel>
                {candidates.map((c, i) => (
                  <div key={ids[i]} className="flex-1">
                    {c.relevance?.feedback ? (
                      <p className="text-[12px] leading-relaxed">
                        {c.relevance.feedback}
                      </p>
                    ) : (
                      <span className="text-muted-foreground text-[12px]">&mdash;</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Profile Links ──────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[13px] font-semibold">Profile Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
              {(['LinkedIn', 'GitHub', 'Twitter', 'Portfolio'] as const).map((label) => {
                const key = {
                  LinkedIn: 'linkedinUrl',
                  GitHub: 'githubUrl',
                  Twitter: 'twitterUrl',
                  Portfolio: 'portfolioUrl',
                } as const
                return (
                  <div key={label} className="flex gap-4">
                    <SectionLabel>{label}</SectionLabel>
                    {candidates.map((c, i) => (
                      <div key={ids[i]} className="flex-1">
                        <ProfileLink url={c[key[label]]} label={label} />
                      </div>
                    ))}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
