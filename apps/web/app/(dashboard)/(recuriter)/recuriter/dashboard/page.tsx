'use client'

import {
  Briefcase,
  People,
  DocumentText,
  Calendar,
} from '@hackhyre/ui/icons'
import { Skeleton } from '@hackhyre/ui/components/skeleton'

import { StatCard } from '@/components/dashboard/stat-card'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ApplicationsChart } from '@/components/dashboard/applications-chart'
import { RecentJobsTable } from '@/components/dashboard/recent-jobs-table'
import { RecentApplicationsList } from '@/components/dashboard/recent-applications-list'
import { useSession } from '@/lib/auth-client'
import { useRecruiterDashboard } from '@/hooks/use-recruiter-dashboard'

// ── Loading skeleton ──────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-48" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-[540px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const { data, isLoading: dashboardLoading } = useRecruiterDashboard()

  if (sessionLoading || dashboardLoading) {
    return <DashboardSkeleton />
  }

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'
  const stats = data?.stats ?? {
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    interviewingCount: 0,
  }
  const trends = data?.trends ?? {
    totalJobs: '',
    activeJobs: '',
    totalApplications: '',
    interviewing: '',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Welcome back, {firstName}
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Briefcase}
          label="Total Jobs"
          value={String(stats.totalJobs)}
          trend={trends.totalJobs}
          index={0}
        />
        <StatCard
          icon={People}
          label="Active Jobs"
          value={String(stats.activeJobs)}
          trend={trends.activeJobs}
          index={1}
        />
        <StatCard
          icon={DocumentText}
          label="Applications"
          value={String(stats.totalApplications)}
          trend={trends.totalApplications}
          index={2}
        />
        <StatCard
          icon={Calendar}
          label="Interviewing"
          value={String(stats.interviewingCount)}
          trend={trends.interviewing}
          index={3}
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <ApplicationsChart data={data?.chartData ?? []} />
          <RecentJobsTable jobs={data?.recentJobs ?? []} />
        </div>
        <div className="lg:col-span-2">
          <RecentApplicationsList
            applications={data?.recentApplications ?? []}
          />
        </div>
      </div>
    </div>
  )
}
