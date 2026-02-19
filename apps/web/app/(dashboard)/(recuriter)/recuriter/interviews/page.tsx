'use client'

import { useMemo } from 'react'
import { motion } from 'motion/react'
import { parseAsString, useQueryStates } from 'nuqs'
import { useDebounce } from 'use-debounce'
import { useScheduleInterviewSheet } from '@/components/dashboard/schedule-interview-sheet'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import { Badge } from '@hackhyre/ui/components/badge'
import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import { Skeleton } from '@hackhyre/ui/components/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@hackhyre/ui/components/table'
import {
  SearchNormal,
  Briefcase,
  Calendar,
  Clock,
  TickCircle,
  CloseCircle,
  Add,
  Play,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import {
  INTERVIEW_STATUS_CONFIG,
  INTERVIEW_TYPE_CONFIG,
} from '@/lib/constants'
import { useRecruiterInterviews } from '@/hooks/use-recruiter-interviews'
import type {
  RecruiterInterview,
  InterviewStatus,
} from '@/actions/recruiter-interviews'
import { StatCard } from '@/components/dashboard/stat-card'
import {
  InterviewDetailSheet,
  useInterviewSheet,
} from '@/components/dashboard/interview-detail-sheet'

// ── Helpers ──────────────────────────────────────────────────────────

function isToday(date: Date) {
  const d = new Date(date)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

function formatDateTime(date: Date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }) +
    ', ' +
    d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
}

// ── Status Filter Config ─────────────────────────────────────────────

const STATUS_FILTERS: {
  label: string
  value: InterviewStatus | 'all'
}[] = [
  { label: 'All', value: 'all' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

// ── InterviewRow ─────────────────────────────────────────────────────

function InterviewRow({
  interview,
  index,
  onSelect,
}: {
  interview: RecruiterInterview
  index: number
  onSelect: () => void
}) {
  const statusConfig = INTERVIEW_STATUS_CONFIG[interview.status]
  const typeConfig = INTERVIEW_TYPE_CONFIG[interview.interviewType]
  const canJoin =
    (interview.status === 'scheduled' || interview.status === 'in_progress') &&
    interview.meetLink
  const initials = interview.candidateName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="group hover:bg-accent/50 cursor-pointer border-b transition-colors"
      onClick={onSelect}
    >
      {/* Candidate */}
      <TableCell className="py-3.5">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="group-hover:text-primary truncate text-[13px] font-semibold transition-colors">
              {interview.candidateName}
            </p>
            <p className="text-muted-foreground truncate text-[11px]">
              {interview.candidateEmail}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Position */}
      <TableCell>
        <div className="text-muted-foreground flex items-center gap-1.5 text-[12px]">
          <Briefcase size={12} variant="Linear" />
          <span className="max-w-45 truncate">{interview.jobTitle}</span>
        </div>
      </TableCell>

      {/* Type */}
      <TableCell className="hidden sm:table-cell">
        <Badge
          variant="outline"
          className="text-[10px] font-medium"
        >
          {typeConfig?.label}
        </Badge>
      </TableCell>

      {/* Date & Time */}
      <TableCell className="hidden sm:table-cell">
        <div className="space-y-0.5">
          <div className="text-muted-foreground flex items-center gap-1.5 text-[12px]">
            <Calendar size={11} variant="Linear" />
            <span>{formatDateTime(interview.scheduledAt)}</span>
          </div>
          <p className="text-muted-foreground/70 text-[10px]">
            {interview.duration} min
          </p>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge
          variant={statusConfig?.variant as 'default'}
          className={cn('text-[10px] font-medium', statusConfig?.className)}
        >
          {statusConfig?.label}
        </Badge>
      </TableCell>

      {/* Action */}
      <TableCell>
        {canJoin && (
          <Button
            size="sm"
            className="h-7 gap-1.5 rounded-lg px-3 text-[11px]"
            onClick={(e) => {
              e.stopPropagation()
              window.open(interview.meetLink!, '_blank')
            }}
          >
            <Play size={12} variant="Bold" />
            Join
          </Button>
        )}
      </TableCell>
    </motion.tr>
  )
}

// ── Loading Skeleton ─────────────────────────────────────────────────

function InterviewsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-1.5 h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-lg" />
        ))}
      </div>
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────

