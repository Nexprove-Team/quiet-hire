'use client'

import { useState, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import { Badge } from '@hackhyre/ui/components/badge'
import { Input } from '@hackhyre/ui/components/input'
import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import { Progress } from '@hackhyre/ui/components/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hackhyre/ui/components/select'
import { Skeleton } from '@hackhyre/ui/components/skeleton'
import {
  SearchNormal,
  Briefcase,
  DocumentText,
  Calendar,
  Location,
  DollarCircle,
  TickCircle,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import type { ApplicationStatus } from '@/lib/mock-data'
import { APPLICATION_STATUS_CONFIG } from '@/lib/constants'
import { StatCard } from '@/components/dashboard/stat-card'
import { useApplications } from '@/hooks/use-applications'
import type { CandidateApplicationListItem } from '@/actions/applications'

const STATUS_FILTERS: { label: string; value: ApplicationStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'not_reviewed' },
  { label: 'Reviewing', value: 'under_review' },
  { label: 'Interview', value: 'interviewing' },
  { label: 'Hired', value: 'hired' },
  { label: 'Rejected', value: 'rejected' },
]

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

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          My Applications
        </h1>
        <p className="text-muted-foreground text-sm">
          Track and manage all your job applications in one place.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ApplicationsPage() {
  const { data, isLoading, error } = useApplications()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>(
    'all'
  )
  const [sortBy, setSortBy] = useState('date_desc')

  const applications = data?.applications ?? []
  const stats = data?.stats ?? {
    total: 0,
    active: 0,
    interviewing: 0,
    offers: 0,
  }

  const filtered = useMemo(() => {
    return applications
      .filter((app: CandidateApplicationListItem) => {
        const companyName = app.company?.name ?? ''
        const matchesSearch =
          !search ||
          app.job.title.toLowerCase().includes(search.toLowerCase()) ||
          companyName.toLowerCase().includes(search.toLowerCase())
        const matchesStatus =
          statusFilter === 'all' || app.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .sort(
        (a: CandidateApplicationListItem, b: CandidateApplicationListItem) => {
          switch (sortBy) {
            case 'date_asc':
              return (
                new Date(a.appliedAt).getTime() -
                new Date(b.appliedAt).getTime()
              )
            case 'company_az':
              return (a.company?.name ?? '').localeCompare(
                b.company?.name ?? ''
              )
            case 'match_desc':
              return (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0)
            case 'status':
              return a.status.localeCompare(b.status)
            default:
              return (
                new Date(b.appliedAt).getTime() -
                new Date(a.appliedAt).getTime()
              )
          }
        }
      )
  }, [applications, search, statusFilter, sortBy])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: applications.length }
    for (const s of STATUS_FILTERS) {
      if (s.value !== 'all') {
        c[s.value] = applications.filter(
          (a: CandidateApplicationListItem) => a.status === s.value
        ).length
      }
    }
    return c
  }, [applications])

  if (isLoading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <DocumentText
          size={40}
          variant="Linear"
          className="text-muted-foreground/30 mb-3"
        />
        <p className="text-muted-foreground text-[13px] font-medium">
          Failed to load applications
        </p>
        <p className="text-muted-foreground/70 mt-1 text-[12px]">
          Please try refreshing the page.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          My Applications
        </h1>
        <p className="text-muted-foreground text-sm">
          Track and manage all your job applications in one place.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DocumentText}
          label="Total"
          value={String(stats.total)}
          trend="All applications"
          index={0}
        />
        <StatCard
          icon={Briefcase}
          label="Active"
          value={String(stats.active)}
          trend="In progress"
          index={1}
        />
        <StatCard
          icon={Calendar}
          label="Interviews"
          value={String(stats.interviewing)}
          trend="Upcoming"
          index={2}
        />
        <StatCard
          icon={TickCircle}
          label="Offers"
          value={String(stats.offers)}
          trend="Received"
          index={3}
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors',
              statusFilter === filter.value
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {filter.label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                statusFilter === filter.value
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {counts[filter.value] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Applications Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-[15px] font-semibold">
              {statusFilter === 'all'
                ? 'All Applications'
                : (APPLICATION_STATUS_CONFIG[statusFilter]?.label ?? '') +
                  ' Applications'}
              <span className="text-muted-foreground ml-2 text-[12px] font-normal">
                ({filtered.length})
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative max-w-xs flex-1">
                <SearchNormal
                  size={14}
                  variant="Linear"
                  className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                />
                <Input
                  placeholder="Search by job or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-muted/50 focus-visible:bg-background h-8 rounded-lg border-0 pl-8 text-[12px]"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-muted/50 h-8 w-[140px] rounded-lg border-0 text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Newest First</SelectItem>
                  <SelectItem value="date_asc">Oldest First</SelectItem>
                  <SelectItem value="match_desc">Best Match</SelectItem>
                  <SelectItem value="company_az">Company A-Z</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <DocumentText
                size={40}
                variant="Linear"
                className="text-muted-foreground/30 mb-3"
              />
              <p className="text-muted-foreground text-[13px] font-medium">
                No applications found
              </p>
              <p className="text-muted-foreground/70 mt-1 text-[12px]">
                {search || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'Start applying to jobs to see them here'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(
                (app: CandidateApplicationListItem, index: number) => {
                  const config = APPLICATION_STATUS_CONFIG[app.status]
                  const companyName = app.company?.name ?? 'Unknown'
                  const initials = companyName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                  const score = app.relevanceScore ?? 0
                  const salary = formatSalary(
                    app.job.salaryMin,
                    app.job.salaryMax,
                    app.job.salaryCurrency
                  )

                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.25 }}
                    >
                      <Link
                        href={`/applications/${app.id}`}
                        className="group hover:bg-accent/50 flex items-start gap-3 rounded-xl p-3 transition-colors"
                      >
                        <Avatar className="mt-0.5 h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="group-hover:text-primary truncate text-[13px] font-semibold transition-colors">
                              {app.job.title}
                            </p>
                            <div className="flex shrink-0 items-center gap-2">
                              <div className="flex w-20 items-center gap-1.5">
                                <Progress
                                  value={score * 100}
                                  className={cn(
                                    'h-1.5 flex-1',
                                    score >= 0.8
                                      ? '[&>div]:bg-emerald-500'
                                      : score >= 0.65
                                        ? '[&>div]:bg-amber-500'
                                        : '[&>div]:bg-rose-500'
                                  )}
                                />
                                <span
                                  className={cn(
                                    'text-[11px] font-bold tabular-nums',
                                    score >= 0.8
                                      ? 'text-emerald-600'
                                      : score >= 0.65
                                        ? 'text-amber-600'
                                        : 'text-rose-600'
                                  )}
                                >
                                  {Math.round(score * 100)}%
                                </span>
                              </div>
                              <Badge
                                variant={config?.variant as 'default'}
                                className={cn(
                                  'shrink-0 text-[10px] font-medium',
                                  config?.className
                                )}
                              >
                                {config?.label}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-[12px]">
                            {companyName}
                          </p>
                          <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Location size={11} variant="Linear" />
                              {app.job.location ?? 'N/A'}
                              {app.job.isRemote && (
                                <Badge
                                  variant="outline"
                                  className="ml-0.5 px-1 py-0 text-[9px]"
                                >
                                  Remote
                                </Badge>
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase size={11} variant="Linear" />
                              {app.job.employmentType
                                .split('_')
                                .map(
                                  (w) => w.charAt(0).toUpperCase() + w.slice(1)
                                )
                                .join(' ')}
                            </span>
                            {salary && (
                              <span className="flex items-center gap-1">
                                <DollarCircle size={11} variant="Linear" />
                                {salary}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar size={11} variant="Linear" />
                              Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                }
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
