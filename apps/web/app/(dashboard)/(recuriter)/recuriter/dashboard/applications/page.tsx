"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hackhyre/ui/components/card";
import { Badge } from "@hackhyre/ui/components/badge";
import { Input } from "@hackhyre/ui/components/input";
import { Button } from "@hackhyre/ui/components/button";
import {
  Avatar,
  AvatarFallback,
} from "@hackhyre/ui/components/avatar";
import { Progress } from "@hackhyre/ui/components/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hackhyre/ui/components/table";
import {
  SearchNormal,
  Briefcase,
  Calendar,
  Star,
  DocumentText,
  People,
} from "@hackhyre/ui/icons";
import { cn } from "@hackhyre/ui/lib/utils";
import {
  MOCK_APPLICATIONS,
  type ApplicationStatus,
  type MockApplication,
} from "@/lib/mock-data";
import { APPLICATION_STATUS_CONFIG } from "@/lib/constants";
import { useCandidateSheet } from "@/hooks/use-candidate-sheet";

const STATUS_FILTERS: { label: string; value: ApplicationStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "not_reviewed" },
  { label: "Reviewing", value: "under_review" },
  { label: "Interview", value: "interviewing" },
  { label: "Hired", value: "hired" },
  { label: "Rejected", value: "rejected" },
];

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

function ApplicationRow({
  app,
  index,
  onSelect,
}: {
  app: MockApplication;
  index: number;
  onSelect: () => void;
}) {
  const config = APPLICATION_STATUS_CONFIG[app.status];
  const initials = app.candidateName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="group cursor-pointer border-b transition-colors hover:bg-accent/50"
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
            <p className="text-[13px] font-semibold group-hover:text-primary transition-colors truncate">
              {app.candidateName}
            </p>
            <p className="text-muted-foreground text-[11px] truncate">{app.candidateEmail}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Briefcase size={12} variant="Linear" />
          <span className="truncate max-w-[180px]">{app.jobTitle}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={config?.variant as "default"}
          className={cn("text-[10px] font-medium", config?.className)}
        >
          {config?.label}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {app.relevanceScore !== null ? (
          <div className="flex items-center gap-2 w-24">
            <Progress value={app.relevanceScore * 100} className="h-1.5 flex-1" />
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
  );
}

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const openCandidate = useCandidateSheet((s) => s.open);

  const filtered = MOCK_APPLICATIONS.filter((app) => {
    const matchesSearch =
      !search ||
      app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCandidateIds = filtered.map((a) => a.candidateId);

  const counts: Record<string, number> = { all: MOCK_APPLICATIONS.length };
  for (const s of STATUS_FILTERS) {
    if (s.value !== "all") {
      counts[s.value] = MOCK_APPLICATIONS.filter((a) => a.status === s.value).length;
    }
  }

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
              {statusFilter === "all"
                ? "All Applications"
                : (APPLICATION_STATUS_CONFIG[statusFilter]?.label ?? "") + " Applications"}
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
                placeholder="Search by name, job, or email..."
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
              <DocumentText size={40} variant="Linear" className="text-muted-foreground/30 mb-3" />
              <p className="text-[13px] font-medium text-muted-foreground">No applications found</p>
              <p className="text-[12px] text-muted-foreground/70 mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[240px]">Candidate</TableHead>
                  <TableHead>Applied For</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Match</TableHead>
                  <TableHead className="hidden sm:table-cell">Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app, i) => (
                  <ApplicationRow
                    key={app.id}
                    app={app}
                    index={i}
                    onSelect={() => openCandidate(app.candidateId, filteredCandidateIds)}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
