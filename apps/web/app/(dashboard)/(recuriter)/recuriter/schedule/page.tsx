'use client'

import { useMemo, useState } from 'react'
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
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Add,
  Play,
  Briefcase,
  Category,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import {
  INTERVIEW_STATUS_CONFIG,
  INTERVIEW_TYPE_CONFIG,
} from '@/lib/constants'
import { useRecruiterInterviews } from '@/hooks/use-recruiter-interviews'
import type { RecruiterInterview } from '@/actions/recruiter-interviews'
import {
  InterviewDetailSheet,
  useInterviewSheet,
} from '@/components/dashboard/interview-detail-sheet'
import { useScheduleInterviewSheet } from '@/components/dashboard/schedule-interview-sheet'

// ── Helpers ──────────────────────────────────────────────────────────

type ViewMode = 'weekly' | 'monthly'

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? 6 : day - 1
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6)
  const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' })
  const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' })
  const year = weekEnd.getFullYear()

  if (startMonth === endMonth) {
    return `${startMonth} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${year}`
  }
  return `${startMonth} ${weekStart.getDate()} – ${endMonth} ${weekEnd.getDate()}, ${year}`
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const d = new Date(year, month, 1)
  while (d.getMonth() === month) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0]!)
}

const SHORT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// ── InterviewCard (compact, horizontal for weekly rows) ──────────────

