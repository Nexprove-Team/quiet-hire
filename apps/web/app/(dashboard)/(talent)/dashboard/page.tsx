'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Briefcase,
  DocumentText,
  Calendar,
  Bookmark,
  Clock,
  TickCircle,
  Messages,
  Profile,
} from '@hackhyre/ui/icons'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@hackhyre/ui/components/chart'
import { Badge } from '@hackhyre/ui/components/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@hackhyre/ui/components/table'

import { StatCard } from '@/components/dashboard/stat-card'
import { APPLICATION_STATUS_CONFIG } from '@/lib/constants'
import {
  MOCK_CANDIDATE_USER,
  MOCK_CANDIDATE_STATS,
  MOCK_CANDIDATE_APPLICATIONS,
  MOCK_CANDIDATE_ACTIVITY,
  MOCK_CANDIDATE_CHART_DATA,
} from '@/lib/candidate-mock-data'
import { cn } from '@hackhyre/ui/lib/utils'
import type { Icon } from '@hackhyre/ui/icons'

// ── Chart config ──────────────────────────────────────────────────

const chartConfig = {
  applications: {
    label: 'Applications',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

function CandidateApplicationsChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Applications This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-55 w-full">
          <AreaChart
            data={MOCK_CANDIDATE_CHART_DATA}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="fillCandidateApps"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              className="text-muted-foreground text-xs"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              className="text-muted-foreground text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#fillCandidateApps)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// ── Recent applications table ─────────────────────────────────────

function CandidateRecentApplications() {
  const recent = MOCK_CANDIDATE_APPLICATIONS.slice(0, 5)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Applications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6 text-[12px]">Company</TableHead>
              <TableHead className="text-[12px]">Job Title</TableHead>
              <TableHead className="text-[12px]">Status</TableHead>
              <TableHead className="pr-6 text-right text-[12px]">
                Applied
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((app) => {
              const statusConfig = APPLICATION_STATUS_CONFIG[app.status]
              return (
                <TableRow key={app.id}>
                  <TableCell className="pl-6 text-[13px] font-medium">
                    {app.companyName}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[13px]">
                    {app.jobTitle}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        statusConfig?.variant as
                          | 'default'
                          | 'secondary'
                          | 'outline'
                      }
                      className={cn(
                        'text-[10px] font-semibold',
                        statusConfig?.className
                      )}
                    >
                      {statusConfig?.label ?? app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground pr-6 text-right text-[13px]">
                    {formatRelativeDate(app.appliedAt)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ── Activity feed ─────────────────────────────────────────────────

const ACTIVITY_ICON_MAP: Record<string, { icon: Icon; className: string }> = {
  applied: { icon: Briefcase, className: 'bg-blue-500/10 text-blue-600' },
  status_change: {
    icon: TickCircle,
    className: 'bg-emerald-500/10 text-emerald-600',
  },
  interview: { icon: Calendar, className: 'bg-violet-500/10 text-violet-600' },
  message: { icon: Messages, className: 'bg-amber-500/10 text-amber-600' },
  profile_view: { icon: Profile, className: 'bg-pink-500/10 text-pink-600' },
}

function CandidateActivityFeed() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {MOCK_CANDIDATE_ACTIVITY.slice(0, 8).map((activity, i) => {
          const config = ACTIVITY_ICON_MAP[activity.type]
          const ActivityIcon = config?.icon ?? Clock
          const iconClass =
            config?.className ?? 'bg-muted text-muted-foreground'

          return (
            <div key={activity.id} className="flex gap-3 py-2.5">
              {/* Timeline line + icon */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    iconClass
                  )}
                >
                  <ActivityIcon size={14} variant="Bold" />
                </div>
                {i < 7 && <div className="bg-border mt-1 w-px flex-1" />}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pb-1">
                <p className="text-[13px] leading-tight font-medium">
                  {activity.title}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[12px] leading-tight">
                  {activity.description}
                </p>
                <p className="text-muted-foreground/60 mt-1 text-[11px]">
                  {formatRelativeDate(activity.timestamp)}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ── Helpers ───────────────────────────────────────────────────────

function formatRelativeDate(dateStr: string): string {
  const now = new Date('2026-02-12T12:00:00')
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1d ago'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Page ──────────────────────────────────────────────────────────

export default function CandidateDashboardPage() {
  const firstName = MOCK_CANDIDATE_USER.name.split(' ')[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome back, {firstName}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DocumentText}
          label="Applications"
          value={String(MOCK_CANDIDATE_STATS.totalApplications)}
          trend="+3 this week"
          index={0}
        />
        <StatCard
          icon={Briefcase}
          label="Active"
          value={String(MOCK_CANDIDATE_STATS.activeApplications)}
          trend="2 in review"
          index={1}
        />
        <StatCard
          icon={Calendar}
          label="Interviews"
          value={String(MOCK_CANDIDATE_STATS.interviewsUpcoming)}
          trend="Next: Feb 14"
          index={2}
        />
        <StatCard
          icon={Bookmark}
          label="Saved Jobs"
          value={String(MOCK_CANDIDATE_STATS.savedJobs)}
          trend="+2 this week"
          index={3}
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <CandidateApplicationsChart />
          <CandidateRecentApplications />
        </div>
        <div className="lg:col-span-2">
          <CandidateActivityFeed />
        </div>
      </div>
    </div>
  )
}
