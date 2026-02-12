"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hackhyre/ui/components/card";
import { Button } from "@hackhyre/ui/components/button";
import { Badge } from "@hackhyre/ui/components/badge";
import { Input } from "@hackhyre/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hackhyre/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@hackhyre/ui/components/dropdown-menu";
import {
  SearchNormal,
  AddCircle,
  Location,
  Calendar,
  People,
  Briefcase,
  More,
  Edit,
  Eye,
  Trash,
  Copy,
  TickCircle,
  Clock,
  PauseCircle,
  CloseCircle,
} from "@hackhyre/ui/icons";
import { cn } from "@hackhyre/ui/lib/utils";
import { MOCK_JOBS, type JobStatus, type MockJob } from "@/lib/mock-data";
import { JOB_STATUS_CONFIG } from "@/lib/constants";

const STATUS_FILTERS: { label: string; value: JobStatus | "all" }[] = [
  { label: "All Jobs", value: "all" },
  { label: "Open", value: "open" },
  { label: "Draft", value: "draft" },
  { label: "Paused", value: "paused" },
  { label: "Filled", value: "filled" },
];

const STATUS_ICON: Record<string, typeof TickCircle> = {
  open: TickCircle,
  draft: Clock,
  paused: PauseCircle,
  filled: CloseCircle,
};

function formatSalary(min: number | null, max: number | null, currency: string) {
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
    month: "short",
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

function JobRow({ job, index }: { job: MockJob; index: number }) {
  const config = JOB_STATUS_CONFIG[job.status];
  const StatusIcon = STATUS_ICON[job.status] ?? Clock;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="group border-b transition-colors hover:bg-accent/50"
    >
      <TableCell className="py-4">
        <Link href={`/jobs/${job.id}`} className="block">
          <p className="text-[13px] font-semibold group-hover:text-primary transition-colors">
            {job.title}
          </p>
          <div className="text-muted-foreground mt-1 flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <Briefcase size={11} variant="Bold" />
              {formatEmploymentType(job.employmentType)}
            </span>
            <span className="capitalize">{job.experienceLevel}</span>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <Badge
          variant={config?.variant as "default"}
          className={cn(
            "gap-1 text-[11px] font-medium",
            config?.className,
          )}
        >
          <StatusIcon size={11} variant="Bold" />
          {config?.label}
        </Badge>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {job.location && (
          <span className="text-muted-foreground flex items-center gap-1 text-[12px]">
            <Location size={12} variant="Bold" />
            {job.location}
            {job.isRemote && (
              <Badge variant="outline" className="ml-1 text-[9px] px-1 py-0">
                Remote
              </Badge>
            )}
          </span>
        )}
      </TableCell>
      <TableCell className="text-center">
        <span className="text-muted-foreground flex items-center justify-center gap-1 text-[12px]">
          <People size={13} variant="Bold" />
          {job.applicationCount}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="text-muted-foreground flex items-center gap-1 text-[12px]">
          <Calendar size={12} variant="Linear" />
          {formatDate(job.createdAt)}
        </span>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <span className="text-muted-foreground text-[12px]">
          {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency) ?? "—"}
        </span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <More size={16} variant="Linear" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 text-[13px]" asChild>
              <Link href={`/jobs/${job.id}`}>
                <Eye size={14} variant="Linear" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-[13px]">
              <Edit size={14} variant="Linear" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-[13px]">
              <Copy size={14} variant="Linear" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive gap-2 text-[13px]">
              <Trash size={14} variant="Linear" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </motion.tr>
  );
}

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");

  const filtered = MOCK_JOBS.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: MOCK_JOBS.length,
    open: MOCK_JOBS.filter((j) => j.status === "open").length,
    draft: MOCK_JOBS.filter((j) => j.status === "draft").length,
    paused: MOCK_JOBS.filter((j) => j.status === "paused").length,
    filled: MOCK_JOBS.filter((j) => j.status === "filled").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Job Listings</h1>
          <p className="text-muted-foreground mt-0.5 text-[13px]">
            Manage and track all your open positions
          </p>
        </div>
        <Button className="gap-2 rounded-xl" asChild>
          <Link href="/jobs/create">
            <AddCircle size={18} variant="Bold" />
            Create Job
          </Link>
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors whitespace-nowrap",
              statusFilter === filter.value
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {filter.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                statusFilter === filter.value
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground",
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
              {statusFilter === "all" ? "All Jobs" : JOB_STATUS_CONFIG[statusFilter]?.label + " Jobs"}
              <span className="text-muted-foreground ml-2 text-[12px] font-normal">
                ({filtered.length})
              </span>
            </CardTitle>
            <div className="relative max-w-xs flex-1">
              <SearchNormal
                size={14}
                variant="Linear"
                className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
              />
              <Input
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 rounded-lg bg-muted/50 border-0 pl-8 text-[12px] focus-visible:bg-background"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase size={40} variant="Linear" className="text-muted-foreground/30 mb-3" />
              <p className="text-[13px] font-medium text-muted-foreground">No jobs found</p>
              <p className="text-[12px] text-muted-foreground/70 mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-65">Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Location</TableHead>
                  <TableHead className="text-center">Applicants</TableHead>
                  <TableHead className="hidden md:table-cell">Posted</TableHead>
                  <TableHead className="hidden lg:table-cell">Salary</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((job, i) => (
                  <JobRow key={job.id} job={job} index={i} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