export default function InterviewsPage() {
  const [{ q, status }, setQueryStates] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      status: parseAsString.withDefault('all'),
    },
    { clearOnDefault: true }
  )
  const [debouncedQ] = useDebounce(q, 300)
  const openSheet = useInterviewSheet((s) => s.open)
  const openSchedule = useScheduleInterviewSheet((s) => s.open)

  const { data: interviewsData, isLoading } = useRecruiterInterviews()
  const interviews = interviewsData ?? []

  // Stat counts
  const stats = useMemo(() => {
    const todayCount = interviews.filter((i) =>
      isToday(i.scheduledAt)
    ).length
    const scheduled = interviews.filter(
      (i) => i.status === 'scheduled'
    ).length
    const completed = interviews.filter(
      (i) => i.status === 'completed'
    ).length
    const cancelledNoShow = interviews.filter(
      (i) => i.status === 'cancelled' || i.status === 'no_show'
    ).length
    return { todayCount, scheduled, completed, cancelledNoShow }
  }, [interviews])

  // Filter tab counts
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: interviews.length }
    for (const f of STATUS_FILTERS) {
      if (f.value !== 'all') {
        c[f.value] = interviews.filter(
          (i) => i.status === f.value
        ).length
      }
    }
    return c
  }, [interviews])

  // Filtered list
  const filtered = useMemo(() => {
    return interviews.filter((i) => {
      const matchesSearch =
        !debouncedQ ||
        i.candidateName.toLowerCase().includes(debouncedQ.toLowerCase()) ||
        i.candidateEmail.toLowerCase().includes(debouncedQ.toLowerCase()) ||
        i.jobTitle.toLowerCase().includes(debouncedQ.toLowerCase())
      const matchesStatus = status === 'all' || i.status === status
      return matchesSearch && matchesStatus
    })
  }, [interviews, debouncedQ, status])

  const filteredIds = useMemo(() => filtered.map((i) => i.id), [filtered])

  const cardTitle = useMemo(() => {
    if (status === 'all') return 'All Interviews'
    const label = INTERVIEW_STATUS_CONFIG[status]?.label ?? ''
    return `${label} Interviews`
  }, [status])

  if (isLoading) return <InterviewsLoadingSkeleton />

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Interviews</h1>
            <p className="text-muted-foreground mt-0.5 text-[13px]">
              Manage and track all your candidate interviews
            </p>
          </div>
          <Button className="gap-2 rounded-lg" onClick={() => openSchedule()}>
            <Add size={16} variant="Linear" />
            Schedule Interview
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Calendar}
            label="Today's Interviews"
            value={String(stats.todayCount)}
            trend="On schedule"
            index={0}
          />
          <StatCard
            icon={Clock}
            label="Upcoming"
            value={String(stats.scheduled)}
            trend="Scheduled"
            index={1}
          />
          <StatCard
            icon={TickCircle}
            label="Completed"
            value={String(stats.completed)}
            trend="All time"
            index={2}
          />
          <StatCard
            icon={CloseCircle}
            label="Cancelled"
            value={String(stats.cancelledNoShow)}
            trend="Cancelled & no-shows"
            index={3}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setQueryStates({ status: filter.value })}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors',
                status === filter.value
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {filter.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                  status === filter.value
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {counts[filter.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-[15px] font-semibold">
                {cardTitle}
                <span className="text-muted-foreground ml-2 text-[12px] font-normal">
                  ({filtered.length})
                </span>
              </CardTitle>
              <div className="relative max-w-xs flex-1">
                <SearchNormal
                  size={14}
                  variant="Linear"
                  className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                />
                <Input
                  placeholder="Search by name, job, or email..."
                  value={q}
                  onChange={(e) => setQueryStates({ q: e.target.value })}
                  className="bg-muted/50 focus-visible:bg-background h-8 rounded-lg border-0 pl-8 text-[12px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Calendar
                  size={40}
                  variant="Linear"
                  className="text-muted-foreground/30 mb-3"
                />
                <p className="text-muted-foreground text-[13px] font-medium">
                  No interviews found
                </p>
                <p className="text-muted-foreground/70 mt-1 text-[12px]">
                  Try adjusting your search or filter
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-56">Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Type
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Date & Time
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((interview, i) => (
                    <InterviewRow
                      key={interview.id}
                      interview={interview}
                      index={i}
                      onSelect={() =>
                        openSheet(interview.id, filteredIds)
                      }
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <InterviewDetailSheet />
    </>
  )
}