function InterviewCardRow({
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
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className="group hover:border-primary/30 flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 transition-colors dark:bg-transparent"
      onClick={onSelect}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="group-hover:text-primary truncate text-[12px] font-semibold transition-colors">
          {interview.candidateName}
        </p>
        <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-[10px]">
          <Briefcase size={10} variant="Linear" />
          <span className="truncate">{interview.jobTitle}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
          <Clock size={10} variant="Linear" />
          {formatTime(interview.scheduledAt)}
        </div>
        <Badge
          variant="outline"
          className="h-5 px-1.5 text-[9px] font-medium"
        >
          {typeConfig?.label}
        </Badge>
        <Badge
          variant={statusConfig?.variant as 'default'}
          className={cn(
            'h-5 px-1.5 text-[9px] font-medium',
            statusConfig?.className
          )}
        >
          {statusConfig?.label}
        </Badge>
        {canJoin && (
          <Button
            size="sm"
            className="h-6 gap-1 rounded-md px-2 text-[10px]"
            onClick={(e) => {
              e.stopPropagation()
              window.open(interview.meetLink!, '_blank')
            }}
          >
            <Play size={10} variant="Bold" />
            Join
          </Button>
        )}
      </div>
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const today = new Date()
  const [view, setView] = useState<ViewMode>('weekly')
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today))
  const [currentMonth, setCurrentMonth] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }))

  const openSheet = useInterviewSheet((s) => s.open)
  const openSchedule = useScheduleInterviewSheet((s) => s.open)

  const { data: interviewsData, isLoading } = useRecruiterInterviews()
  const allInterviews = interviewsData ?? []

  // ── Weekly data ──────────────────────────────────────────────────

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  )

  const weekInterviewsByDay = useMemo(() => {
    const map = new Map<number, RecruiterInterview[]>()
    for (let i = 0; i < 7; i++) map.set(i, [])

    for (const interview of allInterviews) {
      const d = new Date(interview.scheduledAt)
      for (let i = 0; i < 7; i++) {
        if (isSameDay(d, weekDays[i]!)) {
          map.get(i)!.push(interview)
          break
        }
      }
    }

    for (const [, interviews] of map) {
      interviews.sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() -
          new Date(b.scheduledAt).getTime()
      )
    }
    return map
  }, [allInterviews, weekDays])

  const allWeekIds = useMemo(
    () =>
      Array.from(weekInterviewsByDay.values())
        .flat()
        .map((i) => i.id),
    [weekInterviewsByDay]
  )

  const totalThisWeek = allWeekIds.length

  // ── Monthly data ─────────────────────────────────────────────────

  const monthDays = useMemo(
    () => getDaysInMonth(currentMonth.year, currentMonth.month),
    [currentMonth]
  )

  const monthInterviewsByDate = useMemo(() => {
    const map = new Map<string, RecruiterInterview[]>()
    for (const day of monthDays) {
      map.set(day.toDateString(), [])
    }
    for (const interview of allInterviews) {
      const key = new Date(interview.scheduledAt).toDateString()
      if (map.has(key)) {
        map.get(key)!.push(interview)
      }
    }
    for (const [, interviews] of map) {
      interviews.sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() -
          new Date(b.scheduledAt).getTime()
      )
    }
    return map
  }, [allInterviews, monthDays])

  const allMonthIds = useMemo(
    () =>
      Array.from(monthInterviewsByDate.values())
        .flat()
        .map((i) => i.id),
    [monthInterviewsByDate]
  )

  // ── Navigation ───────────────────────────────────────────────────

  function navigateBack() {
    if (view === 'weekly') {
      setWeekStart((prev) => addDays(prev, -7))
    } else {
      setCurrentMonth((prev) => {
        const d = new Date(prev.year, prev.month - 1, 1)
        return { year: d.getFullYear(), month: d.getMonth() }
      })
    }
  }

  function navigateForward() {
    if (view === 'weekly') {
      setWeekStart((prev) => addDays(prev, 7))
    } else {
      setCurrentMonth((prev) => {
        const d = new Date(prev.year, prev.month + 1, 1)
        return { year: d.getFullYear(), month: d.getMonth() }
      })
    }
  }

  function goToToday() {
    if (view === 'weekly') {
      setWeekStart(startOfWeek(today))
    } else {
      setCurrentMonth({
        year: today.getFullYear(),
        month: today.getMonth(),
      })
    }
  }

  const headerTitle =
    view === 'weekly'
      ? formatWeekRange(weekStart)
      : formatMonthYear(new Date(currentMonth.year, currentMonth.month))

  const totalCount = view === 'weekly' ? totalThisWeek : allMonthIds.length

  // ── Loading ──────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1.5 h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-40 rounded-lg" />
        </div>
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-8 w-72" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Schedule</h1>
            <p className="text-muted-foreground mt-0.5 text-[13px]">
              {view === 'weekly' ? 'Weekly' : 'Monthly'} view of all scheduled
              interviews
            </p>
          </div>
          <Button className="gap-2 rounded-lg" onClick={() => openSchedule()}>
            <Add size={16} variant="Linear" />
            Schedule Interview
          </Button>
        </div>

        {/* Main Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Nav arrows */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={navigateBack}
                  >
                    <ArrowLeft size={14} variant="Linear" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={navigateForward}
                  >
                    <ArrowRight size={14} variant="Linear" />
                  </Button>
                </div>
                <CardTitle className="text-[15px] font-semibold">
                  {headerTitle}
                </CardTitle>
                <Badge variant="secondary" className="text-[11px] font-medium">
                  {totalCount} interview{totalCount !== 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                {/* View toggle */}
                <div className="bg-muted flex items-center gap-0.5 rounded-lg p-0.5">
                  <button
                    onClick={() => setView('weekly')}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors',
                      view === 'weekly'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Category size={12} variant="Linear" />
                    Weekly
                  </button>
                  <button
                    onClick={() => setView('monthly')}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors',
                      view === 'monthly'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Calendar size={12} variant="Linear" />
                    Monthly
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[12px]"
                  onClick={goToToday}
                >
                  Today
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-4">
            {view === 'weekly' ? (
              // ── Weekly View: Vertical day rows ────────────────────
              <div className="space-y-1">
                {weekDays.map((day, dayIndex) => {
                  const isDayToday = isSameDay(day, today)
                  const dayInterviews =
                    weekInterviewsByDay.get(dayIndex) ?? []
                  const scheduled = dayInterviews.filter(
                    (i) => i.status === 'scheduled'
                  ).length
                  const completed = dayInterviews.filter(
                    (i) => i.status === 'completed'
                  ).length
                  const other =
                    dayInterviews.length - scheduled - completed

                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        'flex gap-4 rounded-xl border p-3 transition-colors',
                        isDayToday
                          ? 'border-primary/20 bg-primary/2'
                          : 'border-transparent hover:bg-accent/30'
                      )}
                    >
                      {/* Day label (left) */}
                      <div
                        className={cn(
                          'flex w-16 shrink-0 flex-col items-center justify-center rounded-xl py-3',
                          isDayToday
                            ? 'bg-primary/10'
                            : 'bg-muted/60'
                        )}
                      >
                        <p
                          className={cn(
                            'text-[10px] font-medium uppercase tracking-wider',
                            isDayToday
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        >
                          {SHORT_DAY_NAMES[day.getDay()]}
                        </p>
                        <p
                          className={cn(
                            'text-[16px] font-bold',
                            isDayToday
                              ? 'text-primary'
                              : 'text-foreground'
                          )}
                        >
                          {getOrdinalSuffix(day.getDate())}
                        </p>
                      </div>

                      {/* Content (middle) */}
                      <div className="min-w-0 flex-1">
                        {dayInterviews.length === 0 ? (
                          <div className="flex h-full items-center justify-center">
                            <p className="text-muted-foreground/40 text-[12px]">
                              No content
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {dayInterviews.map((interview, i) => (
                              <InterviewCardRow
                                key={interview.id}
                                interview={interview}
                                index={i}
                                onSelect={() =>
                                  openSheet(
                                    interview.id,
                                    allWeekIds
                                  )
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Stats (right) */}
                      <div className="text-muted-foreground flex w-12 shrink-0 flex-col items-end justify-center gap-1 text-[10px]">
                        <div className="flex items-center gap-1">
                          <Clock size={10} variant="Linear" />
                          <span>{scheduled}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase size={10} variant="Linear" />
                          <span>{completed}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={10} variant="Linear" />
                          <span>{other}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // ── Monthly View: Calendar grid ───────────────────────
              <div>
                {/* Weekday headers */}
                <div className="mb-2 grid grid-cols-7 gap-1">
                  {SHORT_DAY_NAMES.map((name) => (
                    <div
                      key={name}
                      className="text-muted-foreground py-2 text-center text-[10px] font-semibold uppercase tracking-wider"
                    >
                      {name}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Leading empty cells */}
                  {Array.from({
                    length: monthDays[0]?.getDay() ?? 0,
                  }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {/* Day cells */}
                  {monthDays.map((day) => {
                    const isDayToday = isSameDay(day, today)
                    const dayInterviews =
                      monthInterviewsByDate.get(day.toDateString()) ?? []
                    const hasInterviews = dayInterviews.length > 0

                    return (
                      <div
                        key={day.toDateString()}
                        className={cn(
                          'min-h-24 rounded-lg border p-1.5 transition-colors',
                          isDayToday
                            ? 'border-primary/30 bg-primary/3'
                            : 'border-border/50 hover:border-border'
                        )}
                      >
                        {/* Day number */}
                        <div className="mb-1 flex items-center justify-between">
                          <span
                            className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold',
                              isDayToday
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground'
                            )}
                          >
                            {day.getDate()}
                          </span>
                          {hasInterviews && (
                            <span className="bg-primary/15 text-primary rounded-full px-1.5 py-0.5 text-[9px] font-bold">
                              {dayInterviews.length}
                            </span>
                          )}
                        </div>

                        {/* Interview dots / mini cards */}
                        <div className="space-y-0.5">
                          {dayInterviews.slice(0, 3).map((interview) => {
                            const statusConfig =
                              INTERVIEW_STATUS_CONFIG[interview.status]
                            return (
                              <button
                                key={interview.id}
                                className="hover:bg-accent group/item flex w-full items-center gap-1 rounded px-1 py-0.5 text-left transition-colors"
                                onClick={() =>
                                  openSheet(
                                    interview.id,
                                    allMonthIds
                                  )
                                }
                              >
                                <span
                                  className={cn(
                                    'h-1.5 w-1.5 shrink-0 rounded-full',
                                    interview.status === 'scheduled'
                                      ? 'bg-blue-500'
                                      : interview.status === 'completed'
                                        ? 'bg-emerald-500'
                                        : interview.status === 'cancelled'
                                          ? 'bg-red-400'
                                          : interview.status === 'in_progress'
                                            ? 'bg-amber-500'
                                            : 'bg-gray-400'
                                  )}
                                />
                                <span className="group-hover/item:text-primary truncate text-[9px] font-medium">
                                  {formatTime(interview.scheduledAt)}{' '}
                                  {interview.candidateName.split(' ')[0]}
                                </span>
                              </button>
                            )
                          })}
                          {dayInterviews.length > 3 && (
                            <p className="text-muted-foreground px-1 text-[9px]">
                              +{dayInterviews.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <InterviewDetailSheet />
    </>
  )
}
