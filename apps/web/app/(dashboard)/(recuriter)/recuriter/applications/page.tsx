'use client'

import { useMemo } from 'react'
import { motion } from 'motion/react'
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
import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import { Progress } from '@hackhyre/ui/components/progress'
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
  DocumentText,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { APPLICATION_STATUS_CONFIG } from '@/lib/constants'
import { useCandidateSheet } from '@/hooks/use-candidate-sheet'
import { useRecruiterApplications } from '@/hooks/use-recruiter-applications'
import { ApplicationStatusSelect } from '@/components/applications/status-select'
import type {
  RecruiterApplicationListItem,
  ApplicationStatus,
} from '@/actions/recruiter-applications'

const STATUS_FILTERS: { label: string; value: ApplicationStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'not_reviewed' },
  { label: 'Reviewing', value: 'under_review' },
  { label: 'Interview', value: 'interviewing' },
  { label: 'Hired', value: 'hired' },
  { label: 'Rejected', value: 'rejected' },
]

function formatRelativeTime(date: Date) {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffH < 1) return 'Just now'
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return 'Yesterday'
  return `${diffD}d ago`
}

function ApplicationRow({
  app,
  index,
  onSelect,
}: {
  app: RecruiterApplicationListItem
  index: number
  onSelect: () => void
}) {
  const config = APPLICATION_STATUS_CONFIG[app.status]
  const initials = app.candidateName
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
      <TableCell className="py-3.5">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="group-hover:text-primary truncate text-[13px] font-semibold transition-colors">
              {app.candidateName}
            </p>
            <p className="text-muted-foreground truncate text-[11px]">
              {app.candidateEmail}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-muted-foreground flex items-center gap-1.5 text-[12px]">
          <Briefcase size={12} variant="Linear" />
          <span className="max-w-45 truncate">{app.jobTitle}</span>
        </div>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <ApplicationStatusSelect
          applicationId={app.id}
          currentStatus={app.status}
        />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {app.relevanceScore !== null ? (
          <div className="flex w-24 items-center gap-2">
            <Progress
              value={app.relevanceScore * 100}
              className="h-1.5 flex-1"
            />
            <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
              {Math.round(app.relevanceScore * 100)}%
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground text-[11px]">—</span>
        )}
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <span className="text-muted-foreground text-[11px]">
          {formatRelativeTime(app.createdAt)}
        </span>
      </TableCell>
    </motion.tr>
  )
}

function ApplicationsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground mt-0.5 text-[13px]">
          Review and manage all candidate applications
        </p>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-lg" />
        ))}
      </div>
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ApplicationsPage() {
  const [{ q, status }, setQueryStates] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      status: parseAsString.withDefault('all'),
    },
    { clearOnDefault: true }
  )
  const [debouncedQ] = useDebounce(q, 300)

  const { data: allApplications = [], isLoading } =
    useRecruiterApplications()
  const openCandidate = useCandidateSheet((s) => s.open)

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: allApplications.length }
    for (const f of STATUS_FILTERS) {
      if (f.value !== 'all') {
        c[f.value] = allApplications.filter((a) => a.status === f.value).length
      }
    }
    return c
  }, [allApplications])

  const filtered = useMemo(() => {
    return allApplications.filter((app) => {
      const matchesSearch =
        !debouncedQ ||
        app.candidateName.toLowerCase().includes(debouncedQ.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(debouncedQ.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(debouncedQ.toLowerCase())
      const matchesStatus = status === 'all' || app.status === status
      return matchesSearch && matchesStatus
    })
  }, [allApplications, debouncedQ, status])

  const filteredApplicationIds = useMemo(
    () => filtered.map((a) => a.id),
    [filtered]
  )

  if (isLoading) return <ApplicationsLoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground mt-0.5 text-[13px]">
          Review and manage all candidate applications
        </p>
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
              {status === 'all'
                ? 'All Applications'
                : (APPLICATION_STATUS_CONFIG[status]?.label ?? '') +
                  ' Applications'}
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
              <DocumentText
                size={40}
                variant="Linear"
                className="text-muted-foreground/30 mb-3"
              />
              <p className="text-muted-foreground text-[13px] font-medium">
                No applications found
              </p>
              <p className="text-muted-foreground/70 mt-1 text-[12px]">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-60">Candidate</TableHead>
                  <TableHead>Applied For</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Match</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Applied
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app, i) => (
                  <ApplicationRow
                    key={app.id}
                    app={app}
                    index={i}
                    onSelect={() =>
                      openCandidate(app.id, filteredApplicationIds)
                    }
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
