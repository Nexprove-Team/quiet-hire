"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hackhyre/ui/components/card";
import { Button } from "@hackhyre/ui/components/button";
import { Badge } from "@hackhyre/ui/components/badge";
import { Separator } from "@hackhyre/ui/components/separator";
import { Avatar, AvatarFallback } from "@hackhyre/ui/components/avatar";
import { Progress } from "@hackhyre/ui/components/progress";
import {
  ArrowLeft,
  Briefcase,
  Location,
  Calendar,
  DollarCircle,
  People,
  Edit,
  Copy,
  Trash,
  TickCircle,
  Clock,
  PauseCircle,
  CloseCircle,
  Star,
  DocumentText,
  TaskSquare,
  Code,
} from "@hackhyre/ui/icons";
import { cn } from "@hackhyre/ui/lib/utils";
import {
  MOCK_JOBS,
  MOCK_APPLICATIONS,
  MOCK_COMPANY,
} from "@/lib/mock-data";
import { JOB_STATUS_CONFIG, APPLICATION_STATUS_CONFIG } from "@/lib/constants";
import { useCandidateSheet } from "@/hooks/use-candidate-sheet";

const STATUS_ICON: Record<string, typeof TickCircle> = {
  open: TickCircle,
  draft: Clock,
  paused: PauseCircle,
  filled: CloseCircle,
};

function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
) {
  if (!min && !max) return null;
  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(v);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatEmploymentType(type: string) {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatRelativeTime(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Yesterday";
  return `${diffD}d ago`;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Briefcase;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
        <Icon size={15} variant="Bold" className="text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="mt-0.5 text-[13px] font-medium">{value}</p>
      </div>
    </div>
  );
}

function ListSection({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof DocumentText;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} variant="Bold" className="text-primary" />
        <h3 className="text-[13px] font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className="text-muted-foreground flex items-start gap-2.5 text-[13px]"
          >
            <span className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const job = MOCK_JOBS.find((j) => j.id === id);
  const openCandidate = useCandidateSheet((s) => s.open);

  if (!job) {
    notFound();
  }

  const applications = MOCK_APPLICATIONS.filter((a) => a.jobId === job.id);
  const applicantIds = applications.map((a) => a.candidateId);
  const statusConfig = JOB_STATUS_CONFIG[job.status];
  const StatusIcon = STATUS_ICON[job.status] ?? Clock;
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <div className="space-y-6">
      {/* Back + Actions Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground w-fit gap-2"
          asChild
        >
          <Link href="/jobs">
            <ArrowLeft size={16} variant="Linear" />
            Back to Jobs
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-lg text-[13px]">
            <Copy size={14} variant="Linear" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-lg text-[13px]">
            <Edit size={14} variant="Linear" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive gap-2 rounded-lg text-[13px]"
          >
            <Trash size={14} variant="Linear" />
            Delete
          </Button>
        </div>
      </div>

      {/* Title + Status */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
          <Badge
            variant={statusConfig?.variant as "default"}
            className={cn("gap-1 text-[11px] font-medium", statusConfig?.className)}
          >
            <StatusIcon size={11} variant="Bold" />
            {statusConfig?.label}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1.5 text-[13px]">
          {MOCK_COMPANY.name} &middot; Posted {formatDate(job.createdAt)}
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column — Description, Requirements, Job Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">About this role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Requirements + Responsibilities + Skills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Card>
              <CardContent className="space-y-6 pt-6">
                {job.responsibilities.length > 0 && (
                  <ListSection icon={TaskSquare} title="Responsibilities" items={job.responsibilities} />
                )}
                {job.requirements.length > 0 && (
                  <>
                    <Separator />
                    <ListSection icon={DocumentText} title="Requirements" items={job.requirements} />
                  </>
                )}
                {job.skills.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Code size={16} variant="Bold" className="text-primary" />
                        <h3 className="text-[13px] font-semibold">Skills</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, i) => (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04, duration: 0.2 }}
                          >
                            <Badge variant="secondary" className="px-2.5 py-1 text-[12px] font-medium">
                              {skill}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Details — moved below content */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-x-6 sm:grid-cols-2">
                  <InfoRow
                    icon={Briefcase}
                    label="Employment Type"
                    value={formatEmploymentType(job.employmentType)}
                  />
                  <InfoRow
                    icon={Star}
                    label="Experience Level"
                    value={<span className="capitalize">{job.experienceLevel}</span>}
                  />
                  <InfoRow
                    icon={Location}
                    label="Location"
                    value={
                      <span className="flex items-center gap-1.5">
                        {job.location ?? "Not specified"}
                        {job.isRemote && (
                          <Badge variant="outline" className="px-1 py-0 text-[9px]">
                            Remote
                          </Badge>
                        )}
                      </span>
                    }
                  />
                  {salary && (
                    <InfoRow icon={DollarCircle} label="Salary Range" value={salary} />
                  )}
                  <InfoRow icon={Calendar} label="Posted Date" value={formatDate(job.createdAt)} />
                  <InfoRow
                    icon={People}
                    label="Total Applicants"
                    value={`${job.applicationCount} applicants`}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column — Applicants + Pipeline */}
        <div className="space-y-6">
          {/* Applicants */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[15px] font-semibold">
                    Applicants
                    <span className="text-muted-foreground ml-2 text-[12px] font-normal">
                      ({applications.length})
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <People size={32} variant="Linear" className="text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground text-[13px]">No applicants yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {applications.map((app, i) => {
                      const appConfig = APPLICATION_STATUS_CONFIG[app.status];
                      const initials = app.candidateName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase();

                      return (
                        <motion.button
                          key={app.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.2 }}
                          onClick={() => openCandidate(app.candidateId, applicantIds)}
                          className="hover:bg-accent/50 flex w-full items-center gap-3 rounded-xl p-2.5 transition-colors text-left"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-semibold">
                              {app.candidateName}
                            </p>
                            <p className="text-muted-foreground truncate text-[10px]">
                              {app.candidateEmail}
                            </p>
                          </div>
                          <Badge
                            variant={appConfig?.variant as "default"}
                            className={cn("shrink-0 text-[9px] font-medium", appConfig?.className)}
                          >
                            {appConfig?.label}
                          </Badge>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-[15px] font-semibold">Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(APPLICATION_STATUS_CONFIG).map(([status, config]) => {
                  const count = applications.filter((a) => a.status === status).length;
                  return (
                    <div key={status} className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">{config.label}</span>
                      <Badge
                        variant={config.variant as "default"}
                        className={cn(
                          "min-w-6 justify-center text-[10px] font-bold tabular-nums",
                          config.className,
                        )}
                      >
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
