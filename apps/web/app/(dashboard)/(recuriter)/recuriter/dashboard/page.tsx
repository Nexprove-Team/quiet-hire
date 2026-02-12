"use client";

import { Briefcase, People, DocumentText, Calendar } from "@hackhyre/ui/icons";

import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ApplicationsChart } from "@/components/dashboard/applications-chart";
import { RecentJobsTable } from "@/components/dashboard/recent-jobs-table";
import { RecentApplicationsList } from "@/components/dashboard/recent-applications-list";
import { MOCK_STATS, MOCK_USER } from "@/lib/mock-data";

export default function DashboardPage() {
  const firstName = MOCK_USER.name.split(" ")[0];

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
          value={String(MOCK_STATS.totalJobs)}
          trend="+3 this month"
          index={0}
        />
        <StatCard
          icon={People}
          label="Active Candidates"
          value={String(MOCK_STATS.totalCandidates)}
          trend="+18% this month"
          index={1}
        />
        <StatCard
          icon={DocumentText}
          label="Applications"
          value={String(MOCK_STATS.totalApplications)}
          trend="+12 today"
          index={2}
        />
        <StatCard
          icon={Calendar}
          label="Interviews"
          value={String(MOCK_STATS.interviewsScheduled)}
          trend="3 this week"
          index={3}
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <ApplicationsChart />
          <RecentJobsTable />
        </div>
        <div className="lg:col-span-2">
          <RecentApplicationsList />
        </div>
      </div>
    </div>
  );
}
