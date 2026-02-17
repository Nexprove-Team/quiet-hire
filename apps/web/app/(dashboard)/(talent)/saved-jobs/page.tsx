'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { parseAsString, useQueryStates } from 'nuqs'
import { useDebounce } from 'use-debounce'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import { Badge } from '@hackhyre/ui/components/badge'
import { Input } from '@hackhyre/ui/components/input'
import { Button } from '@hackhyre/ui/components/button'
import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hackhyre/ui/components/select'
import {
  Bookmark,
  Briefcase,
  Calendar,
  SearchNormal,
  Location,
  DollarCircle,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { StatCard } from '@/components/dashboard/stat-card'
import { useSavedJobsList, useToggleSaveJob } from '@/hooks/use-saved-jobs'
import type { SavedJobListItem } from '@/actions/saved-jobs'

// --- Helpers ---

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

// --- Filters ---

type SavedJobFilter = 'all' | 'active' | 'expired'

const FILTERS: { label: string; value: SavedJobFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Expired', value: 'expired' },
]

function isExpired(item: SavedJobListItem) {
  return item.job.status === 'filled' || item.job.status === 'paused'
}

// --- Page ---

export default function SavedJobsPage() {
  const { data, isLoading } = useSavedJobsList()
  const { mutate: toggleSave } = useToggleSaveJob()

  const savedJobs = data?.savedJobs ?? []
  const stats = data?.stats ?? { total: 0, active: 0, expired: 0 }

  const [{ q, status, sort }, setQueryStates] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      status: parseAsString.withDefault('all'),
      sort: parseAsString.withDefault('date_desc'),
    },
    { clearOnDefault: true }
  )
  const [debouncedQ] = useDebounce(q, 300)

  const counts = useMemo(() => {
    return {
      all: savedJobs.length,
      active: savedJobs.filter((j) => j.job.status === 'open').length,
      expired: savedJobs.filter((j) => isExpired(j)).length,
    }
  }, [savedJobs])

  const filtered = useMemo(() => {
    return savedJobs
      .filter((item) => {
        const companyName = item.company?.name ?? ''
        const matchesSearch =
          !debouncedQ ||
          item.job.title.toLowerCase().includes(debouncedQ.toLowerCase()) ||
          companyName.toLowerCase().includes(debouncedQ.toLowerCase())
        const matchesFilter =
          status === 'all' ||
          (status === 'active' && item.job.status === 'open') ||
          (status === 'expired' && isExpired(item))
        return matchesSearch && matchesFilter
      })
      .sort((a, b) => {
        switch (sort) {
          case 'date_asc':
            return (
              new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()
            )
          case 'salary_desc': {
            const aMax = a.job.salaryMax ?? a.job.salaryMin ?? 0
            const bMax = b.job.salaryMax ?? b.job.salaryMin ?? 0
            return bMax - aMax
          }
          case 'company_az':
            return (a.company?.name ?? '').localeCompare(
              b.company?.name ?? ''
            )
          default:
            return (
              new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
            )
        }
      })
  }, [savedJobs, debouncedQ, status, sort])

  function handleUnsave(item: SavedJobListItem) {
    toggleSave(item.jobId, {
      onSuccess: () => {
        toast.success(`Removed "${item.job.title}" from saved jobs`)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight">
            Saved Jobs
          </h1>
          <p className="text-muted-foreground text-sm">
            Jobs you&apos;ve bookmarked for later review.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted/50 h-24 animate-pulse rounded-xl"
            />
          ))}
        </div>
        <div className="bg-muted/50 h-96 animate-pulse rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          Saved Jobs
        </h1>
        <p className="text-muted-foreground text-sm">
          Jobs you&apos;ve bookmarked for later review.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Bookmark}
          label="Total Saved"
          value={String(stats.total)}
          trend="All bookmarks"
          index={0}
        />
        <StatCard
          icon={Briefcase}
          label="Active"
          value={String(stats.active)}
          trend="Still hiring"
          index={1}
        />
        <StatCard
          icon={Calendar}
          label="Expired"
          value={String(stats.expired)}
          trend="Filled or paused"
          index={2}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setQueryStates({ status: f.value })}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors',
              status === f.value
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {f.label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                status === f.value
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {counts[f.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Saved Jobs Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-[15px] font-semibold">
              {status === 'all'
                ? 'All Saved Jobs'
                : status === 'active'
                  ? 'Active Jobs'
                  : 'Expired Jobs'}
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
                  value={q}
                  onChange={(e) => setQueryStates({ q: e.target.value })}
                  className="bg-muted/50 focus-visible:bg-background h-8 rounded-lg border-0 pl-8 text-[12px]"
                />
              </div>
              <Select value={sort} onValueChange={(v) => setQueryStates({ sort: v })}>
                <SelectTrigger className="bg-muted/50 h-8 w-35 rounded-lg border-0 text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Newest First</SelectItem>
                  <SelectItem value="date_asc">Oldest First</SelectItem>
                  <SelectItem value="salary_desc">Highest Salary</SelectItem>
                  <SelectItem value="company_az">Company A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bookmark
                size={40}
                variant="Linear"
                className="text-muted-foreground/30 mb-3"
              />
              <p className="text-muted-foreground text-[13px] font-medium">
                No saved jobs found
              </p>
              <p className="text-muted-foreground/70 mt-1 text-[12px]">
                {q || status !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'Browse open positions and bookmark the ones you like'}
              </p>
              {!q && status === 'all' && (
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/jobs-listing">Browse Jobs</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item, index) => {
                const companyName = item.company?.name ?? 'Unknown'
                const initials = companyName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
                const salary = formatSalary(
                  item.job.salaryMin,
                  item.job.salaryMax,
                  item.job.salaryCurrency
                )
                const expired = isExpired(item)

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                  >
                    <div className="group hover:bg-accent/50 flex items-start gap-3 rounded-xl p-3 transition-colors">
                      <Link
                        href={`/jobs-listing/${item.jobId}`}
                        className="flex min-w-0 flex-1 items-start gap-3"
                      >
                        <Avatar className="mt-0.5 h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p
                              className={cn(
                                'group-hover:text-primary truncate text-[13px] font-semibold transition-colors',
                                expired && 'text-muted-foreground'
                              )}
                            >
                              {item.job.title}
                            </p>
                            {expired && (
                              <Badge
                                variant="destructive"
                                className="shrink-0 text-[10px] font-medium"
                              >
                                {item.job.status === 'filled'
                                  ? 'Filled'
                                  : 'Paused'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-[12px]">
                            {companyName}
                          </p>
                          <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Location size={11} variant="Linear" />
                              {item.job.location ?? 'Remote'}
                              {item.job.isRemote && (
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
                              {item.job.employmentType
                                .split('_')
                                .map(
                                  (w) =>
                                    w.charAt(0).toUpperCase() + w.slice(1)
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
                              Saved {formatDistanceToNow(new Date(item.savedAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={() => handleUnsave(item)}
                        className="text-primary hover:text-primary/70 mt-1 shrink-0 transition-colors"
                        aria-label={`Remove ${item.job.title} from saved jobs`}
                      >
                        <Bookmark size={18} variant="Bold" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
